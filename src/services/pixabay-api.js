import axios from 'axios';

//! Формируем строку URL-запроса:
const API_KEY = '28759369-3882e1068ac26fe18d14affeb';
const BASE_URL = 'https://pixabay.com/api/';
// const BASE_URL = 'https://pixabay.com/apiq/'; //! проверка на ошибку запроса в catch ImageGallery
const per_page = 12;



async function fetchPixabay(query, page) {
  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&page=${page}&per_page=${per_page}`)
  const { totalHits, hits } = response.data;
  //! endOfCollection - это цифра еще НЕ ПРОСМОТРЕННЫХ элементов коллекции
  const endOfCollection = totalHits - page * per_page;
  const all = { totalHits, hits, query, endOfCollection };
  return all;
}

const api = {
  fetchPixabay,
};

export default api;
