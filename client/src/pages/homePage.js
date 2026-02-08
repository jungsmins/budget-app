import './homePage.css';

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

function homePage() {
  const mainEl = document.createElement('main');
  mainEl.className = 'home-container';

  const ledgerList = ledgers.map((ledger) => {
    return `
      <li class="ledger-item">
        <div class="ledger-actions">
          <button class="ledger-update-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
          <button class="ledger-delete-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        </div>
        ${ledger.title}
      </li>
    `;
  });

  mainEl.innerHTML = `
    <ul class="ledger-list">
      ${ledgerList.join('')}
      <li class="ledger-add-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14"/>
          <path d="M5 12h14"/>
        </svg>
      </li>
    </ul>
  `;

  return mainEl;
}

export default homePage;
