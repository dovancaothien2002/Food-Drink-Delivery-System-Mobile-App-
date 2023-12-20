import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, TouchableOpacity} from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from "../context/UserProvider";
import {url} from '../screens/Api';
import COLORS from "../../consts/colors";
import IconB from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";


const OrderSceen = ({ navigation }:any) => {
    const[listOrder,setlistOrder] = useState([]);
    const { user, setUser, getUser }: any = useUser();
    const[checked,setChecked] = useState(0);
    const listStatus = [
        {id:0,value:0,text:"Unconfirmed",color:"blue"},
        {id:1,value:1,text:"Preprea Dish",color:"#c6c700"},
        {id:2,value:2,text:"Are Delivery",color:"#ff8e00"},
        {id:3,value:3,text:"Ordered Success",color:"green"},
        {id:4,value:4,text:"Canceled Order",color:"red"}
    ]

    const getlistOrder = async (status : number) => {
        try {
            const res = await fetch(url+'/list_orders2/'+ user.id+"/"+status)
            const data = await res.json();
            console.log(data.result);
            setlistOrder(data.result);
        } catch (error) {
          console.log(error)
        }
    }

    const next = (order : any) => {
        // let order = {
        //     order_id:item.order_id,
        //     order_status:item.order_status,
        //     order_totalPrice:item.order_totalPrice
        //     order_useraddress:item.order_totalPrice
        // }
        navigation.navigate('OrderDetailScreen',order);
    }
    
    function changeStatus(status:number){
        setChecked(status);
        getlistOrder(status);
    }

    useEffect(()=>{
        getlistOrder(0);
    },[]);

    useFocusEffect(
        useCallback(() => {
            getlistOrder(0);
            setChecked(0);
        }, [])
    );

    return (
        <>
            <SafeAreaView style={{flex: 1,backgroundColor: COLORS.white}}>
            <ScrollView>
                <View style={style.header}>
                    <View style={{width:'10%'}}>
                    <Icon name="arrow-back-outline" size={28} onPress={()=> navigation.goBack()} /> 
                    </View> 
                    <View style={{width:'80%'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>List Order</Text>
                    </View> 
                </View>
                <View style={{padding: 15,}}>           
                    <FlatList
                        data={listStatus}
                        horizontal
                        nestedScrollEnabled
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}:any) => 
                            <TouchableOpacity onPress={()=>changeStatus(item.value)}>
                                {checked == item.value ? 
                                    <Text style={[style.categories,{color:"white",backgroundColor:item.color,borderColor:item.color}]} >{item.text} </Text>
                                    :
                                    <Text style={[style.categories,{color:"black",borderColor:"black"}]} >{item.text} </Text>
                                }
                            </TouchableOpacity>
                        }
                    />
                </View>
                <View style={{padding: 15,width:"100%"}}>
                <FlatList
                    data={listOrder}
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={false}
                    renderItem={({item}:any) => 
                        <TouchableOpacity onPress={()=>next(item)}>
                            <View style={{padding:10,borderColor:'#717171',marginBottom:15,borderWidth:1,borderRadius:5}}>
                               <View style={{flexDirection:'row',flex:1}}>
                                    <View style={{flex:1}}>
                                        <Text style={{fontSize:30,color:"black",marginBottom:10,fontWeight:"bold"}} ><Text style={{fontSize:20}}>#</Text> {item.id}</Text>
                                    </View>
                                    <View style={{flex:2,justifyContent:'center'}}>
                                        <Text style={{fontSize:18,color:"black",marginBottom:10}} ><Icon name="time-outline" style={{fontSize:20,color:"#F9813A"}}></Icon> {moment(item.orderDate).format('DD/MM/YYYY hh:mm:ss a')}</Text>
                                    </View>
                               </View>
                               <View style={{flexDirection:'row',flex:1}}>
                                    <View style={{flex:5,justifyContent:'center',borderRightWidth:1}}>
                                        <Text style={{fontSize:18,color:"black",marginBottom:10}} ><IconB name="store-marker" style={{fontSize:20,color:"#F9813A"}}></IconB>  {item.store_name}</Text>
                                    </View>
                                    <View style={{flex:0.3}}></View>
                                    <View style={{flex:2}}>
                                    <Text style={{fontSize:18,color:"red",fontWeight:'bold',marginBottom:10}} >{item.totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Text>
                                    </View>
                               </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
                
                </View>
            </ScrollView>
            </SafeAreaView>
        </>
    );

};
const style = StyleSheet.create({
    header: {
        marginTop: 20,
        flexDirection: 'row',
        //justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    headers: {
        paddingVertical: 0,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    categories:{
        borderWidth:1,
        borderRadius:20,
        padding:10,
        fontWeight:'bold',
        marginRight:10,
        fontSize:16
    },
});
export default OrderSceen;