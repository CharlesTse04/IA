import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import items from './items.json'; // Ensure this file contains the correct structure

// Define the Pokemon item type
type PokemonItem = {
    id: number;
    type: string;
    description: string;
    image?: string; // Optional field
    name: {
        japanese: string;
        english: string;
        chinese: string;
    };
};

const pokeBall = () => {
    const [pokemonInfo, setPokemonInfo] = useState<PokemonItem[]>([]); // Use the defined type

    useEffect(() => {
        // Filter items to only include those of type "Pokeballs"
        const filteredItems = items.filter((item: any) =>
            item.type.toLowerCase().trim() === "pokeballs"
        ) as PokemonItem[]; // Cast to the correct type
        setPokemonInfo(filteredItems);
    }, []);

    const renderItem = ({ item }: { item: PokemonItem }) => (
        <View style={styles.card}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <Text style={styles.nameText}>中文名: {item.name.chinese}</Text>
            <Text style={styles.nameText}>英文名: {item.name.english}</Text>
            <Text style={styles.nameText}>日文名: {item.name.japanese}</Text>
            <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{item.type}</Text>
            </View>
            <Text style={styles.descriptionText}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={pokemonInfo}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        paddingHorizontal: 1,
        paddingVertical: 8,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    nameText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    descriptionText: {
        color: '#666',
        fontSize: 14,
        marginTop: 8,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginBottom: 12,
    },
    typeBadge: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    typeText: {
        color: '#0369a1',
        fontSize: 12,
        fontWeight: '500',
    }
});

export default pokeBall;