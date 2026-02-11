import './ledgerPage.css';
import createModal from '../components/modal';

const transactionFormContent = `
  <div class="transaction-form">
    <div class="transaction-type-toggle">
      <button class="type-button income active" data-type="income">수입</button>
      <button class="type-button expense" data-type="expense">지출</button>
    </div>
    <label>
      금액
      <input type="number" placeholder="금액을 입력하세요" />
    </label>
    <label>
      카테고리
      <input type="text" placeholder="카테고리를 입력하세요" />
    </label>
    <label>
      내용
      <input type="text" placeholder="내용을 입력하세요" />
    </label>
    <label>
      날짜
      <input type="date" />
    </label>
  </div>
  <div class="transaction-form-buttons">
    <button class="transaction-form-confirm-button">확인</button>
    <button class="transaction-form-cancel-button cancel-button">취소</button>
  </div>
`;

const transactionDeleteContent = `
  <p class="transaction-delete-message">거래내역을 삭제 하시겠어요?</p>
  <div class="transaction-delete-buttons">
    <button class="transaction-delete-confirm-button">삭제</button>
    <button class="transaction-delete-cancel-button cancel-button">취소</button>
  </div>
`;

const transactions = [
  {
    id: '1',
    type: 'income',
    amount: 3000000,
    category: '급여',
    description: '6월 급여',
    date: '2025-06-25',
  },
  {
    id: '2',
    type: 'expense',
    amount: 45000,
    category: '식비',
    description: '점심 식사',
    date: '2025-06-25',
  },
  {
    id: '3',
    type: 'expense',
    amount: 55000,
    category: '교통',
    description: '교통카드 충전',
    date: '2025-06-24',
  },
  {
    id: '4',
    type: 'income',
    amount: 200000,
    category: '부수입',
    description: '프리랜서 작업',
    date: '2025-06-23',
  },
  {
    id: '5',
    type: 'expense',
    amount: 15000,
    category: '식비',
    description: '저녁 식사',
    date: '2025-06-23',
  },
];

function ledgerPage() {
  const transactionFormModal = createModal(transactionFormContent);
  const transactionDeleteModal = createModal(transactionDeleteContent);

  document.addEventListener('click', (e) => {
    const typeButton = e.target.closest('.type-button');
    if (typeButton) {
      typeButton.parentElement.querySelectorAll('.type-button').forEach((btn) => {
        btn.classList.remove('active');
      });
      typeButton.classList.add('active');
    }
  });

  const ledgerEl = document.createElement('main');
  ledgerEl.className = 'ledger-container';
  ledgerEl.addEventListener('click', (e) => {
    if (e.target.closest('.transaction-add-button')) {
      transactionFormModal.open();
    }

    if (e.target.closest('.transaction-delete-button')) {
      transactionDeleteModal.open();
    }
  });

  const transactionItems = transactions.map((transaction) => {
    const isIncome = transaction.type === 'income';
    return `
      <li class="transaction-item">
        <div class="transaction-info">
          <span class="transaction-category">${transaction.category}</span>
          <span class="transaction-description">${transaction.description}</span>
          <span class="transaction-date">${transaction.date}</span>
        </div>
        <div class="transaction-right">
          <span class="transaction-amount ${isIncome ? 'income' : 'expense'}">
            ${isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}원
          </span>
          <button class="transaction-delete-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
      </li>
    `;
  });

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  ledgerEl.innerHTML = `
    <h2 class="ledger-title">
      첫번째 가계부
      <button class="ledger-edit-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          <path d="m15 5 4 4"/>
        </svg>
      </button>
    </h2>
    <ul class="transaction-list">
      ${transactionItems.join('')}
      <li class="transaction-item">
        <button class="transaction-add-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14"/>
            <path d="M5 12h14"/>
          </svg>
        </button>
      </li>
    </ul>
    <div class="transaction-summary">
      <div class="summary-item">
        <span class="summary-label">총 수입</span>
        <span class="summary-value income">+${totalIncome.toLocaleString()}원</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">총 지출</span>
        <span class="summary-value expense">-${totalExpense.toLocaleString()}원</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">합계</span>
        <span class="summary-value">${balance >= 0 ? '+' : ''}${balance.toLocaleString()}원</span>
      </div>
    </div>
  `;

  return ledgerEl;
}

export default ledgerPage;
