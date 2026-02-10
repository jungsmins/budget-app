import './homePage.css';
import createModal from '../components/modal';

const ledgers = [
  {
    id: 1,
    title: '첫번째 가계부',
    description: '가계부 설명',
  },
  {
    id: 2,
    title: '두번째 가계부',
    description: '가계부 설명',
  },
];

const ledgerFormContent = `
  <div class="ledger-form">
    <label>
      가계부 이름
      <input type="text" placeholder="가계부 이름을 입력하세요" />
    </label>
    <label>
      가계부 설명
      <input type="text" placeholder="가계부 설명을 입력하세요" />
    </label>
  </div>
  <div class="ledger-form-buttons">
    <button class="ledger-form-confirm-button">확인</button>
    <button class="ledger-form-cancel-button cancel-button">취소</button>
  </div>
`;

const ledgerDeleteContent = `
  <p class="ledger-delete-message">가계부를 삭제 하시겠어요?</p>
  <div class='ledger-delete-buttons'>
    <button class='ledger-delete-confirm-button'>삭제</button>
    <button class='ledger-delete-cancel-button cancel-button'>취소</button>
  </div>
`;

function homePage() {
  const ledgerFormModal = createModal(ledgerFormContent);
  const ledgerDeleteModal = createModal(ledgerDeleteContent);

  const homeEl = document.createElement('main');
  homeEl.className = 'home-container';
  homeEl.addEventListener('click', (e) => {
    if (e.target.closest('.ledger-add-button')) {
      ledgerFormModal.open();
    }

    if (e.target.closest('.ledger-delete-button')) {
      ledgerDeleteModal.open();
    }
  });

  const ledgerItems = ledgers.map((ledger) => {
    return `
      <li class="ledger-item">
        <button class="ledger-delete-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
        ${ledger.title}
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

  return homeEl;
}

export default homePage;
