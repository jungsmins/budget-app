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

    const inputs = modal.querySelectorAll('input');
    inputs.forEach((input) => {
      input.value = '';
    });

    clearErrors();
  }

  function clearErrors() {
    const errorMessages = modal.querySelectorAll('.error-message');
    errorMessages.forEach((error) => error.remove());
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
      });

      clearErrors();

      if (eventHandler.validator) {
        const errors = eventHandler.validator(data);

        if (Object.keys(errors).length > 0) {
          for (const name in errors) {
            const item = Array.from(items).find((item) => {
              return item.name === name;
            });

            if (item) {
              const errorMessage = document.createElement('span');
              errorMessage.className = 'error-message';
              errorMessage.innerText = errors[name];
              item.insertAdjacentElement('afterend', errorMessage);
            }
          }

          return;
        }
      }

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
