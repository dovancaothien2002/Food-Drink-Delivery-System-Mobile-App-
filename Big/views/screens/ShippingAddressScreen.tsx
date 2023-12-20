import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, View, Text } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/UserProvider";
import axios from "axios";
import IconC from 'react-native-vector-icons/Ionicons';
import CheckBox from 'react-native-check-box';
const ShippingAddressScreen = ({ navigation,route }:any) => {
    const shippingAddress = route.params;
    const [note, setNote] = useState(shippingAddress.note);
    const [detailaddress, setDetailAddress] = useState(shippingAddress.detailaddress);
    const [isChecked,setisChecked] = useState(false);

    const ShipAddress = {
        usefor:shippingAddress.usefor,
        note:note,
        detailaddress:detailaddress,
        formattedAddress:shippingAddress.formattedAddress,
        position:shippingAddress.position
    }

    const submit = async () => {
        let formData = {
            usefor:shippingAddress.usefor,
            status:isChecked,
            useraddress: shippingAddress.formattedAddress,
            note: note,
            detailaddress:detailaddress,
            lat: shippingAddress.position.lat,
            lng: shippingAddress.position.lng
        }
        navigation.navigate('ShippingStore',formData);
    }

    useEffect(() => {
        
    }, [])
    
    return (

        <>
            <SafeAreaView>
                <View style={style.header}>
                    <View style={{width:'10%'}}>
                    <IconC name="arrow-back-outline" size={28} onPress={()=> navigation.goBack()} /> 
                    </View> 
                    <View style={{width:'80%'}}>
                    {shippingAddress.usefor == 1 ?
                        <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Shipping address</Text>
                    :
                        <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Set your address</Text>
                    }
                    </View> 
                </View>
                <View style={{
                    paddingHorizontal: 20,

                }}>
                    
                    <View style={{
                        marginBottom: 15
                    }}>
                        <TextInput placeholder="Home/Work/Gym ..." defaultValue={shippingAddress.detailaddress} style={{ fontSize: 14, padding: 20, borderRadius: 10, marginVertical: 10, borderWidth: 1 }} onChangeText={(text) => setDetailAddress(text)} />
                        <TouchableOpacity onPress={() => navigation.navigate('FindStore',ShipAddress)}>
                            <TextInput placeholder="Address Name" defaultValue={shippingAddress.formattedAddress} style={{ fontSize: 14, padding: 20, borderRadius: 10, marginVertical: 10, borderWidth: 1,color:'black' }} editable={false} />
                        </TouchableOpacity>
                        <TextInput placeholder="Please enter" defaultValue={shippingAddress.note} style={{ fontSize: 14, padding: 20, borderRadius: 10, marginVertical: 10, borderWidth: 1 }} onChangeText={(text) => setNote(text)} />
                        {shippingAddress.usefor == 1 ?
                            <></>
                           :
                           <CheckBox style={{marginTop:10}} onClick={()=>{ setisChecked(!isChecked)}} isChecked={isChecked} rightTextStyle={{fontWeight:'bold',fontSize:18}} rightText={"Set this as an default"} checkedCheckBoxColor="#F9813A"/>
                        }    
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
                        }}>Choose Store</Text>
                    </TouchableOpacity>
                   
                </View>
            </SafeAreaView>
        </>
    );

};
const style = StyleSheet.create({
    header: {
      paddingVertical:20,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
    }
  });
export default ShippingAddressScreen;