import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';
import Login from './screens/Login';
import Bookshelf from './screens/Bookshelf';
import AddBook from './screens/AddBook';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SignOut from './screens/SignOut';

const Stack = createNativeStackNavigator();

// const InsideStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function InsideLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Bookshelf') {
            iconName = 'book';
          } else if (route.name === 'Add Book') {
            iconName = 'add-circle';
          } else if (route.name === 'Sign Out') {
            iconName = 'log-out'
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'darkslategrey',
        tabBarInactiveTintColor: '#878c88',
        tabBarActiveBackgroundColor: '#eddfcf',
        tabBarInactiveBackgroundColor: '#eddfcf',
      })}
    >
      <Tab.Screen name="Bookshelf" component={Bookshelf} />
      <Tab.Screen name="Add Book" component={AddBook} />
      <Tab.Screen name="Sign Out" component={SignOut} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />

        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}