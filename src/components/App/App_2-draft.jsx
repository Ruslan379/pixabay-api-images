// import { Component } from 'react'; //?
import { useState } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';

import css from 'components/App/App.module.css' //todo = старый вариант импорта стилей



// export class App extends Component { //?
// export const App = () => { //?
export function App() {

  //?
  // state = {
  //   query: '',
  // };

  //! useState ===> query (аналог this.state.query)
  const [query, setQuery] = useState('');

//* ================================ МЕТОДЫ ==========================================================
  
  //! Передача пропса this.state.query из Searchbar
  // handleFormSubmit = (query) => {
  //   this.setState ({
  //     page: 1,
  //     query,
  //   });
  // };

//! Принимаем (query ===> querySearchbar) из Searchbar
  const handleFormSubmit = (querySearchbar) => {
    setQuery(querySearchbar);
  };



//* ================================ RENDER ==========================================================
  // render() { //?
    // const { query } = this.state //?

    return (
      <div className={css.App}>

        <ToastContainer autoClose={1500} theme={"colored"} />
        
        {/* <Searchbar onSubmit={this.handleFormSubmit} /> //? */}
        <Searchbar onSubmit={handleFormSubmit} />

        <ImageGallery queryNew={query} />
        
      </div>
    );
  }
// } //?
