import React from "react";
import { View, Text } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from "../../consts/colors";

type TextProps = {
    title:string,
    icon:string
}
const Title = ({ title }: TextProps,{icon}:TextProps) => {
    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'red', padding: 15 }}>
                {<Icon name= {icon} size={35} color={COLORS.white} />}
                <Text style={{ color: 'white', textTransform: 'uppercase', fontSize: 25 }}>{title}</Text>
            </View></>);
}
export default Title;