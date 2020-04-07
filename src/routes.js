import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';

import Feed from './pages/Feed';

import logo from './assets/instagram.png';

const Stack = createStackNavigator();

export default function Routes() {
     return (
          <NavigationContainer>
               <Stack.Navigator screenOptions={{
                    headerTitle: <Image source={logo} />,
                    headerTitleAlign: 'center',
                    headerStyle: {
                         backgroundColor: '#f5f5f5'
                    }
               }}>
                    <Stack.Screen name="Feed" component={Feed} />
               </Stack.Navigator>
          </NavigationContainer>
     )
}