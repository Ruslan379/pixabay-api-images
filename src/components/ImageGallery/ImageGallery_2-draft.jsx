// import { Component } from 'react'; //?
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';

import pixabayAPI from 'services/pixabay-api.js';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { Loader } from 'components/Loader/Loader';
import { Button } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';

import css from 'components/ImageGallery/ImageGallery.module.css' //todo = старый вариант импорта стилей



// export class ImageGallery extends Component { //?
export function ImageGallery({ queryNew }) {
  
  //?
  // state = {
  // page: 1,
  // query: '',
  // hits: [],
  // isLoading: false,
  // error: false,
  // showModal: false,
  // showButton: true,
  // };

  //! useState ===> **** (аналог this.state.****)
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCatch, setErrorCatch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [largeURL, setLargeURL] = useState("");


  //? ! для поиска largeImageURL
  // let largeURL = "";


//* ================================ МЕТОДЫ ==========================================================
  //? ! ==> ОСНОВНОЙ БЛОК. Анализ props и state + ЗАПРОС ==> 1-ый ВАРИАНТ
  //?
  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     prevProps.query !== this.props.query
  //   ) {
  //     this.setState({
  //       page: 1,
  //       query: this.props.query,
  //       hits: [],
  //     });
  //   }

  //   if (
  //     prevState.page !== this.state.page ||
  //     prevState.query !== this.state.query
  //   ) {
  //     this.setState({ isLoading: true });
  //     //? ! Делаем fetch-запрос с помощью services/pixabay-api.js
  //     setTimeout(() => {
  //     pixabayAPI
  //       .fetchPixabay(this.state.query, this.state.page)

  //       .then(({ hits, query, endOfCollection }) => {
  //         if (hits[0] === undefined) {
  //           toast.warning(`Нет такой темы: ${query}`);
  //           this.setState ({
  //             hits: [],
  //             isLoading: false
  //           });
  //         return;
  //         } else {
  //             this.setState(prevState  => ({
  //               hits: [...prevState.hits, ...hits],
  //               isLoading: false,
  //               showButton: true
  //             }))
  //         };
  //         //? ! endOfCollection - это цифра еще НЕ ПРОСМОТРЕННЫХ элементов коллекции
  //         console.log("endOfCollection: ", endOfCollection); //? !
  //         if (endOfCollection <= 0) {
  //           toast.info('Вы достигли конца результатов поиска', { autoClose: 3000 } );
  //           this.setState({ showButton: false });  //? ! Кнопка LOAD MORE => ПРЯЧЕМ
  //           return;
  //         }
  //       })
  //       //? ! Обработка ошибок
  //       .catch(error => {
  //         this.setState({ error, isLoading: false });
  //         console.log(error); //!
  //         // alert(error);
  //         toast.error(`Ошибка запроса: ${error}`, { position: "top-left", autoClose: 2000 } );
  //       });
  //     }, 500);
  //     //? ! Передача пропса this.state в App
  //     // this.props.onSubmit(this.state);
  //   }
  // };

  


  //! Анализ props queryNew и запись его в query
  useEffect(() => {
    setPage(1);
    setQuery(queryNew);
    setHits([]);
    }, [queryNew]);

//! Анализ [page, query] + ЗАПРОС
  useEffect(() => {
    //! Первый рендер, если query - это пустая строка, то НЕ ДЕЛАЕМ HTTP-запрос
    if (!query) {
      return;
    };
    
    setIsLoading(true);

    //! Делаем HTTP-запрос с помощью services/pixabay-api.js
    setTimeout(() => { 
      pixabayAPI
        .fetchPixabay(query, page)
        .then(({ hits, query, endOfCollection }) => {
          if (hits[0] === undefined) {  
            toast.warning(`Нет такой темы: ${query}`); 
            setHits([]);
            setIsLoading(false);
            return;
          } else {
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
          setErrorCatch(error);
          console.log(error); //!
          toast.error(`Ошибка запроса: ${errorCatch}`, { position: "top-left", autoClose: 2000 } ); 
        });
    }, 1000);
  }, [page, query, errorCatch]);
  

  
  //! Кнопка loadMore
  const loadMore = () => {
    setShowButton(false); //! Кнопка LOAD MORE => ПРЯЧЕМ
    setPage(prevState => prevState + 1);
    

    // this.setState(prevState => ({
    //   page: prevState.page + 1,
    //   showButton: false,
    // })); //?

  }
  


  //! Инверсия showModal для открытия/закрытия МОДАЛКИ
  const toggleModal = () => {
    setShowModal(!showModal);
    // this.setState(({ showModal }) => ({showModal: !showModal})); //?
  }; 



  //! Кликаем в картинку, ищем её largeImageURL, откываем МОДАЛКУ с картинкой
  const handleBackdropClick = event => {
    if (event.target.src) {
      // this.toggleModal() //?
      toggleModal()
      // const i = this.state.hits.findIndex(hit => hit.webformatURL === event.target.src)
      // this.largeURL = this.state.hits[i].largeImageURL;
      // console.log("event.target.src: ", event.target.src); //!
      const i = hits.findIndex(hit => hit.webformatURL === event.target.src)
      // largeURL = hits[i].largeImageURL; //?
      setLargeURL(hits[i].largeImageURL);
      // console.log("handleBackdropClick largeURL:",  largeURL); //!
    } else return;
  };

  // console.log("largeURL:",  largeURL); //!

//? * ================================ RENDER ==========================================================
  // render() { //?
    // const { hits, isLoading, showModal, showButton } = this.state //?


    return (
      < >
        {(hits[0] === undefined && isLoading === false) && (
          <div
            style={{ margin: '0 auto' }}
          >
            <h1>Введите тему</h1>
          </div>
        )}
        
        <ul
          className={css.ImageGallery}
          // onClick={this.handleBackdropClick} //?
          onClick={handleBackdropClick}
        >
          <ImageGalleryItem hits={hits} />
        </ul>

        {isLoading && <Loader />}

        {/* {(hits[0] !== undefined && showButton) && <Button onClick={this.loadMore} />} //? */}
        {(hits[0] !== undefined && showButton) && <Button onClick={loadMore} />}

        
        {showModal && (
          <Modal onClose={toggleModal}>
            <img
              src={largeURL}
              alt=""
            />
          </Modal>
        )}
      </>
    );
  }
// } //?


ImageGallery.propTypes = {
  // onSubmit: PropTypes.func.isRequired,
  // query: PropTypes.string.isRequired,
  query: PropTypes.string
};














//! OLD --------------------------------------------------------------------------
// import React from 'react';
// import PropTypes from 'prop-types';

// // import classNames from 'classnames';

// // import 'components/ContactList/ContactList.css';
// import css from 'components/ImageGallery/ImageGallery.module.css' //todo = старый вариант импорта стилей




// export const ImageGallery = ({ hits }) => (
//         <ul className={css.ImageGallery}>
//           {hits.map(({ id, webformatURL, largeImageURL }) => (
//             <li
//               key={id}
//               // className="gallery-item"
//               className={css.ImageGalleryItem}
//             >
//               <img
//                 className={css.ImageGalleryItemImage}
//                 src={webformatURL}
//                 alt=""
//               />
//           </li>
//           ))}
//         </ul>
// );


// ImageGallery.propTypes = {
//   hits: PropTypes.array.isRequired,
  
// };



// // export default Filter;
