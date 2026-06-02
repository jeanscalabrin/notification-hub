import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '@/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    await prisma.user.deleteMany();
    await app.init();
  });

  it('/auth/signup (POST)', () => {
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

  afterEach(async () => {
    await app.close();
  });

  it('/auth/login', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '123456',
      })
      .expect(200);

    expect(response.body.accessToken).toBeDefined();
  });
});
