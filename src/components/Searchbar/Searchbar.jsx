import { useState } from 'react';
import PropTypes from 'prop-types';

import { ImSearch } from 'react-icons/im';

import { toast } from 'react-toastify';

import css from 'components/Searchbar/Searchbar.module.css' //todo = старый вариант импорта стилей




export function Searchbar({ onSubmit }) {
  //! useState ===> query (аналог this.state.query)
  const [query, setQuery] = useState('');


  //! Запись в state значения поля инпут
  const handleChange = event => {
    setQuery(event.currentTarget.value.toLowerCase());
  };



  //! Submit ФОРМЫ, провека на "", передача пропса this.state.query в App
  const handleSubmit = event => {
    event.preventDefault();
    //! Проверка на пустую строку в инпуте
    if (event.target.elements.query.value.trim() === '') {
      toast.error('Поле не должно быть пустым');
      event.target.reset()
      return;
    };
    //! Передача значения (query) в App
    onSubmit(query); //?
    //! Очистка поля инпута
    event.target.reset()
  };


    return (
      <header className={css.Searchbar}>
        <form
          className={css.SearchForm}
          onSubmit={handleSubmit}
        >
          <button
            type="submit"
            className={css.SearchFormButton}
            
          >
            <ImSearch style={{ marginRight: 8 }} />
            <span className={css.SearchFormButtonLabel1}>Search</span>
          </button>

          <input
            className={css.SearchFormInput}
            type="text"
            name = "query"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={handleChange}
          />     
        </form>  
      </header>
    );
  }



Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};