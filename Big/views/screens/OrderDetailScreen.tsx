import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, ScrollView, TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useUser } from "../context/UserProvider";
import {url} from '../screens/Api';
import IconC from 'react-native-vector-icons/Ionicons';
import IconB from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import COLORS from "../../consts/colors";

const OrderDetailScreen = ({ navigation ,route}:any) => {
    const order = route.params;
    const[listOrderDetail,setlistOrderDetail] = useState([]);
    const { user, setUser, getUser }: any = useUser();
    let shippingFee = 0;
    let totalPrice = 0
    
    const getListOrderDetail = async () => {
        try {
            const res = await fetch(url+'/list_orderDetail2/'+ order.id)
            const data = await res.json();
            setlistOrderDetail(data.result);
            (data.result).map((item:any) => 
                totalPrice += item.price*item.quantity
            );
            shippingFee = order.totalPrice - totalPrice;
        } catch (error) {
          console.log(error)
        }
    }

    const updateOrder = async () =>{
        let data = {
            order_status : 4,
            order_id : order.id
        }
        
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to cancel this order?",
            [
                // The "Yes" button
                {
                text: "Yes",
                onPress: async () => {
                    await axios.put(url+'/update-order/', data).then((respone) => {
                        if (respone.data.statusCode === 200) {
                            Alert.alert("Cancel order success !")
                            navigation.navigate('OrderScreen')
                        } else {
                            
                        }
                    }).catch((err) =>
                    console.log(err)
                    )
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

    useEffect(()=>{
        getListOrderDetail();
    },[]);

    return (
        <>
            <SafeAreaView style={{flex: 1,backgroundColor: COLORS.white}}>
                <ScrollView>
                <View style={style.header}>
                    <View style={{width:'10%'}}>
                    <IconC name="arrow-back-outline" size={28} onPress={()=> navigation.goBack()} /> 
                    </View> 
                    <View style={{width:'80%'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Order Detail</Text>
                    </View> 
                </View>
                <View style={{
                    padding: 20,
                    paddingBottom:0

                }}>
                     <FlatList
                    data={listOrderDetail}
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={false}
                    renderItem={({item}:any) => 
                        <TouchableOpacity >
                            <View style={{padding:10,borderColor:'#717171',marginBottom:15,borderWidth:1,borderRadius:5}}>
                               <View style={{flexDirection:'row',flex:1}}>
                                    <View style={{flex:2}}>
                                        <Image source={{uri: item.prod_image}} style={{ height: 100, width: "100%" }}/>
                                    </View>
                                    <View style={{flex:3,justifyContent:'center',paddingHorizontal:10}}>
                                        <Text style={{fontSize:24,fontWeight:'bold',color:"black",marginBottom:10}} >{item.prod_name}</Text>
                                            <View style={{flexDirection:'row',flex:1}}>
                                           
                                                <View style={{flex:1}}>
                                                    <Text style={{fontSize:20,color:"black",marginBottom:10}} >( x{item.quantity} ) </Text>
                                                </View>  
                                               
                                                {item.prod_saleprice > 0 ?
                                                    <View style={{flex:3}}>
                                                         <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                                            <Text style={{color:'green',textDecorationLine:'none' }}>
                                                                {item.prod_saleprice.toLocaleString('vi', { style: 'currency', currency: 'VND' })} &nbsp;
                                                           </Text>
                                                           <Text style={{textDecorationLine: 'line-through', color: 'gray' }}>
                                                                {item.prod_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                                           </Text>
                                                         </Text>
                                                    </View>
                                                    :
                                                    <View style={{flex:3}}>
                                                        <Text style={{ fontSize: 18, fontWeight: 'bold',color:'green' }}>
                                                            {item.prod_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}

                                                        </Text>
                                                    </View>   
                                                }
                                            
                                            </View>
                                    </View>
                                   
                               </View>
                               
                            </View>
                        </TouchableOpacity>
                        }
                />
                </View>
                <View style={{paddingHorizontal:20,paddingBottom:20}}>
                    <Text style={{fontSize:20,fontWeight:'bold',color:'black',marginBottom:5}}><Icon name="map-marker-alt" style={{fontSize:18,color:"red"}}></Icon>  Delivery Address Information </Text>
                    <Text style={{color:'black',fontSize:18}}>Name : {order.user_name}</Text>
                    <Text style={{color:'black',fontSize:18}}>Phone : ( {order.user_phone} )</Text>
                    <Text style={{color:'black',fontSize:18}}>Note : {order.note} </Text>
                    <Text style={{color:'black',fontSize:18}}>Detail Address : {order.detailaddress} </Text>
                    <Text style={{color:'black',fontSize:18}}>Address : {order.address}</Text>
                    <Text style={{color:'black',fontSize:18,marginBottom:20}}>Store Ordered :  {order.store_name}</Text>
                    <Text style={{fontSize:18,fontWeight:'bold',color:'black'}}>Total Bill : <Text style={{color:'red'}}>{(order.totalPrice).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Text> </Text>
                </View>
                {order.status < 1 ? 
                    <View style={{paddingHorizontal:80}}>
                        <TouchableOpacity style={{
                            padding: 15,
                            backgroundColor: 'red',
                            marginVertical: 10,
                            borderRadius: 40,
                            }} onPress={() => updateOrder()}>
                                <Text style={{textAlign: 'center',fontSize: 20,color: 'white',}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View></View>
                }

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
        color:'black',
        marginRight:10,
        fontSize:22
    },
});
export default OrderDetailScreen;