import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, View, Text } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/UserProvider";
import axios from "axios";
import IconB from 'react-native-vector-icons/Ionicons';
import {url} from '../screens/Api';
import { RadioGroup } from "react-native-radio-buttons-group";
import IconC from 'react-native-vector-icons/Ionicons';
// @ts-ignore
import Geocoder from 'react-native-geocoder';
import * as geolib from 'geolib';
import { ScrollView } from "react-native";

const UpdateShippingStoreScreen = ({ navigation,route }:any) => {
    const shippingStore = route.params;
    const [stores, setStore] = useState([]);
    const [markers, setMarkers] = useState([]);
    const { user, setUser, getUser }: any = useUser();
    const [selectedStore, setSelectedStore] = useState({});
    const submit = async () => {
        let formData = {
          id:shippingStore.sa_id,
          status : shippingStore.status,
          useraddress: shippingStore.useraddress,
          note: shippingStore.note,
          detailaddress:shippingStore.detailaddress,
          store_id:selectedStore.store_id,
          user_id:user.id
        }
        let data = {
          user_id : user.id
        }
        // console.log(formData);
        if(shippingStore.old_status == 0 && shippingStore.status == 1){
          console.log("Cap nhat thay moi mac dinh");
          await axios.put(url+'/update-savedaddress/', data).then((respone) => {
            if (respone.data.statusCode === 200) {
              navigation.navigate('DeliveryAddress');
            } else {
              
            }
          }).catch((err) =>
            console.log(err)
          );
          
          await axios.put(url+'/savedaddress/', formData).then((respone) => {
            if (respone.data.statusCode === 200) {
              navigation.navigate('DeliveryAddress');
            } else {
              
            }
          }).catch((err) =>
            console.log(err)
          );  
        }else{
          console.log("Cap nhat thuong");
          await axios.put(url+'/savedaddress/', formData).then((respone) => {
            if (respone.data.statusCode === 200) {
              navigation.navigate('DeliveryAddress');
            } else {
              
            }
          }).catch((err) =>
            console.log(err)
          );  
        }
      
    }
    
    const searchStores = async (stores:[]) => {
        let listStore : any = [];
          console.log(stores);
          await Promise.all(stores.map(async item => {
            let i : any = await getAddressFromCoordinates(item.fulladdress);
            let distance : any = await getDistance(i.lat,i.lng,shippingStore.lat,shippingStore.lng);
            if(parseInt(distance) < 5000){
              listStore.push({
                  store_id : item.id,
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
          //console.log(shippingStore);
          const findState= listStore.find(function(item : any) {  
            return item.store_id ==  shippingStore.store_id;
          });  
          if(findState==undefined){
            listStore.sort((a:any,b:any) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0))
            const first : any = listStore.at(0);
            setSelectedStore(first);
          }else{
            setSelectedStore(findState);
          }
         
    }

    const changeStore = (selectedStore : any) => {
     // Alert.alert(selectedStore.name + "==" + selectedStore.distance)
      setSelectedStore(selectedStore);
    }

    const ShowStore = () => {
      if(markers.length > 0){
        markers.sort((a:any,b:any) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0))
        const closest : any = markers.at(0);
        return (markers.map((item : any,index) => (
          item.store_id != selectedStore.store_id ? 
          //index > 0 ?
          <TouchableOpacity key={index} onPress={() => changeStore(item)}>
             <View style={{width: '100%',flexDirection:'row',justifyContent:'space-between'}}>
               <View style={{width:"10%",justifyContent:'center',alignItems:'flex-start'}}>
                 <IconB name="ellipse-outline" style={{fontSize:30,color:'#F9813A'}}></IconB>
               </View>
               <View style={{width:"75%",justifyContent:'center',paddingVertical:10}} >
               {index == 0 ? 
                <Text style={{fontSize:16,borderRadius:5,fontWeight:'bold'}} >Store : {item.name} - <Text style={{fontSize:16,color:'green'}}>Nearest</Text></Text>
                : 
                <Text style={{fontSize:16,borderRadius:5,fontWeight:'bold'}} >Store : {item.name}</Text>
                }
                <Text style={{fontSize:16}} >{item.address}</Text>
               </View>
               <View style={{width:"15%",justifyContent:'center',alignItems:'flex-end'}} >
                  <Text style={{fontSize:14,color:'#F9813A'}}>{item.distance} Km</Text>
               </View>
             </View>
          </TouchableOpacity>
          :
          <TouchableOpacity key={index} id={item.store_id}>
           <View style={{width: '100%',flexDirection:'row',justifyContent:'space-between'}}>
             <View style={{width:"10%",justifyContent:'center',alignItems:'flex-start'}} >
               <IconB name="checkmark-circle-outline" style={{fontSize:30,color:'#F9813A'}}></IconB>
             </View>
             <View style={{width:"75%",justifyContent:'center',paddingVertical:10}} >
                {index == 0 ? 
                <Text style={{fontSize:16,borderRadius:5,fontWeight:'bold'}} >Store : {item.name} - <Text style={{fontSize:16,color:'green'}}>Nearest</Text></Text>
                : 
                <Text style={{fontSize:16,borderRadius:5,fontWeight:'bold'}} >Store : {item.name}</Text>
                }
                <Text style={{fontSize:16}} >{item.address}</Text>
             </View>
             <View style={{width:"15%",justifyContent:'center',alignItems:'flex-end'}} >
                  <Text style={{fontSize:14,color:'#F9813A'}}>{item.distance} Km</Text>
              </View>
           </View>
          </TouchableOpacity>
      ))
      )  
      
    }  
    }

    const getAddressFromCoordinates  = async(address:any) => {
        try {
          const res = await Geocoder.geocodeAddress(address);
          //console.log(res);
            if(res.length > 0){
              console.log("Address : " + res[0].formattedAddress + "  " + res[0].position.lat + " --2-- " + res[0].position.lng);
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

    const getStores = async () => {
      try {
        const res = await fetch(url+'/store')
        const data = await res.json();
        //console.log(data.store);
        setStore(data.store)
        searchStores(data.store);
      } catch (error) {
        console.log(error)
      }
    }
    
    useEffect(()=>{
      getStores();
    },[]);
    return (

        <>
            <SafeAreaView>
              <ScrollView>
              <View style={style.header}>
                <View style={{width:'10%'}}>
                  <IconC name="arrow-back-outline" size={28} onPress={navigation.goBack} /> 
                </View> 
                <View style={{width:'80%'}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Update delivery store</Text>
                </View> 
              </View>
                <View style={{
                    paddingHorizontal: 15,

                }}>
                   
                    <View style={{paddingVertical:15,borderTopWidth:1,borderBottomWidth:1,borderColor:'#F9813A',width:'100%'}}>
                       <ShowStore/>
                    </View>
        
                    <TouchableOpacity style={{
                        padding: 20,
                        backgroundColor: '#F9813A',
                        marginVertical: 30,
                        borderRadius: 10,
                        shadowColor: 'blue',
                        shadowOffset: {
                            width: 0,
                            height: 10
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 10
                    }} onPress={() => submit()}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 20,
                            color: 'white',
                        }}>Complete</Text>
                    </TouchableOpacity>
                   
                </View>
              </ScrollView>
            </SafeAreaView>
        </>
    );

};
const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  }
});
export default UpdateShippingStoreScreen;