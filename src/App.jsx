import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPokemons } from './services/pokeApi';
import PokemonList from './components/PokemonList';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import './styles.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 20; // Pokémon por carga
  const observerRef = useRef();

  // Cargar Pokémon con manejo de errores
  const loadPokemons = useCallback(async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchPokemons(limit, offset);
      if (data.length < limit) setHasMore(false);
      setPokemons(prev => [...prev, ...data]);
      setOffset(prev => prev + limit);
    } catch (err) {
      setError("Error al cargar Pokémon. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore, loading]);

  // Efecto para carga inicial y búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      const filtered = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemons(filtered);
    } else {
      // Resetear búsqueda
      setPokemons([]);
      setOffset(0);
      setHasMore(true);
      loadPokemons();
    }
  }, [searchTerm]);

  // Efecto para scroll infinito
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadPokemons();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadPokemons, hasMore, loading]);

  // Carga inicial
  useEffect(() => {
    loadPokemons();
  }, []);

  return (
    <div className="app">
      <h1>Pokédex</h1>
      <SearchBar onSearch={setSearchTerm} />
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={loadPokemons}>Reintentar</button>
        </div>
      )}

      <PokemonList pokemons={searchTerm ? filteredPokemons : pokemons} />
      
      {/* Marcador para scroll infinito */}
      <div ref={observerRef} style={{ height: '20px' }} />
      
      {loading && <Loader />}
      
      {!hasMore && !loading && (
        <p className="end-message">¡Has visto todos los Pokémon!</p>
      )}
    </div>
  );
}

export default App;