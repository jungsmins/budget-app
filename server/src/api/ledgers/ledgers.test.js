jest.mock('./ledgers.model');
const model = require('./ledgers.model');
const request = require('supertest');
const app = require('../../app');
const AppError = require('../../errors/AppError');

const mockLedgerId = '507f1f77bcf86cd799439011';
const mockNotFoundLedgerId = '507f1f77bcf86cd799439099';

const mockLedger = {
  id: mockLedgerId,
  name: '테스트 가계부',
  description: '테스트 설명',
};

const mockLedgerList = [
  { id: '507f1f77bcf86cd799439011', name: '가계부1', description: '설명1' },
  { id: '607f1f77bcf86cd799439022', name: '가계부2', description: '설명2' },
  { id: '707f1f77bcf86cd799439033', name: '가계부3', description: '설명3' },
];

describe('GET /api/ledgers는', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('성공시', () => {
    test('가계부 목록을 담은 배열과 200을 반환한다.', async () => {
      model.findAll.mockResolvedValue(mockLedgerList);

      const res = await request(app).get('/api/ledgers').expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(3);
      expect(model.findAll).toHaveBeenCalledWith(10);
    });

    test('limit이 있다면 limit 갯수만큼 가계부를 담은 배열과 200을 반환한다.', async () => {
      model.findAll.mockResolvedValue(mockLedgerList.slice(0, 2));

      const res = await request(app)
        .get('/api/ledgers')
        .query({ limit: 2 })
        .expect(200);

      expect(res.body).toHaveLength(2);
      expect(model.findAll).toHaveBeenCalledWith(2);
    });
  });

  describe('실패시', () => {
    test('limit이 숫자가 아니면 400을 반환한다.', async () => {
      await request(app).get('/api/ledgers').query({ limit: 'a' }).expect(400);

      expect(model.findAll).not.toHaveBeenCalled();
    });
  });
});

describe('POST /api/ledgers는', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('성공시', () => {
    test('새로운 가계부를 생성하고 201을 반환한다.', async () => {
      model.create.mockResolvedValue(mockLedger);

      const requestBody = {
        name: '테스트 가계부',
        description: '테스트 설명',
      };

      const res = await request(app)
        .post('/api/ledgers')
        .send(requestBody)
        .expect(201);

      expect(res.body).toHaveProperty('id', mockLedger.id);
      expect(res.body).toHaveProperty('name', '테스트 가계부');
      expect(res.body).toHaveProperty('description', '테스트 설명');
      expect(model.create).toHaveBeenCalledWith(requestBody);
    });
  });

  describe('실패시', () => {
    test('name이 없으면 400을 반환한다.', async () => {
      await request(app)
        .post('/api/ledgers')
        .send({ description: '새로운 가계부입니다.' })
        .expect(400);

      expect(model.create).not.toHaveBeenCalled();
    });

    test('빈 객체를 전송하면 400을 반환한다.', async () => {
      await request(app).post('/api/ledgers').send({}).expect(400);

      expect(model.create).not.toHaveBeenCalled();
    });
  });
});

describe('GET /api/ledgers/:id는', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('성공시', () => {
    test('id에 해당하는 가계부 객체와 200을 반환한다.', async () => {
      model.findById.mockResolvedValue(mockLedger);

      const res = await request(app)
        .get(`/api/ledgers/${mockLedgerId}`)
        .expect(200);

      expect(res.body).toHaveProperty('id', mockLedgerId);
      expect(res.body).toHaveProperty('name', '테스트 가계부');
      expect(res.body).toHaveProperty('description', '테스트 설명');
      expect(model.findById).toHaveBeenCalledWith(mockLedgerId);
    });
  });

  describe('실패시', () => {
    test('유효하지 않은 ID는 400을 반환한다.', async () => {
      model.findById.mockRejectedValue(new AppError('Invalid ID format', 400));

      await request(app).get('/api/ledgers/abc').expect(400);

      expect(model.findById).toHaveBeenCalledWith('abc');
    });

    test('가계부가 존재하지 않으면 404를 반환한다.', async () => {
      model.findById.mockResolvedValue(null);

      await request(app).get(`/api/ledgers/${mockNotFoundLedgerId}`).expect(404);

      expect(model.findById).toHaveBeenCalledWith(mockNotFoundLedgerId);
    });
  });
});

describe('PUT /api/ledgers/:id는', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('성공시', () => {
    test('id에 해당하는 가계부를 수정하고 수정된 가계부와 200을 반환한다.', async () => {
      const requestBody = {
        name: '수정된 가계부',
        description: '수정된 가계부입니다.',
      };

      const updatedLedger = {
        id: mockLedgerId,
        ...requestBody,
      };

      model.update.mockResolvedValue(updatedLedger);

      const res = await request(app)
        .put(`/api/ledgers/${mockLedgerId}`)
        .send(requestBody)
        .expect(200);

      expect(res.body).toHaveProperty('id', mockLedgerId);
      expect(res.body).toHaveProperty('name', '수정된 가계부');
      expect(res.body).toHaveProperty('description', '수정된 가계부입니다.');
      expect(model.update).toHaveBeenCalledWith(mockLedgerId, requestBody);
    });
  });

  describe('실패시', () => {
    const requestBody = {
      name: '수정된 가계부',
      description: '수정된 가계부입니다.',
    };

    test('유효하지 않은 ID는 400을 반환한다.', async () => {
      model.update.mockRejectedValue(new AppError('Invalid ID format', 400));

      await request(app).put('/api/ledgers/abc').send(requestBody).expect(400);

      expect(model.update).toHaveBeenCalledWith('abc', requestBody);
    });

    test('가계부가 존재하지 않으면 404를 반환한다.', async () => {
      model.update.mockResolvedValue(null);

      await request(app)
        .put(`/api/ledgers/${mockNotFoundLedgerId}`)
        .send(requestBody)
        .expect(404);

      expect(model.update).toHaveBeenCalledWith(mockNotFoundLedgerId, requestBody);
    });

    test('name과 description이 모두 없으면 400을 반환한다.', async () => {
      await request(app).put(`/api/ledgers/${mockLedgerId}`).send({}).expect(400);

      expect(model.update).not.toHaveBeenCalled();
    });
  });
});

describe('DELETE /api/ledgers/:id는', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('성공시', () => {
    test('id에 해당하는 가계부를 삭제하고 204를 반환한다.', async () => {
      model.remove.mockResolvedValue(true);

      await request(app).delete(`/api/ledgers/${mockLedgerId}`).expect(204);

      expect(model.remove).toHaveBeenCalledWith(mockLedgerId);
    });
  });

  describe('실패시', () => {
    test('유효하지 않은 ID는 400을 반환한다.', async () => {
      model.remove.mockRejectedValue(new AppError('Invalid ID format', 400));

      await request(app).delete('/api/ledgers/abc').expect(400);

      expect(model.remove).toHaveBeenCalledWith('abc');
    });

    test('가계부가 존재하지 않으면 404를 반환한다.', async () => {
      model.remove.mockResolvedValue(false);

      await request(app).delete(`/api/ledgers/${mockNotFoundLedgerId}`).expect(404);

      expect(model.remove).toHaveBeenCalledWith(mockNotFoundLedgerId);
    });
  });
});
