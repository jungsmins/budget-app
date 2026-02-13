import './modal.css';

function createModal(content, eventHandler) {
  const modalLayout = document.createElement('div');
  modalLayout.classList.add('modal-layer');

  const modal = document.createElement('div');
  modal.classList.add('modal');

  modal.innerHTML = content;

  modalLayout.appendChild(modal);
  document.body.appendChild(modalLayout);

  function open(data) {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        const input = modal.querySelector(`[name="${key}"]`);
        input.value = value;
      });
    }

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
      const items = modal.querySelectorAll('input, .active');
      items.forEach((item) => {
        data[item.name] = item.value || item.dataset.type;
        item.value = '';
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

  function destroy() {
    modalLayout.remove();
  }

  return {
    open,
    close,
    destroy,
    el: modal,
  };
}

export default createModal;
