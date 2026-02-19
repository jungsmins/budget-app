import './ledgerPage.css';
import createModal from '../components/modal';
import * as transactionsApi from '../api/transactions';
import * as ledgersApi from '../api/ledgers';
import { validateLedger, validateTransaction } from '../utils/validation';

const transactionFormContent = `
  <div class="transaction-form">
    <div class="transaction-type-toggle">
      <button name="type" class="type-button income active" data-type="income">수입</button>
      <button name="type" class="type-button expense" data-type="expense">지출</button>
    </div>
    <div class="form-field">
      <label>금액</label>
      <input name="amount" type="number" placeholder="금액을 입력하세요" />
    </div>
    <div class="form-field">
      <label>카테고리</label>
      <input name="category" type="text" placeholder="카테고리를 입력하세요" />
    </div>
    <div class="form-field">
      <label>내용</label>
      <input name="description" type="text" placeholder="내용을 입력하세요" />
    </div>
    <div class="form-field">
      <label>날짜</label>
      <input name="date" type="date" />
    </div>
  </div>
  <div class="transaction-form-buttons">
    <button class="transaction-form-confirm-button confirm-button">확인</button>
    <button class="transaction-form-cancel-button cancel-button">취소</button>
  </div>
`;

const transactionDeleteContent = `
  <p class="transaction-delete-message">거래내역을 삭제 하시겠어요?</p>
  <div class="transaction-delete-buttons">
    <button class="transaction-delete-confirm-button confirm-button">삭제</button>
    <button class="transaction-delete-cancel-button cancel-button">취소</button>
  </div>
`;

const ledgerFormContent = `
  <div class="ledger-form">
    <div class="form-field">
      <label>가계부 이름</label>
      <input name="name" type="text" placeholder="가계부 이름을 입력하세요" />
    </div>
    <div class="form-field">
      <label>가계부 설명</label>
      <input name="description" type="text" placeholder="가계부 설명을 입력하세요" />
    </div>
  </div>
  <div class="ledger-form-buttons">
    <button class="ledger-form-confirm-button confirm-button">확인</button>
    <button class="ledger-form-cancel-button cancel-button">취소</button>
  </div>
`;

async function renderTransactionList(ledgerId, ledgerEl, filters = {}) {
  const [transactions, allTransactions, ledger] = await Promise.all([
    transactionsApi.getAll(ledgerId, filters),
    filters.month || filters.category
      ? transactionsApi.getAll(
          ledgerId,
          filters.month ? { month: filters.month } : {},
        )
      : null,
    ledgersApi.getById(ledgerId),
  ]);

  const categorySource = allTransactions || transactions;
  const categories = [...new Set(categorySource.map((t) => t.category))].sort();

  const transactionItems = transactions.map((transaction) => {
    const isIncome = transaction.type === 'income';
    return `
      <li class="transaction-item" data-id="${transaction.id}">
        <div class="transaction-info">
          <span class="transaction-category">${transaction.category}</span>
          <span class="transaction-description">${transaction.description}</span>
          <span class="transaction-date">${transaction.date}</span>
        </div>
        <div class="transaction-right">
          <span class="transaction-amount ${isIncome ? 'income' : 'expense'}">
            ${isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}원
          </span>
          <button class="transaction-edit-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
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

  const categoryOptions = categories.map(
    (c) =>
      `<option value="${c}" ${filters.category === c ? 'selected' : ''}>${c}</option>`,
  );

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  ledgerEl.innerHTML = `
    <h2 class="ledger-title">
      ${ledger.name}
      <button class="ledger-edit-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          <path d="m15 5 4 4"/>
        </svg>
      </button>
    </h2>
    <p>${ledger.description}</p>
    <div class="transaction-filters">
      <input class="filter-month" type="month" value="${filters.month || ''}" />
      <select class="filter-category">
        <option value="">전체 카테고리</option>
        ${categoryOptions.join('')}
      </select>
      <button class="filter-reset-button">전체보기</button>
    </div>
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
}

function ledgerPage() {
  const ledgerId = location.pathname.split('/')[2];
  let transactionId = null;
  let currentFilters = {};

  const ledgerEl = document.createElement('main');
  ledgerEl.className = 'ledger-container';

  const transactionFormModal = createModal(transactionFormContent, {
    onConfirm: async (data) => {
      await transactionsApi.create(ledgerId, data);
      renderTransactionList(ledgerId, ledgerEl, currentFilters);
    },
    validator: validateTransaction,
  });

  const transactionDeleteModal = createModal(transactionDeleteContent, {
    onConfirm: async () => {
      await transactionsApi.remove(ledgerId, transactionId);
      renderTransactionList(ledgerId, ledgerEl, currentFilters);
    },
  });

  const transactionEditModal = createModal(transactionFormContent, {
    onConfirm: async (data) => {
      await transactionsApi.update(ledgerId, transactionId, data);
      renderTransactionList(ledgerId, ledgerEl, currentFilters);
    },
    validator: validateTransaction,
  });

  const ledgerEditModal = createModal(ledgerFormContent, {
    onConfirm: async (data) => {
      await ledgersApi.update(ledgerId, data);
      renderTransactionList(ledgerId, ledgerEl, currentFilters);
    },
    validator: validateLedger,
  });

  function handleTypeToggle(e) {
    const typeButton = e.target.closest('.type-button');
    if (typeButton) {
      typeButton.parentElement
        .querySelectorAll('.type-button')
        .forEach((btn) => {
          btn.classList.remove('active');
        });
      typeButton.classList.add('active');
    }
  }

  transactionFormModal.el.addEventListener('click', handleTypeToggle);
  transactionEditModal.el.addEventListener('click', handleTypeToggle);

  ledgerEl.addEventListener('change', (e) => {
    if (e.target.matches('.filter-month')) {
      currentFilters = {
        ...currentFilters,
        month: e.target.value || undefined,
      };
      renderTransactionList(ledgerId, ledgerEl, currentFilters);
      return;
    }

    if (e.target.matches('.filter-category')) {
      currentFilters = {
        ...currentFilters,
        category: e.target.value || undefined,
      };
      renderTransactionList(ledgerId, ledgerEl, currentFilters);
      return;
    }
  });

  ledgerEl.addEventListener('click', (e) => {
    if (e.target.closest('.filter-reset-button')) {
      currentFilters = {};
      renderTransactionList(ledgerId, ledgerEl);
      return;
    }

    if (e.target.closest('.ledger-edit-button')) {
      ledgersApi.getById(ledgerId).then((ledger) => {
        ledgerEditModal.open({
          name: ledger.name,
          description: ledger.description,
        });
      });
      return;
    }

    if (e.target.closest('.transaction-add-button')) {
      transactionFormModal.open();
      return;
    }

    const item = e.target.closest('.transaction-item');

    if (!item) {
      return;
    }

    if (e.target.closest('.transaction-edit-button')) {
      transactionId = item.dataset.id;
      transactionsApi.getAll(ledgerId, currentFilters).then((transactions) => {
        const transaction = transactions.find((t) => t.id === transactionId);
        transactionEditModal.open({
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date,
        });
        const typeButtons =
          transactionEditModal.el.querySelectorAll('.type-button');
        typeButtons.forEach((btn) => {
          btn.classList.toggle('active', btn.dataset.type === transaction.type);
        });
      });
      return;
    }

    if (e.target.closest('.transaction-delete-button')) {
      transactionId = item.dataset.id;
      transactionDeleteModal.open();
      return;
    }
  });

  ledgerEl.cleanup = () => {
    transactionFormModal.destroy();
    transactionEditModal.destroy();
    transactionDeleteModal.destroy();
    ledgerEditModal.destroy();
  };

  renderTransactionList(ledgerId, ledgerEl);

  return ledgerEl;
}

export default ledgerPage;
