import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Updates from 'expo-updates';

// Screens
import Player from './src/Player';
import Home from './src/Home';
import ChannelOptions from './src/channelsOptions';
import Favorites from './src/Favorites';
import Configs from './src/Configs';

const Stack = createStackNavigator();

export default function App() {

   useEffect(()=>{
      (async ()=>{
         let hasNewVersion = await Updates.checkForUpdateAsync();
         if(hasNewVersion) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
         }
      })()
   },[])

   return (
      <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen name="Home" options={{headerShown: false}} component={Home}/>
            <Stack.Screen name="ChannelOptions" options={{headerShown: false}} component={ChannelOptions}/>
            <Stack.Screen name="Player" options={{headerShown: false}} component={Player}/>
            <Stack.Screen name="Favoritos" component={Favorites}/>
            <Stack.Screen name="Configurações" component={Configs}/>
         </Stack.Navigator>
      </NavigationContainer>
   )
};