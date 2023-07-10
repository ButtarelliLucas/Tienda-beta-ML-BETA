import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('celulares');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearchQuery(event.target.value);
      setCurrentPage(1); // Reiniciar la página al realizar una nueva búsqueda
    }
  };

  const fetchProducts = async (page) => {
    try {
      const query = searchQuery !== '' ? `q=${searchQuery}&` : '';
      const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?${query}offset=${(page - 1) * productsPerPage}&limit=${productsPerPage}`);
      setProducts(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, []);

  return (
    <div className='' >
      <div className='header'>
      <h1>Productos</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar productos..."
          onKeyPress={handleKeyPress}
          className="search-input"
        />
      </div>
      </div>
      <div className="card-container">
        {products.map((product) => (
          <div key={product.id} className="card">
            <div className="card-image">
              <img src={product.thumbnail} alt={product.title} />
            </div>
            <h2>{product.title}</h2>
            {product.attributes &&
              product.attributes.map((attribute) => {
                if (attribute.id === 'BRAND') {
                  return <p key={attribute.id}>Marca: {attribute.value_name}</p>;
                }
                if (attribute.id === 'ITEM_CONDITION') {
                  return <p key={attribute.id}>Condición: {attribute.value_name}</p>;
                }
                return null;
              })}
            <p>Precio: ${product.price}</p>
            <div>
              <a href={product.permalink} target="_blank" rel="noopener noreferrer">
                Comprar
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <button> {currentPage}</button>
        <button onClick={nextPage}>Siguiente</button>
      </div>
    </div>
  );
};

export default App;
