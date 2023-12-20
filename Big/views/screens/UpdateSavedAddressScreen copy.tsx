import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, View, Text } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/UserProvider";
import axios from "axios";
import {url} from '../screens/Api';
import IconC from 'react-native-vector-icons/Ionicons';
import CheckBox from 'react-native-check-box';
const UpdateSavedAddressScreen = ({ navigation,route }:any) => {
    const shippingAddress = route.params;
    const [note, setNote] = useState(shippingAddress.note);
    const [detailaddress, setDetailAddress] = useState(shippingAddress.detailaddress);
    const [isChecked,setisChecked] = useState(shippingAddress.status);
    const [showBox, setShowBox] = useState(false);
    const ShipAddress = {
        sa_id:shippingAddress.sa_id,
        old_status:shippingAddress.status,
        store_id:shippingAddress.store_id,
        usefor:shippingAddress.usefor,
        note:note,
        status:shippingAddress.status,
        detailaddress:detailaddress,
        formattedAddress:shippingAddress.formattedAddress,
        position:shippingAddress.position
    }

    const submit = async () => {
        let formData = {
            sa_id:shippingAddress.sa_id,
            store_id:shippingAddress.store_id,
            old_status:shippingAddress.status,
            usefor:shippingAddress.usefor,
            status:isChecked,
            useraddress: shippingAddress.formattedAddress,
            note: note,
            detailaddress:detailaddress,
            lat: shippingAddress.position.lat,
            lng: shippingAddress.position.lng
        }
        //console.log(formData);
        navigation.navigate('UpdateShippingStore',formData);
    }
    const deletesa = async () => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to delete this delivery address?",
            [
                // The "Yes" button
                {
                text: "Yes",
                onPress: async () => {
                    await axios.delete(url+'/savedaddress/'+shippingAddress.sa_id).then((respone) => {
                        if (respone.data.statusCode === 200) {
                          Alert.alert("Delete delivery successfully")
                          navigation.navigate('DeliveryAddress');
                        } else {
                          
                        }
                      }).catch((err) =>
                        console.log(err)
                      );   
                },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                text: "No",
                },
            ]
        );
       
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
                        <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Update your address</Text>
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
                       
                           
                           <CheckBox style={{marginTop:10,marginBottom:40}} onClick={()=>{ setisChecked(!isChecked)}} isChecked={isChecked} rightTextStyle={{fontWeight:'bold',fontSize:18}} rightText={"Set this as an default"} checkedCheckBoxColor="#F9813A"/>
                          
                    </View>
                    <View style={{ flexDirection: 'row',alignItems: 'center',justifyContent:'space-between'}}>
                    <TouchableOpacity style={{
                        width:'45%',
                        padding: 20,
                        borderColor: '#F9813A',
                       
                        borderRadius: 10,
                        borderWidth:2,
                        shadowColor: 'blue',
                        shadowOffset: {
                            width: 0,
                            height: 10
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 10
                    }} onPress={() => deletesa()}>
                        <Text style={{
                            textAlign: 'center',
                            fontWeight:'bold',
                            color: '#F9813A',
                        }}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        width:'45%',
                        padding: 20,
                        borderColor: '#F9813A',
                        borderWidth:2,
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
                            fontWeight:'bold',
                            color: '#F9813A',
                        }}>Update</Text>
                    </TouchableOpacity>
                    </View>
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
export default UpdateSavedAddressScreen;