// card.js

// Обновление состояния лайка
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

  // Заполнение данными
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  likeCount.textContent = data.likes.length;

  // Состояние лайка
  const isLiked = data.likes.some((user) => user._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Скрываем кнопку удаления, если не автор
  if (data.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  }

  // -------- слушатель лайка --------
  likeButton.addEventListener('click', () => {
    onLikeIcon(template, data._id, likeButton.classList.contains('card__like-button_is-active'));
  });

  // Слушатель удаления
  deleteButton.addEventListener('click', () => {
    onDeleteCard(template, data._id);
  });

  // Слушатель открытия изображения
  cardImage.addEventListener('click', () => {
    onPreviewPicture({ name: data.name, link: data.link });
  });

  return template;
};


export const deleteCard = (cardElement) => {
  cardElement.remove();
};