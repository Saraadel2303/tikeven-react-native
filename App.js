import { NavigationContainer } from '@react-navigation/native';
import AppRouter from './src/navigation/AppRouter';

export default function App() {
  return (
    <NavigationContainer>
      <AppRouter />
    </NavigationContainer>
  );
}
