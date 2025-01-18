import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { saveImageMetaData, saveSelectedImage } from '../store/reducers/app';


export default function Library({navigation}) {
  const dispatch = useDispatch();


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      exif: true,
    });

    console.log(result);
    

    if (!result.canceled) {
      console.log(result.assets[0].exif);
      dispatch(saveImageMetaData(result.assets[0].exif));
      dispatch(saveSelectedImage(result.assets[0].uri));
      navigation.navigate('Details');
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={pickImage}>
      <Ionicons 
        name="images-outline" 
        size={20} 
        color="black" 
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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