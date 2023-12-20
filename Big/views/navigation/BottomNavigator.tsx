import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../consts/colors';
import { View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import AccountScreen from '../screens/AccountScreen';
import StoreScreen from '../screens/StoreScreen';
import RestaurantScreen from '../screens/RestaurantScreen';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Restaurant') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'reorder-four' : 'reorder-four-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} ></Icon>;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false 
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="Restaurant" component={RestaurantScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
      <Tab.Screen name="More" component={StoreScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
