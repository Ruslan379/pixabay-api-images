//! Формируем строку URL-запроса:
const API_KEY = '28759369-3882e1068ac26fe18d14affeb';
const BASE_URL = 'https://pixabay.com/api/';
// const BASE_URL = 'https://pixabay.com/apiq/'; //! проверка на ошибку запроса в catch ImageGallery

const per_page = 12;


function fetchPixabay(query, page) {
  return fetch(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&page=${page}&per_page=${per_page}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(new Error(`Нет такой темы ${query}`));
    })
    .then(({ totalHits, hits }) => {
      //! endOfCollection - это цифра еще НЕ ПРОСМОТРЕННЫХ элементов коллекции
      const endOfCollection = totalHits - page * per_page;
      const all = { hits, endOfCollection };
      return all;
    })
}

const api = {
  fetchPixabay,
};

export default api;
