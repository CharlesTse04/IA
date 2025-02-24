import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import Imagechack from './imagecheckAi';
import Namechack from './namecheck';
import PokiBall from './pokiBall';
import Beack from '../assets/images/backgound.png';
import { MaterialIcons } from '@expo/vector-icons';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const [showImageCheck, setShowImageCheck] = useState(false);
    const [showNameCheck, setShowNameCheck] = useState(false);
    const [showBallCheck, setShowBallCheck] = useState(false);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null; // Optionally return a loading indicator here
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StatusBar style="auto" />
            {!showBallCheck && !showImageCheck && !showNameCheck && (
            <Image source={Beack} style={styles.image} />
          )}
            <View style={styles.container}>
                <Stack />
             
                
               {!showBallCheck && !showImageCheck && !showNameCheck && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.ballButton]}
                            onPress={() => setShowBallCheck(true)}
                        >
                            <MaterialIcons name="sports-baseball" size={24} color="white" />
                            <Text style={styles.buttonText}>精靈球圖鑒</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.button, styles.imageButton]}
                            onPress={() => setShowImageCheck(true)}
                        >
                            <MaterialIcons name="image-search" size={24} color="white" />
                            <Text style={styles.buttonText}>圖片Sreach</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.button, styles.nameButton]}
                            onPress={() => setShowNameCheck(true)}
                        >
                            <MaterialIcons name="text-fields" size={24} color="white" />
                            <Text style={styles.buttonText}>精靈名Sreach</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* 修改后的检测界面 */}
                {showBallCheck && (
                    <View style={styles.imageCheckContainer}>
                        <PokiBall />
                        <TouchableOpacity
                            style={[styles.button, styles.backButton]}
                            onPress={() => setShowBallCheck(false)}
                        >
                            <Text style={styles.buttonText}>返回主菜單</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {showImageCheck && (
                    <View style={styles.imageCheckContainer}>
                        <Imagechack />
                        <TouchableOpacity
                            style={[styles.button, styles.backButton]}
                            onPress={() => setShowImageCheck(false)}
                        >
                            <Text style={styles.buttonText}>返回主菜单</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {showNameCheck && (
                    <View style={styles.imageCheckContainer}>
                        <Namechack />
                        <TouchableOpacity
                            style={[styles.button, styles.backButton]}
                            onPress={() => setShowNameCheck(false)}
                        >
                            <Text style={styles.buttonText}>返回主菜单</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 50,
    },
    image: {
        width: 650, // Set width in pixels
        height: 450, // Allow height to be auto based on the image's aspect ratio
        aspectRatio: 1, // Optional: maintain aspect ratio if desired
    },
    imageCheckContainer: {
        marginTop: 30, // Adjust this value to move Imagechack higher or lower
    },

    buttonContainer: {
        width: '80%',
        gap: 20,
        zIndex: 1, // 确保按钮在背景图上层
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        gap: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    ballButton: {
        backgroundColor: '#e74c3c',
    },
    imageButton: {
        backgroundColor: '#3498db',
    },
    nameButton: {
        backgroundColor: '#2ecc71',
    },
    backButton: {
        backgroundColor: '#9b59b6',
        marginTop: 20,
    },
});