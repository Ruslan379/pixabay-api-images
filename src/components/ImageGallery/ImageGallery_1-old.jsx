import { Component } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';

import pixabayAPI from 'services/pixabay-api.js';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { Loader } from 'components/Loader/Loader';
import { Button } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';

import css from 'components/ImageGallery/ImageGallery.module.css' //todo = старый вариант импорта стилей



export class ImageGallery extends Component {
  state = {
  page: 1,
  query: '',
  hits: [],
  isLoading: false,
  error: false,
  showModal: false,
  showButton: true,
  };


  //! для поиска largeImageURL
  largeURL = "";


//* ================================ МЕТОДЫ ==========================================================
  //! ==> ОСНОВНОЙ БЛОК. Анализ props и state + ЗАПРОС ==> 1-ый ВАРИАНТ
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.query !== this.props.query
    ) {
      this.setState({
        page: 1,
        query: this.props.query,
        hits: [],
      });
    }

    if (
      prevState.page !== this.state.page ||
      prevState.query !== this.state.query
    ) {
      this.setState({ isLoading: true }); 
      //! Делаем fetch-запрос с помощью services/pixabay-api.js
      setTimeout(() => {
      pixabayAPI
        .fetchPixabay(this.state.query, this.state.page)

        .then(({ hits, query, endOfCollection }) => {
          if (hits[0] === undefined) {  
            toast.warning(`Нет такой темы: ${query}`); 
            // toast.warning(query); 
            this.setState ({
              hits: [],
              isLoading: false
            });
          return;
          } else {
              this.setState(prevState  => ({
                hits: [...prevState.hits, ...hits],
                isLoading: false,
                showButton: true
              }))
          };
          //! endOfCollection - это цифра еще НЕ ПРОСМОТРЕННЫХ элементов коллекции
          console.log("endOfCollection: ", endOfCollection); //!
          if (endOfCollection <= 0) {
            toast.info('Вы достигли конца результатов поиска', { autoClose: 3000 } ); 
            this.setState({ showButton: false });  //! Кнопка LOAD MORE => ПРЯЧЕМ
            return;
          }
        })
        //! Обработка ошибок
        .catch(error => {
          this.setState({ error, isLoading: false });
          console.log(error); //!
          // alert(error);
          toast.error(`Ошибка запроса: ${error}`, { position: "top-left", autoClose: 2000 } ); 
        });
      }, 1000);
      //! Передача пропса this.state в App
      // this.props.onSubmit(this.state); 
    }
  };



  //! Кнопка loadMore
  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
      showButton: false,
    })); 
  }
  


  //! Инверсия showModal для открытия/закрытия МОДАЛКИ
  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  }; 



  //! Кликаем в картинку, ищем её largeImageURL, откываем МОДАЛКУ с картинкой
  handleBackdropClick1 = event => {
    if (event.target.src) {
      this.toggleModal()
      const i = this.state.hits.findIndex(hit => hit.webformatURL === event.target.src)
      this.largeURL = this.state.hits[i].largeImageURL;
    } else return;
  };



//* ================================ RENDER ==========================================================
  render() {
    const { hits, isLoading, showModal, showButton } = this.state


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
          onClick={this.handleBackdropClick1}
        >
          <ImageGalleryItem hits={hits} />
        </ul>

        {isLoading && <Loader />}

        {(hits[0] !== undefined && showButton) && <Button onClick={this.loadMore} />}
        
        {showModal && (
          <Modal onClose={this.toggleModal}>
            <img
              src={this.largeURL}
              alt=""
            />
          </Modal>
        )}
      </>
    );
  }
}


ImageGallery.propTypes = {
  // onSubmit: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
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
