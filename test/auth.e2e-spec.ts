import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '@/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('/auth/signup (POST)', () => {
    it('should return user created', () => {
      const payload = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      };

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(payload)
        .expect(201);
    });

    it('should not return passwordHash on signup', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: '123456',
        })
        .expect(201);

      expect(response.body.passwordHash).toBeUndefined();
    });
  });

  it('/auth/login (POST)', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '123456',
      })
      .expect(200);

    expect(response.body.accessToken).toBeDefined();
  });

  it('/auth/me (GET)', async () => {
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

    const token = loginResponse.body.accessToken;

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.email).toBe('john@example.com');
  });

  it('/auth/me (GET) reject unauthenticated user', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });
});
