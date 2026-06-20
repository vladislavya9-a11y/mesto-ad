export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => onLikeIcon(likeButton));
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(cardElement));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  return cardElement;
};

// Переключение лайка (обновление иконки и счётчика)
export const updateLikeState = (cardElement, likes, isLiked) => {
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  } else {
    likeButton.classList.remove('card__like-button_is-active');
  }
  likeCount.textContent = likes.length;
};

// Создание карточки
export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard, currentUserId }
) => {
  const template = document
    .getElementById('card-template')
    .content.querySelector('.card')
    .cloneNode(true);

  const cardImage = template.querySelector('.card__image');
  const cardTitle = template.querySelector('.card__title');
  const likeButton = template.querySelector('.card__like-button');
  const likeCount = template.querySelector('.card__like-count');
  const deleteButton = template.querySelector('.card__control-button_type_delete');

  // Заполняем данными
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  likeCount.textContent = data.likes.length;

  // Показываем лайк, если пользователь уже лайкнул
  const isLiked = data.likes.some((user) => user._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Скрываем кнопку удаления, если не автор
  if (data.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  }

  // Слушатель лайка
  likeButton.addEventListener('click', () => {
    onLikeIcon(cardElement, data._id, likeButton.classList.contains('card__like-button_is-active'));
  });

  // Слушатель удаления
  deleteButton.addEventListener('click', () => {
    onDeleteCard(cardElement, data._id);
  });

  // Слушатель открытия изображения
  cardImage.addEventListener('click', () => {
    onPreviewPicture({ name: data.name, link: data.link });
  });

  return template;
};