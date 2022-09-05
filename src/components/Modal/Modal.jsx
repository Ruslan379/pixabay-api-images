import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import PropTypes from 'prop-types';

import css from 'components/Modal/Modal.module.css' 


const modalRoot = document.querySelector('#modal-root');





export function Modal({ children, onClose }) {

  useEffect(() => {
    //* Переносим handleKeyDown внутрь useEffect,
    //*  чтобы не вносить в массив зависимостей:
      //! React Hook useEffect имеет отсутствующую зависимость: 'handleKeyDown'. 
      //! Либо включите его, либо удалите массив зависимостей: }, []);
      
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]); 


  //* Переносим handleKeyDown внутрь useEffect
  // const handleKeyDown = event => {
  //   if (event.code === 'Escape') {
  //     onClose();
  //   }
  // };


  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };



    return createPortal(
      <div
        className={css.Overlay}
        onClick={handleBackdropClick}
      >
          <div className={css.Modal}>
          {children}
          </div>
      </div>,
      modalRoot,
    );
  }



Modal.propTypes = {
  children: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

