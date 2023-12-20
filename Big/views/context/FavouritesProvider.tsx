import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavContext = createContext<any>({});
const FavouritesProvider = ({ children }: any) => {
    const [favs, setFav] = useState([]);

    const getFav = async () => {
        const result = await AsyncStorage.getItem('Favs');
        if (result != null) {
            setFav(JSON.parse(result))
        }
    }
    const delFav = async () => {

        await AsyncStorage.removeItem('Favs');
        setFav([])
    }
  
    useEffect(() => {
        getFav();
    }, []);
    return (
        <FavContext.Provider value={{ favs, setFav, getFav,delFav }}>
            {children}
        </FavContext.Provider>
    );
}
export const useFav = () => useContext(FavContext);


export default FavouritesProvider;