import React from 'react';
import { useState, memo } from 'react'; //* +++

import PropTypes from 'prop-types';

import { Modal } from 'components/Modal/Modal';

import css from 'components/ImageGalleryItem/ImageGalleryItem.module.css' 




//! Компонент ImageGalleryItem будет перерисовываться (перерендываться)
//! только при изменении пропса { hits }

// function ImageGalleryItem({ hits }) { //! + export default memo(ImageGalleryItem); ==> так не работает ВООБЩЕ!!!
// export default memo(function ImageGalleryItem({ hits }) { //! ==> так не работают ImageGalleryItem.propTypes
// const memo(ImageGalleryItem = ({ hits }) => (  //! + export default ImageGalleryItem; ==> так не работает ВООБЩЕ!!!

const ImageGalleryItem = ({ hits }) => {  //* + export default memo(ImageGalleryItem); ==> так РАБОТАЕТ!!!
  
  //! useState ===> **** (аналог this.state.****)
  const [showModal, setShowModal] = useState(false);
  const [largeURL, setLargeURL] = useState("");
  



  //! Инверсия showModal для открытия/закрытия МОДАЛКИ
  const toggleModal = () => {
    setShowModal(!showModal);
  }; 



  //! Кликаем в картинку, ищем её largeImageURL, откываем МОДАЛКУ с картинкой
  const handleBackdropClick = event => {
    if (event.target.src) {
      toggleModal()
      const i = hits.findIndex(hit => hit.webformatURL === event.target.src)
      setLargeURL(hits[i].largeImageURL);
    } else return;
  };
  
  
  
  return (
    <>
      {hits.map(({ id, webformatURL }) => (
        <li
          key={id}
          className={css.ImageGalleryItem}
          onClick={handleBackdropClick} 
        >
          <img
            className={css.ImageGalleryItemImage}
            src={webformatURL}
            alt=""
          />
        </li>
      ))}
      
      {showModal && ( 
            <Modal onClose={toggleModal}>
              <img
                src={largeURL}
                alt=""
              />
            </Modal>
      )}
    </>
  )
};

// );  //* для const
// )); //* для const и memo
// };  //* для function
// }); //* для function и memo


ImageGalleryItem.propTypes = {
  hits: PropTypes.array.isRequired,
};

//! Компонент ImageGalleryItem будет перерисовываться (перерендываться)
//! только при изменении пропса { hits }
export default memo(ImageGalleryItem); //* +++
// export default React.memo(ImageGalleryItem); //* +++ или так, но без: import { memo } from 'react';
