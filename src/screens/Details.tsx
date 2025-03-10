import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import { AddressClient } from '../api/address';

export default function DetailsScreen({ navigation }) {
  const selectedImage = useSelector((state: any) => state.app.selectedImage);
  const imageMetaData = useSelector((state: any) => state.app.imageMetaData);

  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeachRunning, setIsSpeachRunning] = useState(false);
  const [isSpeechEnded, setIsSpeechEnded] = useState(false);
  const messageBuffer = useRef(''); // Buffer to collect fast messages

  const uploadImage = async (socket) => {
    messageBuffer.current = '';
    setMessage('');
    setIsLoading(true);
    Speech.stop();

    let address = null;
    try {
      const response = await AddressClient.getAddressData(imageMetaData.GPSLatitude, imageMetaData.GPSLongitude);
      if (response?.results?.length && response?.results[0].formatted) {
        address = response?.results[0].formatted;
      }
    } catch (addressError) {

    }
    try {
      // Read the image as a base64 string
      const base64Image = await FileSystem.readAsStringAsync(selectedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Send the base64 image over WebSocket
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "imageUpload", image: base64Image, address }));
        console.log('Image sent to WebSocket');
      } else {
        console.warn('WebSocket is not open');
      }
    } catch (error) {
      console.error('Error encoding image:', error);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    // Create a WebSocket connection
    const socket = new WebSocket('ws://nearby-kassia-brickipedia-9f06bb5f.koyeb.app/ws/chat/');
    // const socket = new WebSocket('ws://192.168.178.226:3030/ws/chat/');

    // Event listener for connection open
    socket.onopen = () => {
      console.log('WebSocket Connected');
      uploadImage(socket);
    };

    // Event listener for receiving messages
    socket.onmessage = (event) => {
      try {
        const dataObject = JSON.parse(event.data);
        if (dataObject.message) {
          setIsLoading(false);
          messageBuffer.current += dataObject.message;
        }
      } catch (error) {
        console.log('Unable to parse response', event.data);
      }
    };

    // Event listener for connection errors
    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Event listener for connection close
    socket.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    // Save the WebSocket instance
    setWs(socket);

    // Cleanup on component unmount
    return () => {
      socket.close();
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (messageBuffer.current) {
        speak(messageBuffer.current);
        setMessage((prevMessage) => prevMessage + messageBuffer.current);
        messageBuffer.current = ''; // Clear buffer after appending
      }
    }, 50);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const speak = (message: string) => {
    setIsSpeechEnded(false);
    Speech.speak(message, {
      onPause() {
        setIsSpeachRunning(false);
      },
      onResume() {
        setIsSpeachRunning(true);
      },
      onStart() {
        setIsSpeachRunning(true);
      },
      onDone() {
        setIsSpeachRunning(false);
        setIsSpeechEnded(true);
      }
    });
  }

  const handleToggleSpeach = () => {
    if (isSpeachRunning) {
      Speech.pause();
      setIsSpeachRunning(false);
    } else if (isSpeechEnded) {
      speak(message);
      setIsSpeachRunning(true);
    } else {
      Speech.resume();
      setIsSpeachRunning(true);
    }
  }

  const handleReload = () => {
    uploadImage(ws);
  };

  const handleStartOver = () => {
    Speech.stop();
    navigation.replace('Home');
  }

  return (
    <View style={styles.container}>
      {/* Image Block */}
      <View style={styles.imageBlock}>
        <Image
          source={{ uri: selectedImage }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Scrollable Text Block */}
      <ScrollView style={styles.textBlock}>
        {isLoading ? (
          <ActivityIndicator size={'large'} />
        ) : (<Text style={styles.text}>
          {message}
        </Text>)}
      </ScrollView>

      {/* Buttons Block */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonContainerInner}>
          <TouchableOpacity style={styles.button} disabled={isLoading} onPress={() => handleReload()}>
            <Ionicons name="reload" size={24} color="#007BFF" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} disabled={isLoading} onPress={() => handleToggleSpeach()}>
            {isSpeachRunning ? <Ionicons name="pause" size={20} color="#007BFF" style={styles.icon} />
            : <Ionicons name="play" size={20} color="#007BFF" style={styles.icon} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleStartOver()}>
            <Ionicons name="return-up-back" size={24} color="#007BFF" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageBlock: {
    flex: 0.4, // 30% of the screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0', // Light gray background for visibility
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    flex: 0.45, // 50% of the screen
    padding: 20,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    paddingBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    flex: 0.15, // 20% of the screen
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonContainerInner: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(160, 160, 160, 0.8)',  // Transparent black background
  },
  icon: {
    padding: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50, // Fully rounded edges
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Transparent background
  },
});