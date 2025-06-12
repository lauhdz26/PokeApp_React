import { useState, useEffect } from 'react';

function PokemonCard({ pokemon }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Cargar favoritos al iniciar
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.includes(pokemon.id));
  }, [pokemon.id]);

  // Guardar/eliminar favoritos
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = isFavorite
      ? favorites.filter(id => id !== pokemon.id)
      : [...favorites, pokemon.id];
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="pokemon-card">
      <h2>{pokemon.name}</h2>
      <button onClick={toggleFavorite}>
        {isFavorite ? '❤️ Quitar favorito' : '♡ Añadir favorito'}
      </button>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <div>
        <p><strong>Altura:</strong> {pokemon.height / 10}m</p>
        <p><strong>Peso:</strong> {pokemon.weight / 10}kg</p>
        <p><strong>Tipo:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
      </div>
    </div>
  );
}

export default PokemonCard;