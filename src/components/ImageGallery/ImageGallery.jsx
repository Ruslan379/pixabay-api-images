import { useState, useEffect, useLayoutEffect } from 'react'; 
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';

import pixabayAPI from 'services/pixabay-api.js';

import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem'; //! +++
import { Loader } from 'components/Loader/Loader';
import { Button } from 'components/Button/Button';


import css from 'components/ImageGallery/ImageGallery.module.css' 



export function ImageGallery({ queryNew }) { 
  //! useState ===> **** (аналог this.state.****)
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showButton, setShowButton] = useState(true);




  //! Анализ props { queryNew } и запись его в state (query)
  useEffect(() => {
    setPage(1);
    setQuery(queryNew);
    setHits([]);
    }, [queryNew]);

  
//! Анализ [page, query] + ЗАПРОС (было на useEffect)
  useLayoutEffect(() => {
    //! Первый рендер, если query - это пустая строка, то НЕ ДЕЛАЕМ HTTP-запрос
    if (!query) {
      return;
    };
    setIsLoading(true);
    setError(false);
    //! Делаем HTTP-запрос с помощью services/pixabay-api.js
    setTimeout(() => { 
      pixabayAPI
        .fetchPixabay(query, page)
        .then(({ totalHits, hits, query, endOfCollection }) => { 
          if (hits.length === 0) {  
            toast.warning(`Нет такой темы: ${query}`); 
            setHits([]);
            setIsLoading(false);
            return;
          } else {
            if (page === 1) {
              toast.success(`По вашей теме найдено ${totalHits} изображений`, { autoClose: 3000 });
            };
              setHits(prevState => [...prevState, ...hits]);
              setIsLoading(false);
              setShowButton(true);
            };
          //! endOfCollection - это цифра еще НЕ ПРОСМОТРЕННЫХ элементов коллекции
          console.log("endOfCollection: ", endOfCollection); //!
          if (endOfCollection <= 0) {
            toast.info('Вы достигли конца результатов поиска', { autoClose: 3000 }); 
            setShowButton(false); //! Кнопка LOAD MORE => ПРЯЧЕМ
            return;
          }
        })
        //! Обработка ошибок
        .catch(error => {
          setIsLoading(false);
          setError(error.message);
          console.log(error.message); //!
          toast.error(`Ошибка запроса: ${error.message}`, { position: "top-center", autoClose: 2000 } ); 
        })
    }, 1000);
  }, [page, query]);
  

  
  //! Кнопка loadMore
  const loadMore = () => {
    setShowButton(false); //! Кнопка LOAD MORE => ПРЯЧЕМ
    setPage(prevState => prevState + 1);
  };
  


    return (
      < >
        {error && (
          <div style={{ margin: '0 auto', color: 'red' }}>
            <h1>Ошибка запроса:</h1>
            <h2 style={{ textDecoration: "underline", fontStyle: 'italic', color: '#a10000' }}>!!! {error}</h2>
          </div>
        )}
          
        {(hits.length === 0 && isLoading === false) && (
          <div style={{ margin: '0 auto' }}>
            <h1>Введите тему</h1>
          </div>
        )}
        
        <ul className={css.ImageGallery}>
          <ImageGalleryItem hits={hits} />
        </ul>

        {isLoading && <Loader />}

        {(hits.length !== 0 && showButton) && <Button onClick={loadMore} />}

      </>
    );
  }



ImageGallery.propTypes = {
  query: PropTypes.string
};
