//import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
/* import { Video } from "expo-av";
import { useFonts } from 'expo-font'; */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Player from './src/Player';
import Home from './src/Home';
import ChannelOptions from './src/channelsOptions';

const Stack = createStackNavigator();

export default function App() {
   return (
      <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen name="Home" options={{headerShown: false}} component={Home}/>
            <Stack.Screen name="ChannelOptions" options={{headerShown: false}} component={ChannelOptions}/>
            <Stack.Screen name="Player" options={{headerShown: false}} component={Player}/>
         </Stack.Navigator>
      </NavigationContainer>
   )
};