import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from "../context/UserProvider";
import {url} from '../screens/Api';
import IconC from 'react-native-vector-icons/Ionicons';

const RegisterSceen = ({ navigation }:any) => {
    // const {user,setUser,getUser }:any = useUser();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassWord] = useState('');
    const [phone, setPhone] = useState('');
    const [errName, checkName] = useState('');
    const [errPassword, checkPassword] = useState('');
    const [errEmail, checkEmail] = useState('');
    const [errEmailRegex, setRegexEmail] = useState(true);
    const [errPhoneRegex, setRegexPhone] = useState(true);
    const [errPhone, checkPhone] = useState('');

    const Check = async () =>{
        let check : any = {
            email:email
        }
        let check2 : any = {
            phone:phone
        }
        const res = await axios.post(url+'/check_unique',check);
        const res2 = await axios.post(url+'/check_unique2',check2);
        console.log(res.data);
        let regexPhone = new RegExp(/^(84|0[3|8|9])+([0-9]{8})$/);
        let regexEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        if (regexPhone.test(phone) == false) {
            setRegexPhone(false);
            checkPhone('Phone is not in correct format');
        }else if (res2.data.statusCode === 200){
            setRegexPhone(false);
            console.log("Loi trung");
            checkPhone('This phone has been registered to another account');
        }else{
            setRegexPhone(true);
            checkPhone('');
        }


        if (regexEmail.test(email) == false) {
            setRegexEmail(false);
            checkEmail('Email is not in correct format');
        }else if (res.data.statusCode === 200){
            setRegexEmail(false);
            console.log("Loi trung");
            checkEmail('This email address has been registered to another account');
        } else {
            setRegexEmail(true);
            checkEmail('');
        }
    }

    const onSubmit  = async () => {
        let formData = {
            email: email,
            password: password,
            name: name,
            phone: phone,
        }
       
        Check();
        
        formData.name === '' ? checkName('Name cannot be blank') : checkName('')
        formData.password === '' ? checkPassword('Password cannot be blank') : checkPassword('')
        formData.phone === '' ? checkPhone('Phone cannot be blank') : checkPhone('')
        formData.email === '' ? checkEmail('Email cannot be blank') : checkEmail('')
        if (formData.name !== '' && formData.email !== '' && formData.phone !== ''  && formData.password !== '' && errEmailRegex == true && errPhoneRegex == true ) {
            axios.post(url+'/register', formData).
                then((respone) => {
                    if (respone.data.statusCode === 200) {
                        navigation.navigate('Login')

                    } else {
                        Alert.alert(respone.data.message);
                    }
                }
                )
                .catch((err) =>
                    console.log(err)
                )
            //Alert.alert("OK");
        }
    }
    return (
        <>
            <SafeAreaView>
                <View style={style.header}>
                    <View style={{width:'10%'}}>
                    <IconC name="arrow-back-outline" size={28} onPress={()=> navigation.goBack()} /> 
                    </View> 
                    <View style={{width:'80%'}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold',textAlign:'center'}}>Register</Text>
                    </View> 
                </View>
                <View style={{
                    padding: 15,

                }}>
                    <View style={{
                        
                    }}>
                        <TextInput placeholder="Name" style={{ fontSize: 14, padding: 20, borderRadius: 10, borderWidth: 0.5 }} onChangeText={(value) => setName(value)} />
                        <Text style={{ color: 'red', fontStyle: 'italic' }}>{errName}</Text>
                        <TextInput placeholder="Email" style={{ fontSize: 14, padding: 20, borderRadius: 10, borderWidth: 0.5 }} onChangeText={(value) => setEmail(value)} />
                        <Text style={{ color: 'red', fontStyle: 'italic' }}>{errEmail}</Text>
                        {/* <Text style={{ color: 'red', fontStyle: 'italic' }}>{errEmailRegex == false ? errEmail : ''}</Text> */}

                        <TextInput placeholder="Password" style={{ fontSize: 14, padding: 20, borderRadius: 10, borderWidth: 0.5 }} secureTextEntry={true} onChangeText={(value) => setPassWord(value)} />
                        <Text style={{ color: 'red', fontStyle: 'italic' }}>{errPassword}</Text>
                        <TextInput placeholder="Phone" style={{ fontSize: 14, padding: 20, borderRadius: 10, borderWidth: 0.5 }} onChangeText={(value) => setPhone(value)} />
                        <Text style={{ color: 'red', fontStyle: 'italic' }}>{errPhone}</Text>
                    </View>

                    <TouchableOpacity style={{
                        padding: 15,
                        backgroundColor: '#F9813A',
                        marginVertical: 10,
                        borderRadius: 10,
                        shadowColor: 'blue',
                        shadowOffset: {
                            width: 0,
                            height: 10
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 10
                    }} onPress={() => onSubmit()}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 20,
                            color: 'white',
                        }}>Register</Text>
                    </TouchableOpacity>
                </View>
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
});
export default RegisterSceen;