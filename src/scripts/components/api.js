// Конфигурация API (замените на свои данные)
const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/ваш-идентификатор-группы',
  headers: {
    authorization: 'ваш-личный-токен',
    'Content-Type': 'application/json',
  },
};

// Проверка ответа
const getResponseData = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

// Получение данных пользователя
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(getResponseData);
};

// Получение списка карточек
export const getCardList = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(getResponseData);
};

// Обновление профиля
export const updateUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about }),
  }).then(getResponseData);
};

// Обновление аватара
export const updateAvatar = (avatar) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar }),
  }).then(getResponseData);
};

// Добавление новой карточки
export const addCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link }),
  }).then(getResponseData);
};

// Удаление карточки
export const deleteCardApi = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(getResponseData);
};

// Постановка/снятие лайка
export const changeLikeCardStatus = (cardId, isLiked) => {
  const method = isLiked ? 'DELETE' : 'PUT';
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method,
    headers: config.headers,
  }).then(getResponseData);
};