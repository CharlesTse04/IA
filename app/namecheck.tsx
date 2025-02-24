import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import pokedexData from './pokedex.json'; // Adjust the path accordingly
// import * as Network from 'expo-network';

export default function PokemonSearch() {
  const [inputName, setInputName] = useState('');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [pokemonInfo, setPokemonInfo] = useState<{
    id: number;
    name: {
      english: string;
      japanese: string;
      chinese: string;
      french: string;
    };
    type: string[];
    base: {
      HP: number;
      Attack: number;
      Defense: number;
      "Sp. Attack": number;
      "Sp. Defense": number;
      Speed: number;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    setPrediction(inputName); // Set prediction based on user input
    const matchedPokemon = pokedexData.find(pokemon =>
      pokemon.name.english.toLowerCase().trim() === inputName.toLowerCase().trim()

    );

    if (matchedPokemon) {
      setPokemonInfo(matchedPokemon);
      setError(null); // Clear error if found
    } else {
      setPokemonInfo(null); // Clear previous info
      setError(`No Pokémon found with the name "${inputName}"`);
    }
  };

  /*const [ipAddress, setIpAddress] = useState('Fetching...');

  useEffect(() => {
    async function fetchIp() {
      try {
        const ip = await Network.getIpAddressAsync();
        setIpAddress(ip);
        console.log("Device IP Address:", ip);
      } catch (error) {
        console.error("Error fetching IP Address:", error);
        setIpAddress("Failed to fetch IP");
      }
    }

    fetchIp();
  }, []);*/

  return (
    <View style={styles.container}>
      {/*<Text>Address: {ipAddress}</Text>*/}
      <TextInput
        style={styles.input}
        value={inputName}
        onChangeText={setInputName}
        placeholder="Enter Pokémon name"
      />

      {pokemonInfo && (
        <View style={styles.pokemonInfo}>
          <Text style={styles.pokemonName}>English:{pokemonInfo.name.english}</Text>
          <Text style={styles.pokemonName}>Japanese:{pokemonInfo.name.japanese}</Text>
          <Text style={styles.pokemonName}>Chinese:{pokemonInfo.name.chinese}</Text>
          <Text style={styles.pokemonName}>French:{pokemonInfo.name.french}</Text>
          <Text>Type: {pokemonInfo.type.join(', ')}</Text>
          <Text>HP: {pokemonInfo.base.HP}</Text>
          <Text>Attack: {pokemonInfo.base.Attack}</Text>
          <Text>Defense: {pokemonInfo.base.Defense}</Text>
          <Text>Speed: {pokemonInfo.base.Speed}</Text>
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pokemonInfo: {
    marginTop: 24,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pokemonName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  statContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  statBadge: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statText: {
    color: '#475569',
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
  }
});