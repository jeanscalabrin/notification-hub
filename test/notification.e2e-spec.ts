import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '@/prisma.service';
import { NotificationChannel } from '../generated/prisma/enums';

describe('Notification (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await prisma.notification.deleteMany();
    await prisma.user.deleteMany();

    await request(app.getHttpServer()).post('/auth/signup').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '123456',
      });

    token = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should return notification created', () => {
    const payload = {
      title: 'Test',
      body: 'Body',
      channel: NotificationChannel.IN_APP,
    };

    return request(app.getHttpServer())
      .post('/notifications')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
  });

  it('should return list notifications', async () => {
    const payload = {
      title: 'Test',
      body: 'Body',
      channel: NotificationChannel.IN_APP,
    };

    await request(app.getHttpServer())
      .post('/notifications')
      .send(payload)
      .set('Authorization', `Bearer ${token}`);

    await request(app.getHttpServer())
      .post('/notifications')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/notifications')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveLength(2);
  });

  it('should return notification by id', async () => {
    const payload = {
      title: 'Test',
      body: 'Body',
      channel: NotificationChannel.IN_APP,
    };

    const resNotif = await request(app.getHttpServer())
      .post('/notifications')
      .send(payload)
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app.getHttpServer())
      .get(`/notifications/${resNotif.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.id).toMatch(resNotif.body.id);
  });

  it('should return 401 without token', async () => {
    await request(app.getHttpServer())
      .get(`/notifications`)
      .set('Authorization', `Bearer 1234`)
      .expect(401);
  });
});
