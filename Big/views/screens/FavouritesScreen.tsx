import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import COLORS from '../../consts/colors';
import foods from '../../consts/foods';
import { PrimaryButton } from '../components/Button';
import { useUser } from '../context/UserProvider';
import { useCart } from '../context/CartProvider';
import axios from 'axios';
import { useFav } from '../context/FavouritesProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {url} from '../screens/Api';
import IconB from 'react-native-vector-icons/Ionicons';
const FavouritesScreen = ({ navigation }:any) => {


    const { user, setUser, getUser }: any = useUser();
    const { carts, setCart, getCart, delCart }: any = useCart();
    const { favs, setFav, getFav }: any = useFav();

    const getListFavourites = async () => {
        try {
            if (user.id != undefined) {
                // console.log(user.id);

                const res = await fetch(url+'/favourites/' + user.id)
                const data = await res.json();
                setFav(data.product);
                AsyncStorage.setItem('Favs', JSON.stringify(data.product))
            }
        } catch (error) {
            console.log(error)
        }
    }
    const removeFav = (item: { id: any }) => {
        let data = {
            user_id: user.id,
            product_id: item.id
        }
        axios.post(url+'/favourites/', data).
            then((respone) => {
                // alert(JSON.stringify(respone));
                if (respone.data.statusCode === 200) {
                    Alert.alert(respone.data.message);
                    getListFavourites();

                } else {
                }
            }
            )
            .catch((err) =>
                console.log(err)
            )
    }

    const addToCartBtn = (item: { id: any; sale_price: any; price: any; }) => {
        // Update cart item quantity if already in cart
        if (carts.some((cartItem: { id: any; }) => cartItem.id === item.id)) {
            setCart((cart: any[]) =>
                cart.map((cartItem: { id: any; amount: number; sale_price: any; price: any; }) =>


                    cartItem.id === item.id
                        ? {
                            ...cartItem,
                            amount: cartItem.amount + 1,
                            price: cartItem.sale_price ? cartItem.sale_price : cartItem.price
                        }
                        : {
                            ...cartItem,
                            price: cartItem.sale_price ? cartItem.sale_price : cartItem.price
                        },
                    console.log(cart)
                )
            );
            Alert.alert('Add to cart successfully')
            return;
        }

        // Add to cart
        setCart((cart: any) => [
            ...cart,
            { ...item, amount: 1, price: item.sale_price ? item.sale_price : item.price }, // <-- initial amount 1


        ]);
        Alert.alert('Add to cart successfully')

    };

    useEffect(() => {


    }, [])

    const CartCard = ({ item }) => {
        return (
            <View style={style.cartCard}>
                <Image source={{
                    uri: item.image
                }} style={{ height: 80, width: 80 }} />
                <View
                    style={{
                        height: 100,
                        marginLeft: 10,
                        paddingVertical: 20,
                        flex: 1,
                    }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                    <Text style={{ display: 'none' }}>{item.id = item.product_id}</Text>
                    {item.sale_price > 0 ?
                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}> {item.pricee = item.sale_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })} </Text>
                        :
                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}> {item.pricee = item.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })} </Text>
                    }
                </View>
                <View style={{ marginRight: 20, alignItems: 'center' }}>
                    <View style={style.actionBtn}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => addToCartBtn(item)}>
                            {<Icon name="add-outline" size={26} color={COLORS.white} />}
                        </TouchableOpacity>

                    </View>

                </View>
                <View style={style.actionBtn}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => removeFav(item)}>
                        {<Icon name="heart-dislike-outline" size={26}  color={COLORS.white} />}
                    </TouchableOpacity></View>
            </View>
        );
    };
    return (
        <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
            <View style={style.header}>
                <View style={{width:'10%'}}>
                <IconB name="arrow-back-outline" size={28} onPress={navigation.goBack} /> 
                </View> 
                <View style={{width:'80%'}}>
                <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Favourites</Text>
                </View> 
            </View>
            {user.name != undefined ?
                favs != null ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        data={favs}
                        renderItem={({ item }) => <CartCard item={item} />}
                        ListFooterComponentStyle={{ paddingHorizontal: 20, marginTop: 20 }}
                        ListFooterComponent={() => (
                            <View>
                            </View>
                        )}

                    /> :
                    <View>
                        <View style={{ marginHorizontal: 30 }}>
                            <PrimaryButton onPress={() => navigation.navigate('home')} title="Continue Shopping " />
                        </View>
                    </View>



                :
                <View>
                    {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 15,
            }}>
          </View> */}
                    <View style={{ marginHorizontal: 30 }}>
                        <PrimaryButton onPress={() => navigation.navigate('Login')} title="SIGN IN !!!" />
                    </View>
                </View>
            }
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
    cartCard: {
        height: 130,
        elevation: 15,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        marginVertical: 10,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        width: 40,
        height: 30,
        backgroundColor: COLORS.primary,
        borderRadius: 15,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
    },
});

export default FavouritesScreen;