import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import axist from 'axios'

import { Restaurant, Delivery } from './screens';
import Tabs from './navigation/tabs'
import axios from 'axios';

const Stack = createStackNavigator()
axios.defaults.baseURL = 'https://5e1a933531118200148f20b2.mockapi.io'

let customFonts = {
  'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
  'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
  'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true)
    }
    
    loadFont()
  }, [])

  return (
    <>
      {
        fontsLoaded ? (
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false
              }}
              initialRouteName={'Home'}
            >
              <Stack.Screen name='Home' component={Tabs} />
              <Stack.Screen name='Delivery' component={Delivery} />
              <Stack.Screen name='Restaurant' component={Restaurant} />
            </Stack.Navigator>
          </NavigationContainer>
        ) : (
          <AppLoading />
        )
      }
    </>
  )
}

export default App
