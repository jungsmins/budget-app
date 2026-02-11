import './modal.css';

function createModal(content, eventHandler) {
  const modalLayout = document.createElement('div');
  modalLayout.classList.add('modal-layer');

  const modal = document.createElement('div');
  modal.classList.add('modal');

  modal.innerHTML = content;

  modalLayout.appendChild(modal);
  document.body.appendChild(modalLayout);

  function open() {
    modalLayout.classList.add('show');
  }

  function close() {
    modalLayout.classList.remove('show');
  }

  modal.addEventListener('click', (e) => {
    if (e.target.closest('.cancel-button')) {
      close();
    }

    if (e.target.closest('.confirm-button')) {
      const data = {};
      const items = modal.querySelectorAll('input, select');

      items.forEach((item) => {
        data[item.name] = item.value;
      });

      eventHandler.onConfirm(data);

      close();
    }
  });

  modalLayout.addEventListener('click', (e) => {
    if (e.target === modalLayout) {
      close();
    }
  });

  return {
    open,
    close,
    el: modal,
  };
}

export default createModal;
