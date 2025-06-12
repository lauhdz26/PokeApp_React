import { useState, useEffect, } from 'react';
import { fetchPokemons, fetchPokemonDetails } from './services/pokeApi';
import PokemonList from './components/PokemonList';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import './styles.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPokemons = async (offset = 0) => {
    setLoading(true);
    const data = await fetchPokemons(20, offset); // 20 Pokémon por página
    if (data.length === 0) setHasMore(false);
    setPokemons(prev => [...prev, ...data]);
    setFilteredPokemons(prev => [...prev, ...data]);
    setLoading(false);
  };

  useEffect(() => {
    loadPokemons();
  }, []);

  useEffect(() => {
    const filtered = pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemons(filtered);
  }, [searchTerm, pokemons]);

  const handleLoadMore = () => {
    const newOffset = offset + 20;
    setOffset(newOffset);
    loadPokemons(newOffset);
  };

  return (
    <div className="app">
      <h1>Pokédex</h1>
      <SearchBar onSearch={setSearchTerm} />
      <PokemonList pokemons={filteredPokemons} />
      {hasMore && !loading && (
        <button onClick={handleLoadMore} className="load-more">
          Cargar más
        </button>
      )}
      {loading && <Loader />}
    </div>
  );
}

export default App;