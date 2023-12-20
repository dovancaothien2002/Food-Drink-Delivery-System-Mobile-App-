import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import COLORS from './consts/colors';
import DetailsScreen from './views/screens/DetailsScreen';
import BottomNavigator from './views/navigation/BottomNavigator';
import OnBoardScreen from './views/screens/OnBoardScreen';
import RegisterScreen from './views/screens/RegisterScreen';
import LoginScreen from './views/screens/LoginScreen';
import UserProvider from './views/context/UserProvider';
import CartProvider from './views/context/CartProvider';
import CheckOutScreen from './views/screens/CheckOutScreen';
import ChooseAddressScreen from './views/screens/ChooseAddressScreen';
import UserAddressScreen from './views/screens/ShippingAddressScreen';
import ShippingAddressScreen from './views/screens/ShippingAddressScreen';
import ShippingStoreScreen from './views/screens/ShippingStoreScreen';
import FindStoreScreen from './views/screens/FindStoreScreen';
import DeliveryAddressScreen from './views/screens/DeliveryAddressScreen';
import UpdateSavedAddressScreen from './views/screens/UpdateSavedAddressScreen copy';
import UpdateShippingStoreScreen from './views/screens/UpdateShippingStoreScreen';
import FavouritesProvider from './views/context/FavouritesProvider';
import OrderSceen from './views/screens/OrderScreen';
import OrderDetailScreen from './views/screens/OrderDetailScreen';
import FavouritesScreen from './views/screens/FavouritesScreen';
import UpdateUserSceen from './views/screens/UpdateUser';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <UserProvider>
        <CartProvider>
          <FavouritesProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="BoardScreen" component={OnBoardScreen} />
              <Stack.Screen name="CheckOut" component={CheckOutScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Home" component={BottomNavigator} />
              <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
              <Stack.Screen name="ChooseAddress" component={ChooseAddressScreen} />
              <Stack.Screen name="ShippingAddress" component={ShippingAddressScreen} />
              <Stack.Screen name="ShippingStore" component={ShippingStoreScreen} />
              <Stack.Screen name="FindStore" component={FindStoreScreen} />
              <Stack.Screen name="DeliveryAddress" component={DeliveryAddressScreen} />
              <Stack.Screen name="UpdateSavedAddress" component={UpdateSavedAddressScreen} />
              <Stack.Screen name="UpdateShippingStore" component={UpdateShippingStoreScreen} />
              <Stack.Screen name="OrderScreen" component={OrderSceen} />
              <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
              <Stack.Screen name="Favourites" component={FavouritesScreen} />
              <Stack.Screen name="UpdateUser" component={UpdateUserSceen} />
            </Stack.Navigator>
          </FavouritesProvider>
        </CartProvider>
      </UserProvider>
    </NavigationContainer>
  );
};

export default App;
