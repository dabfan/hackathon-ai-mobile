import { useEffect, useRef, useState } from "react";
import { Pressable, View, StyleSheet, Text, Button } from "react-native";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from "react-redux";
import Library from "../components/Library";
import { saveImageMetaData, saveSelectedImage } from '../store/reducers/app';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';

export default function Camera({navigation}) {
  const [permission, requestPermission] = useCameraPermissions();

  const [hasLocationAllowed, setHasLocationAllowed] = useState(false);
  const ref = useRef<CameraView>(null);
  const dispatch = useDispatch();
  
  const [facing, setFacing] = useState<CameraType>("back");

  useEffect(() => {
    async function checkLocationPermission() {
      // console.log(await ref.getAvailablePictureSizesAsync());
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationAllowed(true);
      }
    }

    checkLocationPermission();
  }, []);

  const resizePhoto = async (uri) => {
    try {
      // const imageManipulator = useImageManipulator(uri);

      // imageManipulator.resize({ width: 800 });
      // const rendeered = await imageManipulator.renderAsync();
      // return rendeered.saveAsync({
      //   compress: 0.8,
      //   format: ImageManipulator.SaveFormat.JPEG
      // });
      const resized = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 600 } }], // Resize to a width of 600 pixels, keeping the aspect ratio
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log('Resized photo:', resized);
      return resized;
    } catch (error) {
      console.error("Error resizing photo:", error);
    }
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  
  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync({
      exif: true,
    });

    const extraInfo = photo?.exif || {};
    if (hasLocationAllowed) {
      try {
        let location = await Location.getCurrentPositionAsync({});
        extraInfo.GPSLatitude = location.coords.latitude;
        extraInfo.GPSLongitude = location.coords.longitude;
      } catch (error) {
        console.log('Could not get coords', error);
      }
    }

    const resizedPhoto = await resizePhoto(photo?.uri);

    dispatch(saveImageMetaData(extraInfo));
    dispatch(saveSelectedImage(resizedPhoto.uri));
    navigation.navigate('Details');
  };
  
  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };
  

  return (
    <CameraView
      style={styles.camera}
      ref={ref}
      mode="picture"
      facing={facing}
      mute={true}
      responsiveOrientationWhenOrientationLocked
      pictureSize={''}
    >
      <View style={styles.shutterContainer}>
        <View style={styles.buttonContainer}>
          <Library navigation={navigation} />
          <Pressable style={styles.cameraButton} onPress={takePicture}>
            {({ pressed }) => (
              <View style={[
                styles.innerCircle,
                {
                  opacity: pressed ? 0.5 : 1,
                },
              ]}>
                <Ionicons name="camera" size={20} color="black" />
              </View>
            )}
            
          </Pressable>
          <Pressable style={styles.button} onPress={toggleFacing}>
            <Ionicons name="camera-reverse" size={20} color="black" style={styles.icon} />
          </Pressable>
        </View>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Transparent black with 80% opacity
    padding: 10, // Optional: Add some padding for spacing inside the container
    borderRadius: 50, // Optional: Rounded corners for a smoother look
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50, // Fully rounded edges
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Transparent background
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff', // White border around the button
  },
  innerCircle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: 'white', // Inner circle color
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    padding: 10,
  },
});