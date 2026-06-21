import {
  getUserInfo,
  getCardList,
  updateUserInfo,
  updateAvatar,
  addCard,
  deleteCardApi,
  changeLikeCardStatus,
} from './components/api.js';

import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from './components/modal.js';
import { enableValidation, clearValidation, disableSubmitButton, enableSubmitButton } from './components/validation.js';
import { createCardElement, updateLikeState, deleteCard } from './components/card.js';

// -------------------- Настройки валидации --------------------
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup_button_disabled',
  inputErrorClass: 'popup_input_type_error',
  errorClass: 'popup_error_visible',
};

enableValidation(validationSettings);

// -------------------- DOM-узлы --------------------
const placesWrap = document.querySelector('.places__list');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

const profileFormModalWindow = document.querySelector('.popup_type_edit');
const profileForm = profileFormModalWindow.querySelector('.popup__form');
const profileTitleInput = profileForm.querySelector('.popup__input_type_name');
const profileDescriptionInput = profileForm.querySelector('.popup__input_type_description');

const avatarFormModalWindow = document.querySelector('.popup_type_edit-avatar');
const avatarForm = avatarFormModalWindow.querySelector('.popup__form');
const avatarInput = avatarForm.querySelector('.popup__input');

const cardFormModalWindow = document.querySelector('.popup_type_new-card');
const cardForm = cardFormModalWindow.querySelector('.popup__form');
const cardNameInput = cardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardForm.querySelector('.popup__input_type_url');

const imageModalWindow = document.querySelector('.popup_type_image');
const imageElement = imageModalWindow.querySelector('.popup__image');
const imageCaption = imageModalWindow.querySelector('.popup__caption');

const deleteModalWindow = document.querySelector('.popup_type_remove-card');
const infoModalWindow = document.querySelector('.popup_type_info');

const openProfileFormButton = document.querySelector('.profile__edit-button');
const openCardFormButton = document.querySelector('.profile__add-button');
const logo = document.querySelector('.header__logo'); // для статистики

// -------------------- Глобальное состояние --------------------
let currentUserId = null;
let allCards = [];

// -------------------- Рендеринг карточек --------------------
const renderCards = (cards) => {
  placesWrap.innerHTML = '';
  cards.forEach((card) => {
    const cardElement = createCardElement(card, {
      onPreviewPicture: handlePreviewPicture,
      onLikeIcon: handleLike,
      onDeleteCard: handleDelete,
      currentUserId,
    });
    placesWrap.append(cardElement);
  });
};

// -------------------- Обработчики --------------------
// Открытие изображения
const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

// Лайк
const handleLike = (cardElement, cardId, isLiked) => {
  changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      updateLikeState(cardElement, updatedCard.likes, !isLiked);
    })
    .catch((err) => console.error('Ошибка при лайке:', err));
};


// Обработчик удаления 
const handleDelete = (cardElement, cardId) => {
  
  openModalWindow(deleteModalWindow);

  
  const form = deleteModalWindow.querySelector('.popup__form');

  
  if (form._submitHandler) {
    form.removeEventListener('submit', form._submitHandler);
    delete form._submitHandler;
  }

  
  const submitHandler = (evt) => {
    evt.preventDefault();

    const confirmButton = deleteModalWindow.querySelector(validationSettings.submitButtonSelector);
    const originalText = confirmButton.textContent;
    confirmButton.textContent = 'Удаление...';
    disableSubmitButton(confirmButton, validationSettings);

    deleteCardApi(cardId)
      .then(() => {
        deleteCard(cardElement);
        allCards = allCards.filter((c) => c._id !== cardId);
        closeModalWindow(deleteModalWindow);
      })
      .catch((err) => {
        console.error('Ошибка удаления карточки:', err);
      })
      .finally(() => {
        confirmButton.textContent = originalText;
        enableSubmitButton(confirmButton, validationSettings);
    
        form.removeEventListener('submit', submitHandler);
        delete form._submitHandler;
      });
  };

  
  form._submitHandler = submitHandler;
  form.addEventListener('submit', submitHandler);
};

// Редактирование профиля
const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const button = profileForm.querySelector(validationSettings.submitButtonSelector);
  const originalText = button.textContent;
  button.textContent = 'Сохранение...';
  disableSubmitButton(button, validationSettings); 

  updateUserInfo(profileTitleInput.value, profileDescriptionInput.value)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => console.error('Ошибка обновления профиля:', err))
    .finally(() => {
      button.textContent = originalText;
      enableSubmitButton(button, validationSettings); 
    });
};

// Обновление аватара
const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  const button = avatarForm.querySelector(validationSettings.submitButtonSelector);
  const originalText = button.textContent;
  button.textContent = 'Сохранение...';
  disableSubmitButton(button, validationSettings);

  updateAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => console.error('Ошибка обновления аватара:', err))
    .finally(() => {
      button.textContent = originalText;
      enableSubmitButton(button, validationSettings);
    });
};

// Добавление карточки
const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const button = cardForm.querySelector(validationSettings.submitButtonSelector);
  const originalText = button.textContent;
  button.textContent = 'Создание...';
  disableSubmitButton(button, validationSettings);

  addCard(cardNameInput.value, cardLinkInput.value)
    .then((newCard) => {
      allCards.push(newCard);
      const cardElement = createCardElement(newCard, {
        onPreviewPicture: handlePreviewPicture,
        onLikeIcon: handleLike,
        onDeleteCard: handleDelete,
        currentUserId,
      });
      placesWrap.prepend(cardElement);
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => console.error('Ошибка добавления карточки:', err))
    .finally(() => {
      button.textContent = originalText;
      enableSubmitButton(button, validationSettings);
    });
};

// -------------------- Статистика (вариант 3) --------------------
const renderStatistics = () => {
  
  const users = new Set();
  let totalLikes = 0;
  const userLikes = {};
  const cardLikes = {};

  allCards.forEach((card) => {
    users.add(card.owner._id);
    const likesCount = card.likes.length;
    totalLikes += likesCount;
    cardLikes[card._id] = likesCount;

    card.likes.forEach((user) => {
      userLikes[user._id] = (userLikes[user._id] || 0) + 1;
    });
  });


  let maxLikes = 0;
  let championId = null;
  for (const [id, count] of Object.entries(userLikes)) {
    if (count > maxLikes) {
      maxLikes = count;
      championId = id;
    }
  }


  let championName = 'Неизвестно';

  for (const card of allCards) {
    if (card.owner._id === championId) {
      championName = card.owner.name;
      break;
    }
  }

  if (championId === currentUserId) {
    championName = profileTitle.textContent;
  }


  const sortedCards = [...allCards].sort((a, b) => b.likes.length - a.likes.length);
  const top3 = sortedCards.slice(0, 3).map((c) => c.name);

  
  const infoContent = infoModalWindow.querySelector('.popup__info');
  infoContent.innerHTML = ''; 

  
  const defTemplate = document.getElementById('popup-info-definition-template');
  const userTemplate = document.getElementById('popup-info-user-preview-template');

  
  const dataItems = [
    { term: 'Всего пользователей', description: users.size },
    { term: 'Всего лайков', description: totalLikes },
    { term: 'Максимальное количество лайков', description: maxLikes },
    { term: 'Чемпион лайков', description: championName },
  ];

  dataItems.forEach((item) => {
    const clone = defTemplate.content.cloneNode(true);
    clone.querySelector('.popup__info-term').textContent = item.term;
    clone.querySelector('.popup__info-description').textContent = item.description;
    infoContent.append(clone);
  });

  
  const titleTemplate = document.getElementById('popup-info-title-template');
  const titleClone = titleTemplate.content.cloneNode(true);
  titleClone.querySelector('.popup__text').textContent = 'Популярные карточки:';
  infoContent.append(titleClone);

  
  const list = document.createElement('ul');
  list.classList.add('popup__list');
  top3.forEach((name) => {
    const clone = userTemplate.content.cloneNode(true);
    clone.querySelector('.popup__list-item').textContent = name;
    list.append(clone);
  });
  infoContent.append(list);


  openModalWindow(infoModalWindow);
};

// -------------------- Слушатели событий --------------------
profileForm.addEventListener('submit', handleProfileFormSubmit);
avatarForm.addEventListener('submit', handleAvatarFormSubmit);
cardForm.addEventListener('submit', handleCardFormSubmit);

openProfileFormButton.addEventListener('click', () => {
  clearValidation(profileForm, validationSettings);
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener('click', () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

// Клик по логотипу для статистики
logo.addEventListener('click', renderStatistics);

// -------------------- Закрытие попапов --------------------
const allPopups = document.querySelectorAll('.popup');
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

// -------------------- Загрузка данных с сервера --------------------
Promise.all([getUserInfo(), getCardList()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    allCards = cards;
    renderCards(cards);
  })
  .catch((err) => console.error('Ошибка загрузки данных:', err));