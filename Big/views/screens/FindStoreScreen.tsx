import React, { useEffect, useRef, useState } from "react";
//import CheckBox from '@react-native-community/checkbox';
import { Button,View,Image,Text, GestureResponderEvent, SafeAreaView, StyleSheet, Touchable, TouchableOpacity, TextInput, Alert, Dimensions, ScrollView } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import {url} from '../screens/Api';
import IconC from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
//import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// @ts-ignore
import Geocoder from 'react-native-geocoder';
import * as geolib from 'geolib';

const FindStoreScreen = ({navigation,route}:any)=>{
  const shippingAddress = route.params;
  const [searchStore, setsearchStore] = useState(shippingAddress.formattedAddress);
  
  const getAddressFromCoordinates  = async(address:any) => {
    try {
      const res = await Geocoder.geocodeAddress(address);
      console.log(res);
        if(res.length > 0){
          console.log("Address : " + res[0].formattedAddress + "  " + res[0].position.lat + " ---- " + res[0].position.lng);
          //setDestination({latitude: res[0].position.lat,longitude: res[0].position.lng});
          return await res[0];
        }else{
          return null
        }
      }
      catch(err) {
        console.log(err);
        return null
      }
  }

  const searchStores = async () => {
    let yourAddress = await getAddressFromCoordinates(searchStore);
    if(yourAddress != null){
      shippingAddress.formattedAddress = yourAddress.formattedAddress;
      shippingAddress.position = yourAddress.position;
      console.log(shippingAddress);
      if(shippingAddress.usefor == 2){
        await navigation.navigate('UpdateSavedAddress',shippingAddress);
      }else{
        await navigation.navigate('ShippingAddress',shippingAddress);
      }
    }else{
      Alert.alert("Unknown address name");
    }
  }

  useEffect(()=>{
    
  },[]);

  return (
    <SafeAreaView style={{backgroundColor:'white',flex: 1}}>
      <View style={styles.header}>
        <View style={{width:'10%'}}>
          <IconC name="arrow-back-outline" size={28} onPress={() => navigation.goBack(shippingAddress)} /> 
        </View> 
        <View style={{width:'88%'}}>
            <TextInput style={styles.searchPositionB} placeholder="Please enter address" placeholderTextColor={'gray'} defaultValue={shippingAddress.formattedAddress} onChangeText={(value) => setsearchStore(value)} onEndEditing={() => searchStores()}></TextInput>
            <Icon name="map-marker-alt" style={styles.icon} ></Icon>
        </View> 
      </View>
      {/* <View>
        <Text>{searchStore}</Text>
      </View> */}
    </SafeAreaView>
    )

  }
    const styles = StyleSheet.create({
      container:{
        flex:1,
        backgroundColor:"#fff",
        alignItems:"center",
       // justifyContent:"center"
      },
      header: {
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
      },
      searchPositionB :{
        width:'100%',
        color:'black',
        paddingLeft:55,
        backgroundColor:'#fff',
        borderRadius:10,
        borderWidth:1
      }, 
      input:{
        borderColor:"#888",
        borderWidth:1
      },
      icon:{
          position:'absolute',
          fontSize:25,
          top:12,
          zIndex:1000,
          left:15,
          color:'#F9813A'
      }
    });
export default FindStoreScreen;


