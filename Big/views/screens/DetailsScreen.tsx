import React from 'react';
import {SafeAreaView, StyleSheet, View, Text, Image,ScrollView, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../consts/colors';
import {SecondaryButton} from '../components/Button';
import { useUser } from '../context/UserProvider';
import { useCart } from '../context/CartProvider';

const DetailsScreen = ({navigation, route}:any) => {
  // const {user,setUser,getUser }:any = useUser();
  const { carts, setCart, getCart }: any = useCart();

  const addToCartBtn = (item) => {
    // Update cart item quantity if already in cart
    // console.log(item)
    if (carts.some((cartItem) => cartItem.id === item.id)) {
      setCart((cart) =>
        cart.map((cartItem) =>
          // console.log(cartItem),
          cartItem.id === item.id
            ? {
              ...cartItem,
              amount: cartItem.amount + 1,
            }
            : cartItem
        )
      );
      Alert.alert('Add to cart successfully')

      return;
    }

    // Add to cart
    setCart((cart) => [
      ...cart,
      { ...item, amount: 1 } // <-- initial amount 1
    ]);
    Alert.alert('Add to cart successfully')

  };
  const item = route.params;

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white}}>
      <View style={style.header}>
        <View style={{width:'10%'}}>
          <Icon name="arrow-back-outline" size={28} onPress={navigation.goBack} /> 
        </View> 
        <View style={{width:'80%'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Detail</Text>
        </View> 
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 320,
          }}>
          {/* <Image source={item.image} style={{height: 220, width: 220}} /> */}
          <Image
             style={{ height: 250, width:'80%' ,borderRadius: 5 }}
              source={{
                uri: item.image
              }}
            />
        </View>
        <View style={style.details}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 25, fontWeight: 'bold', color: COLORS.white}}>
              {item.name}
            </Text>
            {/* <View style={style.iconContainer}>
              { <Icon name="star-outline" color={COLORS.primary} size={25} /> }
            </View> */}
          </View>
          <Text style={style.detailsText}>
            {item.description}
          </Text>
          <View style={{marginTop: 40, marginBottom: 40}}>
            <SecondaryButton title="Add To Cart" onPress={() => addToCartBtn(item)} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  details: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  iconContainer: {
    backgroundColor: COLORS.white,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  detailsText: {
    marginTop: 10,
    lineHeight: 22,
    fontSize: 16,
    color: COLORS.white,
  },
});

export default DetailsScreen;
