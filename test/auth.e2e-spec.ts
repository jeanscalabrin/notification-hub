import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
});
