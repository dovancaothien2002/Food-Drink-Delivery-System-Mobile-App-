import React, { useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../consts/colors';
import { PrimaryButton } from '../components/Button';
import { useUser } from '../context/UserProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import IconB from 'react-native-vector-icons/Ionicons';
import { useFav } from '../context/FavouritesProvider';

const AccountScreen = ({ navigation }:any) => {
    const { user, setUser, getUser, delUser }: any = useUser();
    const {  delFav }: any = useFav();
    console.log(user);
    const logOut = async () => {
        delUser();
        delFav();
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>

            <View >


            <View style={style.header}>
                <View style={{width:'10%'}}>
                <IconB name="arrow-back-outline" size={28} onPress={navigation.goBack} /> 
                </View> 
                <View style={{width:'80%'}}>
                <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Account</Text>
                </View> 
            </View>
                {user.name == undefined ?
                <View style={{width:'100%',paddingHorizontal:15,paddingVertical:15}}>
                        
                    <Text style={{fontWeight:'bold',textAlign:'center',fontSize:18}}>
                        You are not logged in. Please use your account to log in to the application. If you don't have one, select register
                    </Text>
                    <View style={[style.header,{justifyContent:'space-between'}]}>
                        <View style={{width:'45%'}}>
                            <TouchableOpacity  onPress={() => navigation.navigate('Register')}>
                            <View style={{borderColor: COLORS.primary,borderWidth:2,borderRadius: 15}}>
                            <Text style={{fontSize:18,paddingVertical:15,color:COLORS.primary,fontWeight:'bold',textAlign:'center'}}>Register</Text>
                            </View> 
                            </TouchableOpacity>
                        </View> 
                        <View style={{width:'45%'}}>
                            <TouchableOpacity  onPress={() => navigation.navigate('Login')}>
                            <View style={{borderColor: COLORS.primary,borderWidth:2,borderRadius: 15}}>
                            <Text style={{fontSize:18,paddingVertical:15,color:COLORS.primary,fontWeight:'bold',textAlign:'center'}}>Log In</Text>
                            </View> 
                            </TouchableOpacity>
                        </View> 
                    </View>
                    </View>
                    :
                    <View style={{paddingHorizontal:15,marginTop: 20 }}>
                        <View style={{backgroundColor:'#fedac5',padding:20,paddingTop:30,borderRadius:20,marginBottom:20}}>
                            <View style={style.infor}>
                                <View style={{width:"12%"}} >
                                    <Icon name="person-outline" style={{fontSize:28}}></Icon>
                                </View>
                                <View style={{width:"60%",justifyContent:'center'   }} >
                                    <Text style={{fontWeight:'bold',fontSize:18}}>Name: <Text style={{fontWeight:'400'}}> {user.name}</Text></Text>
                                </View>
                                <View style={{width:"28%"}} >
                                    <Icon name="create-outline" onPress={() => {navigation.navigate('UpdateUser')}} style={{fontSize:28}}></Icon>
                                </View>
                            </View>
                            <View style={style.infor}>
                                <View style={{width:"12%"}} >
                                    <Icon name="call-outline" style={{fontSize:28}}></Icon>
                                </View>
                                <View style={{width:"88%",justifyContent:'center'   }} >
                                    <Text style={{fontWeight:'bold',fontSize:18}}>Phone number: <Text style={{fontWeight:'400'}}> {user.phone}</Text></Text>
                                </View>
                            </View>
                            <View style={style.infor}>
                                <View style={{width:"12%"}} >
                                    <Icon name="mail-outline" style={{fontSize:28}}></Icon>
                                </View>
                                <View style={{width:"88%",justifyContent:'center'   }} >
                                    <Text style={{fontWeight:'bold',fontSize:18}}>Email: <Text style={{fontWeight:'400'}}> {user.email}</Text></Text>
                                </View>
                            </View>
                        </View>
                        
                        <View style={{  marginTop: 10 }}>
                            <View style={[style.infor,{borderTopWidth:1,borderColor:'#ccc',paddingBottom:8,paddingVertical:8}]}>
                                <View style={{width:"10%"}} >
                                    <Icon name="reader-outline" style={{fontSize:28,color:'#F9813A'}}></Icon>
                                </View>
                                <View style={{width:"80%",justifyContent:'center'}} >
                                    <TouchableOpacity onPress={() => navigation.navigate('OrderScreen')}><Text style={{fontSize:16}}>List order</Text></TouchableOpacity>
                                </View> 
                                <View style={{width:"10%"}} >
                                    <Icon name="chevron-forward-outline" style={{fontSize:28,color:'#F9813A'}}></Icon>
                                </View>
                            </View>
                            <View style={[style.infor,{borderTopWidth:1,borderColor:'#ccc',paddingBottom:8,paddingVertical:8}]}>
                                <View style={{width:"10%"}} >
                                    <Icon name="cube-outline" style={{fontSize:28,color:'#F9813A'}}></Icon>
                                </View>
                                <View style={{width:"80%",justifyContent:'center'}} >
                                    <TouchableOpacity onPress={() => navigation.navigate('DeliveryAddress')}><Text style={{fontSize:16}}>Delivery Address</Text></TouchableOpacity>
                                </View> 
                                <View style={{width:"10%"}} >
                                    <Icon name="chevron-forward-outline" style={{fontSize:28,color:'#F9813A'}}></Icon>
                                </View>
                            </View>
                            <View style={[style.infor,{borderTopWidth:1,borderColor:'#ccc',paddingBottom:8,paddingVertical:8}]}>
                                <View style={{width:"10%"}} >
                                    <Icon name="heart-outline" style={{fontSize:28,color:'#F9813A'}}></Icon>
                                </View>
                                <View style={{width:"80%",justifyContent:'center'}} >
                                    <TouchableOpacity onPress={() => navigation.navigate('Favourites')}><Text style={{fontSize:16}}>List Favourites</Text></TouchableOpacity>
                                </View> 
                                <View style={{width:"10%"}} >
                                    <Icon name="chevron-forward-outline" style={{fontSize:28,color:'#F9813A'}}></Icon>
                                </View>
                            </View>
                            <View style={[style.infor,{borderTopWidth:1,borderColor:'#ccc',paddingBottom:8,paddingVertical:8}]}>
                                <View style={{width:"10%"}} >
                                    <Icon name="log-out-outline" style={{fontSize:28,color:'#F9813A'}}></Icon>
                                </View>
                                <View style={{width:"80%",justifyContent:'center'}} >
                                <TouchableOpacity style={{borderRadius: 15 }} onPress={() => logOut()}><Text style={{fontSize:16}}>Log out</Text></TouchableOpacity>
                                </View> 
                                <View style={{width:"10%"}} >
                                    <Icon name="chevron-forward-outline" style={{fontSize:28,color:'#F9813A'}}></Icon>
                                </View>
                            </View>
                            <View style={[style.infor,{borderTopWidth:1,borderColor:'#ccc',paddingBottom:5,paddingVertical:5}]}>
                                
                            </View>
                        </View>

                    </View>
                }
            </View>
            
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    header: {
        marginTop: 20,
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    textContainer: {
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        paddingBottom: 15,
    },
    indicatorContainer: {
        height: 50,
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    infor: {
        width: '100%',
        paddingBottom:10,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    currentIndicator: {
        height: 12,
        width: 30,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        marginHorizontal: 5,
    },
    indicator: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: COLORS.grey,
        marginHorizontal: 5,
    },
});

export default AccountScreen;
