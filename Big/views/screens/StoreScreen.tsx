import React, { useEffect, useRef, useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons';
//import CheckBox from '@react-native-community/checkbox';
import { Button,View,Image,Text, GestureResponderEvent, SafeAreaView, StyleSheet, Touchable, TouchableOpacity, TextInput, Alert, Dimensions, ScrollView } from "react-native";
import { useUser } from "../context/UserProvider";
import firestore from '@react-native-firebase/firestore';
import IconB from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView,{Marker, PROVIDER_GOOGLE} from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import {url} from '../screens/Api';
import IconC from 'react-native-vector-icons/Ionicons';
//import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// @ts-ignore
import Geocoder from 'react-native-geocoder';
import * as geolib from 'geolib';

const GGmap = ({navigation}:any)=>{
  //const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = Dimensions.get("window").width / 300;
  const LATITUDE_DELTA = 0.3;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const[destination,setDestination] = useState({latitude: 21.0277644,
    longitude: 105.8341598});

  const [stores, setStore] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [searchStore, setsearchStore] = useState('');
  
  const getStores = async () => {
    try {
      const res = await fetch(url+'/store')
      const data = await res.json();
     console.log(data.store);
      setStore(data.store)
    } catch (error) {
      console.log(error)
    }
  }
  
  const getAddressFromCoordinates  = async(address:any) => {
    try {
      const res = await Geocoder.geocodeAddress(address);
      console.log(res);
        if(res.length > 0){
          console.log("Address : " + res[0].formattedAddress + "  " + res[0].position.lat + " ---- " + res[0].position.lng);
          //setDestination({latitude: res[0].position.lat,longitude: res[0].position.lng});
          return await res[0].position;
        }else{
          return null
        }
      }
      catch(err) {
        console.log(err);
        return null
      }
  }

  const getDistance = async (lat1: any,lng1: any,lat2: any,lng2: any) => {
    let distance = await geolib.getPreciseDistance({ latitude: lat1, longitude: lng1 },
      { latitude: lat2, longitude: lng2})
    console.log(distance + " meters " + lat2 + " == " + lng2);
    return distance;
  }


  const searchStores = async () => {
    let listStore : any = [];
    let yourAddress = await getAddressFromCoordinates(searchStore);
    if(yourAddress != null){
      setDestination({latitude: yourAddress.lat,longitude: yourAddress.lng});
      await Promise.all(stores.map(async item => {
        let i : any = await getAddressFromCoordinates(item.fulladdress);
        let distance : any = await getDistance(i.lat,i.lng,yourAddress.lat,yourAddress.lng);
        if(parseInt(distance) < 5000){
          listStore.push({
              name: item.name,
              address: item.fulladdress,
              lat : i.lat,
              lng : i.lng,
              introduce : item.introduce,
              distance : (distance / 1000).toFixed(2)
          });
          console.log("Ok")
        }
      }));
      setMarkers(listStore);
    }else{
      Alert.alert("Unknown address name");
    }
  }

  const ShowMarker = () => {
    if(markers.length > 0){
      return markers.map((item : any,index) => (
        <Marker
          coordinate={{
            latitude: item.lat,
            longitude: item.lng
          }}
          key={index}
          title={item.name} 
        >
          <IconB name="store-marker" key={index} style={{color:'red',fontSize:35}}></IconB>
        </Marker>
        )
      )
    } 
  }

  const ListMaker = () => {
    if(markers.length > 0){
      markers.sort((a:any,b:any) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0))
      return markers.map((item : any,index) => (
        <View style={{paddingVertical:10,flexDirection:'row',justifyContent:'space-between'}} key={index}>
          <View style={{width:"12%",paddingTop:20}}>
            <IconB name="store-marker" style={{color:'red',fontSize:35}}></IconB>
          </View>
          <View style={{width:"88%",justifyContent:'center'}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>{item.name}</Text>
            <Text style={{fontSize:16}}>{item.address} ({item.distance} Km) </Text>
          </View>
        </View>
        )
      )
    }
    
  }

  useEffect(()=>{
    getStores();
    console.log("Dia Diem hien tai "+destination.latitude+" = "+destination.longitude);
  },[destination]);

  return (
    <SafeAreaView style={{backgroundColor:'white',flex: 1}}>
      <View style={styles.header}>
        <View style={{width:'10%'}}>
          <IconC name="arrow-back-outline" size={28} onPress={navigation.goBack} /> 
        </View> 
        <View style={{width:'80%'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Find Store</Text>
        </View> 
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.searchPosition}>
            <TextInput placeholder="Search" placeholderTextColor={'#999c9e'}  onChangeText={(value) => setsearchStore(value)} onEndEditing={() => searchStores()}></TextInput>
          </View>
          <MapView
            style={{width:Dimensions.get("window").width,height:300}}
            region={{
              latitude: destination.latitude,
              longitude: destination.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            provider={PROVIDER_GOOGLE}
          >
          <ShowMarker/>
          
          </MapView>
          <View style={{marginTop:20,width: '100%',paddingHorizontal:16}}>
            <ListMaker/>
          </View>
      </View>    
      </ScrollView>
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
      searchPosition :{
        //position:"absolute",
        width:"100%",
        backgroundColor:"white",
        padding:8,
        borderWidth:1,
        borderColor:'#F9813A'
       // top:30
      }, 
      searchPositionB :{
        position:"absolute",
        width:"90%",
        backgroundColor:"white",
        padding:8,
        borderRadius:8,
        top:100
      }, 
      input:{
        borderColor:"#888",
        borderWidth:1
      }
    });
export default GGmap;


