const handleEscUp = (evt) => {
  if (evt.key === 'Escape') {
    const activePopup = document.querySelector('.popup_is-opened');
    closeModalWindow(activePopup);
  }
};

export const openModalWindow = (modalWindow) => {
  modalWindow.classList.add('popup_is-opened');
  document.addEventListener('keyup', handleEscUp);
};

export const closeModalWindow = (modalWindow) => {
  modalWindow.classList.remove('popup_is-opened');
  document.removeEventListener('keyup', handleEscUp);
};

export const setCloseModalWindowEventListeners = (modalWindow) => {
  const closeButtonElement = modalWindow.querySelector('.popup__close');
  closeButtonElement.addEventListener('click', () => {
    closeModalWindow(modalWindow);
  });

  modalWindow.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup')) {
      closeModalWindow(modalWindow);
    }
  });
};

// Новая функция для подтверждения удаления 
export const confirmDeletion = (modalWindow, onConfirm) => {
  const form = modalWindow.querySelector('.popup__form');
  const confirmButton = form.querySelector('.popup__button');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onConfirm();
    closeModalWindow(modalWindow);
    form.removeEventListener('submit', handleSubmit);
  };

  form.addEventListener('submit', handleSubmit);
};