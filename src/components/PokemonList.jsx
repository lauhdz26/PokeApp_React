import { useState } from 'react';
import PokemonCard from './PokemonCard';
import { fetchPokemonDetails } from '../services/pokeApi';
function PokemonList({ pokemons }) {
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const handleSelect = async (url) => {
        const details = await fetchPokemonDetails(url);
        setSelectedPokemon(details);
    };
    return (
        <div className="pokemon-list">
            <div className="list">
                {pokemons.map((pokemon, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelect(pokemon.url)}
                        className="pokemon-item"
                    >
                        {pokemon.name}
                    </div>
                ))}
            </div>
            {selectedPokemon && <PokemonCard pokemon={selectedPokemon} />}
        </div>
    );
}
export default PokemonList;