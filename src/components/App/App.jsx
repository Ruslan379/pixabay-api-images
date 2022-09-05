import { useState } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery'; 

import css from 'components/App/App.module.css' //todo = старый вариант импорта стилей



export function App() {
  //! useState ===> query (аналог this.state.query)
  const [query, setQuery] = useState('');


//! Принимаем (query ===> querySearchbar) из Searchbar
  const handleFormSubmit = (querySearchbar) => {
    setQuery(querySearchbar);
  };


    return (
      <div className={css.App}>
        <ToastContainer autoClose={1500} theme={"colored"} />
        <Searchbar onSubmit={handleFormSubmit} />
        <ImageGallery queryNew={query} />
      </div>
    );
  }

