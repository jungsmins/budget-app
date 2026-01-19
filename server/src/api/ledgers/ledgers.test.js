const request = require('supertest');
const app = require('../../app');

describe('GET /api/ledgers는', () => {
  describe('성공시', () => {
    test('가계부 목록을 담은 배열과 201을 반환한다.', async () => {
      const res = await request(app).get('/api/ledgers');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    test('limit이 있다면 limit 갯수만큼 가계부를 담은 배열과 200을 반환한다.', async () => {
      const res = await request(app).get('/api/ledgers').query({ limit: 2 });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('실패시', () => {
    test('limit이 숫자형이 아닐 경우 400을 반환한다.', async () => {
      const res = await request(app).get('/api/ledgers').query({ limit: 'a' });

      expect(res.status).toBe(400);
    });
  });
});

describe('POST /api/ledgers는', () => {
  describe('성공시', () => {
    test('새로운 가계부를 생성하고 201을 반환한다.', async () => {
      const res = await request(app).post('/api/ledgers').send({
        name: '새 가계부',
        description: '새로운 가계부입니다',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', '새 가계부');
      expect(res.body).toHaveProperty('description', '새로운 가계부입니다');
    });
  });

  describe('실패시', () => {
    test('name이 없으면 400을 반환한다.', async () => {
      const res = await request(app).post('/api/ledgers').send({
        description: '새로운 가계부입니다.',
      });

      expect(res.status).toBe(400);
    });

    test('description이 없으면 400을 반환한다.', async () => {
      const res = await request(app).post('/api/ledgers').send({
        name: '새 가계부',
      });

      expect(res.status).toBe(400);
    });

    test('name과 description이 모두 없으면 400을 반환한다.', async () => {
      const res = await request(app).post('/api/ledgers').send({});

      expect(res.status).toBe(400);
    });
  });
});

describe('GET /api/ledgers/:id는', () => {
  describe('성공시', () => {
    test('id에 해당하는 가계부 객체와 200을 반환한다.', async () => {
      const res = await request(app).get('/api/ledgers/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('description');
    });
  });

  describe('실패시', () => {
    test('존재하지 않는 id일 경우 404를 반환한다.', async () => {
      const res = await request(app).get('/api/ledgers/9999');

      expect(res.status).toBe(404);
    });

    test('id가 숫자형이 아닐 경우 400을 반환한다.', async () => {
      const res = await request(app).get('/api/ledgers/abc');

      expect(res.status).toBe(400);
    });
  });
});
