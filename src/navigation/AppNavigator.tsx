import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import MainTabs from '../screens/MainTabs';
import NextScreen from '../screens/NextScreen';
import ArSceneScreen from '../screens/ArSceneScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}} />
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{headerShown: false}} />
        <Stack.Screen name="Next" component={NextScreen} options={{title: 'Next Screen'}} />
        <Stack.Screen name="AR" component={ArSceneScreen} options={{title: 'AR'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

