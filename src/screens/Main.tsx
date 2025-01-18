import { View, StyleSheet, Image } from "react-native";
import Camera from "../components/Camera";

export default function MainScreen({navigation}) {
  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../assets/mag-brug.jpeg')} // Replace with your image URL
        style={styles.backgroundImage}
        resizeMode="cover" // Ensures the image covers the entire screen
      /> */}
      <Camera navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  backgroundImage: {
    position: 'absolute', // Position the image behind other components
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});