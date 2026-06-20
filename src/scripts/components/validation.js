// ---------- Вспомогательные функции (не экспортируются) ----------

const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorClass);
};

const checkInputValidity = (formElement, inputElement, settings) => {
  if (inputElement.validity.valid) {
    hideInputError(formElement, inputElement, settings);
  } else {
    let errorMessage = inputElement.validationMessage;
    // Если есть data-error-message и ошибка из-за patternMismatch,
    // используем кастомное сообщение
    if (inputElement.dataset.errorMessage && inputElement.validity.patternMismatch) {
      errorMessage = inputElement.dataset.errorMessage;
    }
    showInputError(formElement, inputElement, errorMessage, settings);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => !input.validity.valid);
};

const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true;
};

const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.remove(settings.inactiveButtonClass);
  buttonElement.disabled = false;
};

const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
};

const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  // Начальное состояние кнопки (неактивна)
  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

// ---------- Экспортируемые функции ----------

export const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  inputList.forEach((input) => {
    hideInputError(formElement, input, settings);
  });
  disableSubmitButton(buttonElement, settings);
};

export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
};