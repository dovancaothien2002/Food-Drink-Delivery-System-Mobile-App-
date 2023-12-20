import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text, Button, PermissionsAndroid, Alert, TextInput, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {url} from '../screens/Api';
// @ts-ignore
import Geocoder from 'react-native-geocoder';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconB from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as geolib from 'geolib';
import { useUser } from '../context/UserProvider';
import axios from 'axios';
import { useCart } from '../context/CartProvider';
const ChooseAddressScreen = ({ navigation }:any) => {
const [location, setLocation] = useState(false);
const [selectedAddress, setSelectedAddress] = useState({});
const [locationb, setLocationb] = useState();
const { user, setUser, getUser }: any = useUser();
const [savedaddress, setSavedaddress] = useState([]);
const { carts, setCart, getCart, delCart }: any = useCart();
const ShipAddress = {
  usefor:1,
  note:'',
  detailaddress:'',
  formattedAddress:''
}
// Function to get permission for location
  const requestLocationPermission = async () => {
   try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      //console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const getAddressFromCoordinates  = async(latitude: any, longitude: any) => {
    var NY = {
      lat: latitude,
      lng: longitude
    };
    try {
      const res = await Geocoder.geocodePosition(NY);
      console.log(res[0].formattedAddress);
      return res[0]
    }
    catch(err) {
        console.log(err);
        return null;
    }
  }

  const getAddressFromCoordinates2  = async(address:any) => {
    try {
      const res = await Geocoder.geocodeAddress(address);
      console.log(res);
        if(res.length > 0){
          //console.log("Address : " + res[0].formattedAddress + "  " + res[0].position.lat + " ---- " + res[0].position.lng);
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

  // function to check permissions and get Location
  const getLocation = () => {
    //getDistance();
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          async position => {
            console.log(position);
            setLocation(position);
            let result = await getAddressFromCoordinates(position.coords.latitude,position.coords.longitude);
            result.note = '';
            result.detailaddress = '';
            result.usefor = 1;
            if(result != null){
              await navigation.navigate('ShippingAddress',result);
            }else{
              Alert.alert('Khong the xac dinh vi tri cua ban !')
            }
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
   
  };
  
  const getListSaveAddress = async () => {
    try {
      const res = await fetch(url+'/saveaddress-by-user-id/'+ user.id)
      const data = await res.json();
      //console.log(data.savedaddress);
      setSavedaddress(data.savedaddress);
    } catch (error) {
      console.log(error)
    }
    
  }

  const changeSavedAddress = async (id : any) => {
    let data = {
      sa_id : id,
      user_id : user.id
    }
    // Alert.alert(data.sa_id + "==" + data.user_id)
    await axios.put(url+'/update-savedaddress/', data).then((respone) => {
      if (respone.data.statusCode === 200) {
       
      } else {
        
      }
    }).catch((err) =>
      console.log(err)
    )
    await axios.put(url+'/update-savedaddress2/', data).then((respone) => {
      if (respone.data.statusCode === 200) {
        
      } else {
        
      }
    }).catch((err) =>
      console.log(err)
    )
    getListSaveAddress();
  }

  const ListSaveAddress = () => {
    if(savedaddress.length > 0){
      return savedaddress.map((item : any,index) => (
        item.status == 1 ?
        <TouchableOpacity key={index}>
           <View style={{paddingVertical:10, width: '100%',flexDirection:'row',justifyContent:'space-between'}}>
             <View style={{width:"12%",paddingTop:20}}>
               <IconB name="flag" style={{fontSize:30,color:'#F9813A'}}></IconB>
             </View>
             <View style={{width:"88%",justifyContent:'center'}} >
               <Text style={{fontSize:16,marginBottom:10}}>{item.useraddress}</Text>
               <Text style={{fontSize:16,color:'white',fontWeight:'bold',backgroundColor:'#F9813A',borderRadius:5,padding:5}} >Store : {item.store_name}</Text>
             </View>
           </View>
        </TouchableOpacity>
       :
       <TouchableOpacity key={index} onPress={() => changeSavedAddress(item.id)}>
         <View style={{paddingVertical:10, width: '100%',flexDirection:'row',justifyContent:'space-between'}}>
           <View style={{width:"12%",paddingTop:20}} >
             <IconB name="flag-outline" style={{fontSize:30,color:'#F9813A'}}></IconB>
           </View>
           <View style={{width:"88%",justifyContent:'center'}} >
             <Text style={{fontSize:16,marginBottom:10}} >{item.useraddress}</Text>
             <Text style={{fontSize:16,color:'white',fontWeight:'bold',backgroundColor:'#F9813A',borderRadius:5,padding:5}} >Store : {item.store_name}</Text>
           </View>
         </View>
       </TouchableOpacity>
      ))
    }  
  }

  const next = async () => {
    const findState= savedaddress.find(function(item : any) {  
      return item.status == 1 
    });  
    if(findState!=undefined){
      let store_address : any = await getAddressFromCoordinates2(findState.store_address);
      let user_address : any = await getAddressFromCoordinates2(findState.useraddress);
      let distance = await getDistance(store_address.position.lat,store_address.position.lng,user_address.position.lat,user_address.position.lng);
      //console.log(distance);
      //findState.distance = (distance / 1000).toFixed(2);

      let formData = {
        useraddress: findState.useraddress,
        note: findState.note,
        detailaddress:findState.detailaddress,
        store_id:findState.store_id,
        store_name:findState.store_name,
        distance:(distance / 1000).toFixed(2),
        shippingFee:0
      }

      let totalPrice = carts.reduce((total, item) => total + item.amount * item.price, 0);
      if (parseFloat(totalPrice) > 300000){
        formData.shippingFee = 0;
      }else{
        formData.shippingFee = parseFloat((distance / 1000).toFixed(2)) * 1000;
      }
      
      navigation.navigate('CheckOut',formData);

    }else{
      Alert.alert('Please select delivery address');
    }
    
  }
   
  const getDistance = async (lat1: any,lng1: any,lat2: any,lng2: any) => {
    let distance = await geolib.getPreciseDistance({ latitude: lat1, longitude: lng1 },
        { latitude: lat2, longitude: lng2})
    //console.log(distance + " meters " + lat2 + " == " + lng2);
    return distance;
    }

  const NextView = () => {
    if(savedaddress.length > 0){
      return (<TouchableOpacity style={{
        paddingVertical: 20,
        paddingHorizontal:120,
        backgroundColor: '#F9813A',
        marginVertical: 30,
        borderRadius: 40,
        shadowColor: 'blue',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.3,
        shadowRadius: 10
    }} onPress={() => next()}>
        <Text style={{
            textAlign: 'center',
            fontSize: 18,
            color: 'white',
            fontWeight:'bold'
        }}>Next</Text>
    </TouchableOpacity>)
    }else{
      return(
        <View></View>
      )
    }
  }

  useEffect(()=>{
   getListSaveAddress();
  },[]);

  useFocusEffect(
    useCallback(() => {
      getListSaveAddress();
    }, [])
  );

  return (
    <SafeAreaView style={{backgroundColor:'white',flex: 1}}>
    <ScrollView>
      <View style={styles.header}>
        <View style={{width:'10%'}}>
          <IconB name="arrow-back-outline" size={28} onPress={navigation.goBack} /> 
        </View> 
        <View style={{width:'80%'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Choose address</Text>
        </View> 
      </View>
     
    <View style={styles.container}>
      <View style={{paddingHorizontal:10,width:"100%"}}>
          <TouchableOpacity onPress={() => navigation.navigate('FindStore',ShipAddress)}>
            <View >
              <TextInput style={styles.forminput} placeholder="Please enter address" placeholderTextColor={'black'} editable={false}></TextInput>
              <Icon name="map-marker-alt" style={styles.icon} ></Icon>
            </View>
          </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={getLocation} style={{marginTop:15}}> 
        <View style={{paddingHorizontal:20,paddingVertical:10, width: '100%',flexDirection:'row',justifyContent:'space-between',borderTopWidth:1,borderBottomWidth:1,borderColor:'#F9813A'}}>
            <View style={{width:"12%"}}>
              <Icon name="crosshairs" style={{fontSize:30,color:'#F9813A'}}></Icon>
            </View>
            <View style={{width:"88%",justifyContent:'center'}}>
              <Text style={{fontWeight:'bold',fontSize:16}}>Use my current location</Text>
            </View>
        </View>
      </TouchableOpacity>
      <View style={{padding:10,marginTop:15,borderTopWidth:1,borderBottomWidth:1,borderColor:'#F9813A',width:'100%'}}>
        <Text style={{fontWeight:'bold',fontSize:16,textAlign:'center'}}>Saved Address</Text>
        <View style={{width:'100%'}}>
          <ListSaveAddress/>
        </View>
        <TouchableOpacity onPress={()=> navigation.navigate('DeliveryAddress')} style={{marginTop:15}}> 
          <View style={{width: '100%',flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{width:"12%",justifyContent:'center',paddingLeft:3}}>
                <Icon name="plus" style={{fontSize:30,color:'#F9813A'}}></Icon>
              </View>
              <View style={{width:"88%",justifyContent:'center'}}>
                <Text style={{fontWeight:'bold',fontSize:16}}>Add a new address</Text>
                <Text style={{fontSize:16}}>Save as a familiar address</Text>
              </View>
          </View>
      </TouchableOpacity>
      </View>
      
      {/* <Text>Latitude: {location ? location.coords.latitude : null}</Text>
      <Text>Longitude: {location ? location.coords.longitude : null}</Text>
      <Text>Address: {address}</Text> */}
      <View style={{justifyContent:'center'}}>
          <NextView/>
      </View>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    //justifyContent: 'center',
    //
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
 
  forminput:{
     
      //paddingBottom:0,
      color:'black',
      paddingLeft:55,
      backgroundColor:'#fedac5',
      borderRadius:10,
      
  },
  icon:{
      position:'absolute',
      fontSize:25,
      top:12,
      zIndex:1000,
      left:15,
      color:'#F9813A'
  },
});
export default ChooseAddressScreen;