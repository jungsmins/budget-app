let ledgers = [
  { id: 1, name: '첫번째 가계부', description: '나의 첫번째 가계부' },
  { id: 2, name: '두번째 가계부', description: '나의 두번째 가계부' },
  { id: 3, name: '세번째 가계부', description: '나의 세번째 가계부' },
];

let transactions = [
  {
    id: 1,
    ledgerId: 1,
    type: 'expense',
    amount: 50000,
    category: '식비',
    description: '저녁 밥',
    date: '2026-01-09',
  },
  {
    id: 2,
    ledgerId: 1,
    type: 'expense',
    amount: 2000,
    category: '생활비',
    description: '세면 도구 구매',
    date: '2026-01-09',
  },
  {
    id: 3,
    ledgerId: 1,
    type: 'expense',
    amount: 7000,
    category: '식비',
    description: '점심 밥',
    date: '2026-01-10',
  },
  {
    id: 4,
    ledgerId: 2,
    type: 'income',
    amount: 3000000,
    category: '급여',
    description: '1월 급여',
    date: '2026-01-25',
  },
  {
    id: 5,
    ledgerId: 2,
    type: 'expense',
    amount: 800000,
    category: '주거비',
    description: '월세',
    date: '2026-01-05',
  },
  {
    id: 6,
    ledgerId: 2,
    type: 'income',
    amount: 500000,
    category: '부수입',
    description: '프리랜서 작업',
    date: '2026-01-15',
  },
];

module.exports = {
  ledgers,
  transactions,
};
