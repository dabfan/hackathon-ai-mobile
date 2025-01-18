import { View, StyleSheet, Text } from "react-native";

export default function MainScreen() {

  
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
    <View style={styles.container}>
      <Text>
        Test
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});