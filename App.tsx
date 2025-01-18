import { Button, StyleSheet, Text, View } from "react-native";
import MainScreen from "./src/screens/Main";

export default function App() {

  
  // const renderPicture = () => {
  //   return (
  //     <View>
  //       <Image
  //         source={{ uri }}
  //         contentFit="contain"
  //         style={{ width: 300, aspectRatio: 1 }}
  //       />
  //       <Button onPress={() => setUri(null)} title="Take another picture" />
  //     </View>
  //   );
  // };

  return (
    <MainScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});
