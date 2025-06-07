import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import COLORS from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
export default function TabLayout() {
    const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "gold",
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: 10,
        },
        headerShown: false,
        tabBarBackground: () => (
          <LinearGradient
            colors={['#2c001e', '#4a274f', '#8c5e7a', '#b292ac']}
            start={[0, 0]}
            end={[1, 1]}
            style={{ flex: 1 }}
        />
        ),
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'index') iconName = 'home-outline';
          else if (route.name === 'create') iconName = 'add-circle-outline';
          else if (route.name === 'profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
        <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Post",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "You",
        }}
      />
    </Tabs>
  );
}
