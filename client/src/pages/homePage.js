import './homePage.css';

import createModal from '../components/modal';
import router from '../router';
import * as ledgersApi from '../api/ledgers';

const ledgerFormContent = `
  <div class="ledger-form">
    <label>
      가계부 이름
      <input name="name" type="text" placeholder="가계부 이름을 입력하세요" />
    </label>
    <label>
      가계부 설명
      <input name="description" type="text" placeholder="가계부 설명을 입력하세요" />
    </label>
  </div>
  <div class="ledger-form-buttons">
    <button class="ledger-form-confirm-button confirm-button">확인</button>
    <button class="ledger-form-cancel-button cancel-button">취소</button>
  </div>
`;

const ledgerDeleteContent = `
  <p class="ledger-delete-message">가계부를 삭제 하시겠어요?</p>
  <div class='ledger-delete-buttons'>
    <button class='ledger-delete-confirm-button confirm-button'>삭제</button>
    <button class='ledger-delete-cancel-button cancel-button'>취소</button>
  </div>
`;

async function renderLedgerList(homeEl) {
  let ledgers = await ledgersApi.getAll();

  if (!ledgers) {
    ledgers = [];
  }

  const ledgerItems = ledgers.map((ledger) => {
    return `
      <li class="ledger-item" data-id="${ledger.id}">
        <button class="ledger-delete-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
        ${ledger.name}
      </li>
    `;
  });

  homeEl.innerHTML = `
    <ul class="ledger-list">
      ${ledgerItems.join('')}
      <li class="ledger-add-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14"/>
          <path d="M5 12h14"/>
        </svg>
      </li>
    </ul>
  `;
}

function homePage() {
  let deleteTargetId = null;

  const homeEl = document.createElement('main');
  homeEl.className = 'home-container';

  const ledgerFormModal = createModal(ledgerFormContent, {
    onConfirm: async (data) => {
      await ledgersApi.create(data);
      renderLedgerList(homeEl);
    },
  });

  const ledgerDeleteModal = createModal(ledgerDeleteContent, {
    onConfirm: async () => {
      await ledgersApi.remove(deleteTargetId);
      renderLedgerList(homeEl);
    },
  });

  homeEl.addEventListener('click', (e) => {
    if (e.target.closest('.ledger-add-button')) {
      ledgerFormModal.open();
      return;
    }

    const item = e.target.closest('.ledger-item');

    if (!item) {
      return;
    }

    const id = item.dataset.id;

    if (e.target.closest('.ledger-delete-button')) {
      deleteTargetId = id;
      ledgerDeleteModal.open();
      return;
    }

    router.navigate(`/ledgers/${id}`);
  });

  homeEl.cleanup = () => {
    ledgerFormModal.destroy();
    ledgerDeleteModal.destroy();
  };

  renderLedgerList(homeEl);

  return homeEl;
}

export default homePage;
