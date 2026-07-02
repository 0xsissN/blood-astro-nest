import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('/auth/register (POST) - should register a user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          nombre: 'Test User',
          correo: 'test@test.com',
          password: 'password123',
          rol: 'ADMIN',
        })
        .expect(201);
    });

    it('/auth/login (POST) - should login', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          correo: 'test@test.com',
          password: 'password123',
        })
        .expect(200);
    });
  });

  describe('Campaigns', () => {
    let authToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          correo: 'test@test.com',
          password: 'password123',
        });
      authToken = response.body.accessToken || response.headers['set-cookie']?.[0];
    });

    it('/campaigns (POST) - should create a campaign', () => {
      return request(app.getHttpServer())
        .post('/campaigns')
        .set('Cookie', `access_token=${authToken}`)
        .send({
          nombre: 'Campaña Test',
          lugar: 'Hospital Central',
          fechaInicio: '2026-01-01',
          fechaFin: '2026-01-31',
        })
        .expect(201);
    });

    it('/campaigns (GET) - should return campaigns', () => {
      return request(app.getHttpServer())
        .get('/campaigns')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);
    });
  });

  describe('Donors', () => {
    let authToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          correo: 'test@test.com',
          password: 'password123',
        });
      authToken = response.body.accessToken || response.headers['set-cookie']?.[0];
    });

    it('/donors (GET) - should return donors', () => {
      return request(app.getHttpServer())
        .get('/donors')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);
    });

    it('/donors/search?query=Juan (GET) - should search donors', () => {
      return request(app.getHttpServer())
        .get('/donors/search?query=Juan')
        .set('Cookie', `access_token=${authToken}`)
        .expect(200);
    });
  });
});
