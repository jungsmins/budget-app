jest.mock('./transactions.model');
const model = require('./transactions.model');
const request = require('supertest');
const app = require('../../app');
const AppError = require('../../errors/AppError');

// 존재하는 LedgerId
const mockLedgerId = '507f1f77bcf86cd799439011';
// 존재하지 않는 transactionId (유효한 ObjectId 형식)
const mockNotFoundTransactionId = '607f1f77bcf86cd799439099';

// 단일 transaction
const mockTransaction = {
  id: '607f1f77bcf86cd799439011',
  ledgerId: '507f1f77bcf86cd799439011',
  type: 'expense',
  amount: 15000,
  category: '식비',
  description: '점심 밥',
  date: '2026-01-25',
};

// transaction 목록
const mockTransactionList = [
  {
    id: '607f1f77bcf86cd799439011',
    ledgerId: '507f1f77bcf86cd799439011',
    type: 'expense',
    amount: 15000,
    category: '식비',
    description: '점심 밥',
    date: '2026-01-25',
  },
  {
    id: '607f1f77bcf86cd799439012',
    ledgerId: '507f1f77bcf86cd799439011',
    type: 'income',
    amount: 500000,
    category: '급여',
    description: '월급',
    date: '2026-01-01',
  },
  {
    id: '607f1f77bcf86cd799439013',
    ledgerId: '507f1f77bcf86cd799439011',
    type: 'expense',
    amount: 8000,
    category: '식비',
    description: '아침 빵',
    date: '2026-01-10',
  },
  {
    id: '607f1f77bcf86cd799439014',
    ledgerId: '507f1f77bcf86cd799439011',
    type: 'expense',
    amount: 50000,
    category: '교통비',
    description: '지하철 정기권',
    date: '2026-02-01',
  },
];

// 다른 ledger에 속한 transaction (ledger 불일치 테스트용)
const mockTransactionDifferentLedger = {
  id: '607f1f77bcf86cd799439015',
  ledgerId: '607f1f77bcf86cd799439022', // 다른 ledger ID
  type: 'expense',
  amount: 10000,
  category: '교통비',
  description: '버스',
  date: '2026-01-15',
};

// 수정된 transaction mock
const mockUpdatedTransaction = {
  id: '607f1f77bcf86cd799439011',
  ledgerId: '507f1f77bcf86cd799439011',
  type: 'expense',
  amount: 11000,
  category: '식비',
  description: '간식',
  date: '2026-01-25',
};

describe('GET /api/ledgers/:ledgerId/transactions는', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('성공시', () => {
    test('해당 가계부의 거래 내역 목록을 담은 배열과 200을 반환한다.', async () => {
      model.findByLedgerId.mockResolvedValue(mockTransactionList);

      const res = await request(app)
        .get(`/api/ledgers/${mockLedgerId}/transactions`)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(4);
      res.body.forEach((transaction) => {
        expect(transaction).toHaveProperty('ledgerId', mockLedgerId);
      });
      expect(model.findByLedgerId).toHaveBeenCalledWith(mockLedgerId, {});
    });

    test('거래 내역이 없을 경우 빈 배열과 200을 반환한다.', async () => {
      model.findByLedgerId.mockResolvedValue([]);

      const res = await request(app)
        .get(`/api/ledgers/${mockLedgerId}/transactions`)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(0);
      expect(model.findByLedgerId).toHaveBeenCalledWith(mockLedgerId, {});
    });

    test('category query로 필터링하여 거래 내역을 반환한다.', async () => {
      model.findByLedgerId.mockResolvedValue(
        mockTransactionList.filter((t) => t.category === '식비'),
      );

      const res = await request(app)
        .get(`/api/ledgers/${mockLedgerId}/transactions?category=식비`)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      res.body.forEach((transaction) => {
        expect(transaction.category).toBe('식비');
        expect(transaction.ledgerId).toBe(mockLedgerId);
      });
      expect(model.findByLedgerId).toHaveBeenCalledWith(mockLedgerId, {
        category: '식비',
      });
    });

    test('존재하지 않는 category는 빈 배열을 반환한다.', async () => {
      model.findByLedgerId.mockResolvedValue([]);

      const res = await request(app)
        .get(
          `/api/ledgers/${mockLedgerId}/transactions?category=존재하지않는카테고리`,
        )
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(0);
      expect(model.findByLedgerId).toHaveBeenCalledWith(mockLedgerId, {
        category: '존재하지않는카테고리',
      });
    });

    test('month query로 년-월 필터링하여 거래 내역을 반환한다.', async () => {
      const filteredList = mockTransactionList.filter((t) =>
        t.date.startsWith('2026-01'),
      );

      model.findByLedgerId.mockResolvedValue(filteredList);

      const res = await request(app)
        .get(`/api/ledgers/${mockLedgerId}/transactions?month=2026-01`)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      res.body.forEach((transaction) => {
        expect(transaction.date).toMatch(/^2026-01/);
      });
      expect(model.findByLedgerId).toHaveBeenCalledWith(mockLedgerId, {
        month: '2026-01',
      });
    });
  });

  describe('실패시', () => {
    test('month 형식이 잘못되면 400을 반환한다. (yyyy-mm가 아님)', async () => {
      await request(app)
        .get(`/api/ledgers/${mockLedgerId}/transactions?month=2026/0`)
        .expect(400);

      expect(model.findByLedgerId).not.toHaveBeenCalled();
    });

    test('month의 월이 유효하지 않으면 400을 반환한다. (13월)', async () => {
      await request(app)
        .get(`/api/ledgers/${mockLedgerId}/transactions?month=2026-13`)
        .expect(400);

      expect(model.findByLedgerId).not.toHaveBeenCalled();
    });

    test('month의 월이 유효하지 않으면 400을 반환한다. (00월)', async () => {
      await request(app)
        .get(`/api/ledgers/${mockLedgerId}/transactions?month=2026-00`)
        .expect(400);

      expect(model.findByLedgerId).not.toHaveBeenCalled();
    });

    test('month 형식이 잘못되면 400을 반환한다. (월이 한자리)', async () => {
      await request(app)
        .get(`/api/ledgers/${mockLedgerId}/transactions?month=2026-1`)
        .expect(400);

      expect(model.findByLedgerId).not.toHaveBeenCalled();
    });
  });
});

describe('POST /api/ledgers/:ledgerId/transactions는', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('성공시', () => {
    test('새로운 거래 내역을 생성하고 201을 반환한다.', async () => {
      model.create.mockResolvedValue(mockTransaction);

      const requestBody = {
        type: 'expense',
        amount: 15000,
        category: '식비',
        description: '점심 밥',
        date: '2026-01-25',
      };

      const res = await request(app)
        .post(`/api/ledgers/${mockLedgerId}/transactions`)
        .send(requestBody)
        .expect(201);

      expect(res.body).toHaveProperty('id', mockTransaction.id);
      expect(res.body).toHaveProperty('ledgerId', mockTransaction.ledgerId);
      expect(res.body).toHaveProperty('type', 'expense');
      expect(res.body).toHaveProperty('amount', 15000);
      expect(res.body).toHaveProperty('category', '식비');
      expect(res.body).toHaveProperty('description', '점심 밥');
      expect(res.body).toHaveProperty('date', '2026-01-25');
      expect(model.create).toHaveBeenCalledWith(mockLedgerId, requestBody);
    });
  });

  describe('실패시', () => {
    test('필수 필드가 없으면 400을 반환한다.', async () => {
      await request(app)
        .post(`/api/ledgers/${mockLedgerId}/transactions`)
        .send({
          type: 'expense',
          amount: 15000,
          // category, description, date 누락
        })
        .expect(400);

      expect(model.create).not.toHaveBeenCalled();
    });
  });
});

describe('PUT /api/ledgers/:ledgerId/transactions/:transactionId는', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('성공시', () => {
    test('거래 내역을 수정하고 200을 반환한다.', async () => {
      model.findById.mockResolvedValue(mockTransaction);
      model.update.mockResolvedValue(mockUpdatedTransaction);

      const requestBody = {
        type: 'expense',
        amount: 11000,
        category: '식비',
        description: '간식',
        date: '2026-01-25',
      };

      const res = await request(app)
        .put(`/api/ledgers/${mockLedgerId}/transactions/${mockTransaction.id}`)
        .send(requestBody)
        .expect(200);

      expect(res.body).toHaveProperty('id', mockUpdatedTransaction.id);
      expect(res.body).toHaveProperty(
        'ledgerId',
        mockUpdatedTransaction.ledgerId,
      );
      expect(res.body).toHaveProperty('type', 'expense');
      expect(res.body).toHaveProperty('amount', 11000);
      expect(res.body).toHaveProperty('category', '식비');
      expect(res.body).toHaveProperty('description', '간식');
      expect(res.body).toHaveProperty('date', '2026-01-25');
      expect(model.findById).toHaveBeenCalledWith(mockTransaction.id);
      expect(model.update).toHaveBeenCalledWith(
        mockTransaction.id,
        requestBody,
      );
    });
  });

  describe('실패시', () => {
    const requestBody = {
      type: 'expense',
      amount: 11000,
      category: '식비',
      description: '간식',
      date: '2026-01-25',
    };

    test('유효하지 않은 transactionId는 400을 반환한다.', async () => {
      model.findById.mockRejectedValue(new AppError('Invalid ID format', 400));

      await request(app)
        .put(`/api/ledgers/${mockLedgerId}/transactions/abc`)
        .send(requestBody)
        .expect(400);

      expect(model.findById).toHaveBeenCalledWith('abc');
      expect(model.update).not.toHaveBeenCalled();
    });

    test('거래 내역이 존재하지 않으면 404를 반환한다.', async () => {
      model.findById.mockResolvedValue(null);

      await request(app)
        .put(
          `/api/ledgers/${mockLedgerId}/transactions/${mockNotFoundTransactionId}`,
        )
        .send(requestBody)
        .expect(404);

      expect(model.findById).toHaveBeenCalledWith(mockNotFoundTransactionId);
      expect(model.update).not.toHaveBeenCalled();
    });

    test('필수 필드가 없으면 400을 반환한다.', async () => {
      await request(app)
        .put(`/api/ledgers/${mockLedgerId}/transactions/${mockTransaction.id}`)
        .send({})
        .expect(400);

      expect(model.findById).not.toHaveBeenCalled();
      expect(model.update).not.toHaveBeenCalled();
    });

    test('거래 내역이 해당 가계부에 속하지 않으면 404를 반환한다.', async () => {
      model.findById.mockResolvedValue(mockTransactionDifferentLedger);

      await request(app)
        .put(
          `/api/ledgers/${mockLedgerId}/transactions/${mockTransactionDifferentLedger.id}`,
        )
        .send(requestBody)
        .expect(404);

      expect(model.findById).toHaveBeenCalledWith(
        mockTransactionDifferentLedger.id,
      );
      expect(model.update).not.toHaveBeenCalled();
    });
  });
});

describe('DELETE /api/ledgers/:ledgerId/transactions/:transactionId는', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('성공시', () => {
    test('거래 내역을 삭제하고 204를 반환한다.', async () => {
      model.findById.mockResolvedValue(mockTransaction);
      model.remove.mockResolvedValue(true);

      await request(app)
        .delete(
          `/api/ledgers/${mockLedgerId}/transactions/${mockTransaction.id}`,
        )
        .expect(204);

      expect(model.findById).toHaveBeenCalledWith(mockTransaction.id);
      expect(model.remove).toHaveBeenCalledWith(mockTransaction.id);
    });
  });

  describe('실패시', () => {
    test('유효하지 않은 transactionId는 400을 반환한다.', async () => {
      model.findById.mockRejectedValue(new AppError('Invalid ID format', 400));

      await request(app)
        .delete(`/api/ledgers/${mockLedgerId}/transactions/abc`)
        .expect(400);

      expect(model.findById).toHaveBeenCalledWith('abc');
      expect(model.remove).not.toHaveBeenCalled();
    });

    test('거래 내역이 존재하지 않으면 404를 반환한다.', async () => {
      model.findById.mockResolvedValue(null);

      await request(app)
        .delete(
          `/api/ledgers/${mockLedgerId}/transactions/${mockNotFoundTransactionId}`,
        )
        .expect(404);

      expect(model.findById).toHaveBeenCalledWith(mockNotFoundTransactionId);
      expect(model.remove).not.toHaveBeenCalled();
    });

    test('거래 내역이 해당 가계부에 속하지 않으면 404를 반환한다.', async () => {
      model.findById.mockResolvedValue(mockTransactionDifferentLedger);

      await request(app)
        .delete(
          `/api/ledgers/${mockLedgerId}/transactions/${mockTransactionDifferentLedger.id}`,
        )
        .expect(404);

      expect(model.findById).toHaveBeenCalledWith(
        mockTransactionDifferentLedger.id,
      );
      expect(model.remove).not.toHaveBeenCalled();
    });
  });
});
