import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from '@/hooks/useColorScheme';

import pokedexData from './pokedex.json';
import React from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('需要相冊權限');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setPrediction(null);
      setError(null);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      setError('請選擇圖片');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fileExtension = selectedImage.split('.').pop()?.toLowerCase();

      // 根据扩展名动态设置 MIME 类型
      let mimeType = 'image/jpeg'; // 默认值
      if (fileExtension === 'png') {
        mimeType = 'image/png';
      } else if (fileExtension === 'webp') {
        mimeType = 'image/webp';
      } else if (fileExtension === 'jpg') {
        mimeType = 'image/jpg';
      }

      const formData = new FormData();
      formData.append('file', {  // 改成 'file'
        uri: selectedImage,
        name: `image.${fileExtension}`, // 动态设置文件名
        type: mimeType, // 动态设置 MIME 类型
      } as any);
      
      // here cahnge your computer ip address, and your phone network make sure same to computer network
      const response = await fetch('http://192.168.0.141:5001/api/add', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.predicted_class);
        const matchedPokemon = pokedexData.find(pokemon =>
          pokemon.name.english.toLowerCase().trim() === data.predicted_class?.toLowerCase().trim());

        if (matchedPokemon) {
          setPokemonInfo(matchedPokemon);
        } else {
          alert("null"); // Handle case where no match is found
        }
      } else {
        setError(data.error || '预测失败');
      }
    } catch (error) {
      console.error('Network request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>选择图片</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={uploadImage}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>上传预测</Text>
        )}
      </TouchableOpacity>

      {pokemonInfo && (
        <View>
          <Text>English:{pokemonInfo.name.english}</Text>
          <Text>Japanese:{pokemonInfo.name.japanese}</Text>
          <Text>Chinese:{pokemonInfo.name.chinese}</Text>
          <Text>French:{pokemonInfo.name.french}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
    borderRadius: 10,
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});