import { Provider } from 'react-redux';
import * as ScreenOrientation from 'expo-screen-orientation';
import store from './src/store';
import AppNavigation from "./src/navigation";

export default function App() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}
