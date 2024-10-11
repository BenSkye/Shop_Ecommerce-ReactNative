// AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeSreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import DetailScreen from '../screens/DetailsScreen';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList, RootStackParamList } from '../types/types';

const Tab = createBottomTabNavigator<RootTabParamList>(); // Sử dụng RootTabParamList
const Stack = createNativeStackNavigator<RootStackParamList>(); // Sử dụng RootStackParamList

const TabNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                ),
            }}
        />
        <Tab.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="heart" color={color} size={size} />
                ),
            }}
        />
    </Tab.Navigator>
);

const AppNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
);

export default AppNavigator;
