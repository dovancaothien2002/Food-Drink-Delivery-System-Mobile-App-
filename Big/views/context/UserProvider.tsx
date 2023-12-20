import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext<any>({});
const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState('');
    const getUser = async () => {
        const result = await AsyncStorage.getItem('users');
        if (result !== null) {
            setUser(JSON.parse(result))
        }
    }
    const delUser = async () => {
        await AsyncStorage.removeItem('users');
        setUser('');
    }
    useEffect(() => {
        getUser();
    }, []);
    return (
        <UserContext.Provider value={{ user, setUser, getUser,delUser }}>
            {children}
        </UserContext.Provider>
    );
}
export const useUser = () => useContext(UserContext);


export default UserProvider;