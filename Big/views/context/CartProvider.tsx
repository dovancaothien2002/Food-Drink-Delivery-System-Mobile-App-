import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext<any>({});
const CartProvider = ({ children }: any) => {
    const [carts, setCart] = useState([]);
    const getCart = async () => {
        const result = await AsyncStorage.getItem('Carts');
        if (result !== null) {
            setCart(JSON.parse(result))
        }
    }

    const delCart = async () => {

        await AsyncStorage.removeItem('Carts');
        setCart([])
    }
  
    useEffect(() => {
        getCart();
       
    }, []);
    return (
        <CartContext.Provider value={{ carts, setCart, getCart,delCart }}>
            {children}
        </CartContext.Provider>
    );
}
export const useCart = () => useContext(CartContext);


export default CartProvider;