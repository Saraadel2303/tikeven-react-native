import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Login from "../screens/Login";
import Splash from "../screens/Splash";
import Events from "../screens/Events";
import QRScanner from "../screens/QRScanner";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Events"
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Events") {
            iconName = focused ? "calendar" : "calendar-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Scan (QR)") {
            iconName = focused ? "qr-code" : "qr-code-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Events" component={Events} />
      <Tab.Screen
        name="Scan (QR)"
        component={QRScanner}
        options={{ headerTitle: "Scan (QR)", tabBarLabel: "Scan (QR)" }}
      />
    </Tab.Navigator>
  );
}

export default function AppRouter() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
