import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../consts/colors';
import categories from '../../consts/categories';
import foods from '../../consts/foods';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserProvider';
import { PrimaryButton } from '../components/Button';
import { useCart } from '../context/CartProvider';
import { check } from 'prettier';
import axios from 'axios';
import { useFav } from '../context/FavouritesProvider';
import {url} from '../screens/Api';
const { width } = Dimensions.get('screen');
const cardWidth = width / 2 - 20;
const cateWidth = width / 4.5;

const HomeScreen = ({ navigation }: any) => {
  const [favourites, setFavourites] = useState<any[]>([]);
  const { user, setUser, getUser }: any = useUser();
  const { carts, setCart, getCart }: any = useCart();
  const { favs, setFav, getFav }: any = useFav();
  const getListFavourites = async () => {
    try {
      if (user.id != undefined) {
        // console.log(user.id);

        const res = await fetch(url+'/favourites/' + user.id)
        const data = await res.json();
        setFav(data.product);
        AsyncStorage.setItem('Favs', JSON.stringify(data.product))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkItemExists = (proId: number) => {
    if (favs != null && user.name != undefined) {
      for (let i = 0; i < favs.length; i++) {

        if (favs[i].product_id == proId) {
          // console.log(favourites[i].product_id + favourites[i].name)
          //  getListFavourites()
          return i;
        }
      }
      return -1;
    }
  }

  const addToFav = (item: { id: any }) => {
    if(user.id != undefined){
      let data = {
        user_id: user.id,
        product_id: item.id
      }
      axios.post(url+'/favourites/', data).
        then((respone) => {
          // alert(JSON.stringify(respone));
          if (respone.data.statusCode === 200) {
            Alert.alert(respone.data.message);
            getListFavourites();
  
          } else {
          }
        }
        )
        .catch((err) =>
          console.log(err)
        )
    }else{
      Alert.alert('Please log in to use the favorites feature');
    }
   
  }

  const addToCartBtn = (item: { id: any; sale_price: any; price: any; }) => {
    // Update cart item quantity if already in cart
    if (carts.some((cartItem: { id: any; }) => cartItem.id === item.id)) {
      setCart((cart: any[]) =>
        cart.map((cartItem: { id: any; amount: number; sale_price: any; price: any; }) =>


          cartItem.id === item.id
            ? {
              ...cartItem,
              amount: cartItem.amount + 1,
              price: cartItem.sale_price ? cartItem.sale_price : cartItem.price
            }
            : {
              ...cartItem,
              price: cartItem.sale_price ? cartItem.sale_price : cartItem.price
            },
          console.log(cart)
        )
      );
      Alert.alert('Add to cart successfully')
      return;
    }

    // Add to cart
    setCart((cart: any) => [
      ...cart,
      { ...item, amount: 1, price: item.sale_price ? item.sale_price : item.price }, // <-- initial amount 1


    ]);
    Alert.alert('Add to cart successfully')

  };




  const [key, setKey] = useState('');
  const search = async () => {
    getFoods(37, key);
  }

  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);

  const [food, setFood] = useState([]);
  const getFoods = async (id: string | number, key: string | null) => {
    try {
      let res: any;
      if (id != 37) {

        res = await fetch(url+'/product-by-cat-id/' + id)
      }
      else if (key != null) {
        res = await fetch(url+'/products/?key=' + key)

      }
      else {
        res = await fetch(url+'/products')

      }
      const data = await res.json();
      setFood(data.product);
      console.log(data.product);

    } catch (error) {
      console.log(error)
    }
  };
  const [categories, setCategories] = useState([]);
  const getCategories = async () => {
    try {
      const res = await fetch(url+'/categoriess')
      const data = await res.json();
      setCategories(data.data);
      console.log(data.data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getFoods(37, key);
    getCategories();
    getFav();
  }, [])
  const ListCategories = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.categoriesListContainer}>
        {categories.map((category: any, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => { setSelectedCategoryIndex(index); getFoods(category.id, null) }}>
            <View
              style={{
                backgroundColor:
                  selectedCategoryIndex == index
                    ? COLORS.primary
                    : COLORS.secondary,
                ...style.categoryBtn,
              }}>
              <View style={style.categoryBtnImgCon}>
                <Image
                  source={{
                    uri: category.image
                  }}
                  style={{ height: '100%', width: '100%', borderRadius:10,resizeMode: 'cover'}}
                />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginLeft: 10,
                  color:
                    selectedCategoryIndex == index
                      ? COLORS.red
                      : COLORS.primary,
                }}>
                {parseInt(category.name.length) > 7 ? 
                  category.name.substring(0, 7) +' ...'
                  :
                  category.name
                }
              </Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    );
  };
  const Card = ({ food }:any) => {
    return (

      <View style={style.card}>
        <TouchableHighlight

          underlayColor={COLORS.white}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('DetailsScreen', food)}>
          <View style={{ alignItems: 'center',padding:10}}>
            <Image
              style={{ height: 120, width: '100%', borderRadius: 10 }}
              source={{
                uri: food.image
              }}
            />

          </View>
        </TouchableHighlight>

        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{food.name}</Text>
          {/* <Text style={{ fontSize: 14, color: COLORS.grey, marginTop: 2 }}>
              {food.description}
            </Text> */}
        </View>
        <View
          style={{
            marginTop: 10,
            marginHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {food.sale_price != 0 ?
            <View >
              <Text style={{ fontSize: 18, fontWeight: 'bold', textDecorationLine: 'line-through', color: 'red' }}>
                {food.pricee = food.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}

              </Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {food.pricee = food.sale_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}

              </Text>
            </View>
            :
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {food.pricee = food.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}

            </Text>
          }
          {user.name != undefined ?
            <TouchableHighlight
              underlayColor={COLORS.white}
              activeOpacity={0.9}
              onPress={() => addToCartBtn(food)}>
              <View style={style.addToCartBtn}>
                {<Icon name="add-outline" size={20} color={COLORS.white} />}
              </View>
            </TouchableHighlight>
            : <TouchableHighlight
              underlayColor={COLORS.white}
              activeOpacity={0.9}
              onPress={() => addToCartBtn(food)}>
              <View style={style.addToCartBtn}>
                {<Icon name="add-outline" size={20} color={COLORS.white} />}
              </View>
            </TouchableHighlight>
          }
          {checkItemExists(food.id) != -1 && checkItemExists(food.id) != null ?

            <TouchableHighlight
              underlayColor={COLORS.white}
              activeOpacity={0.9}
              onPress={() => addToFav(food)}>
              <View style={style.addToCartBtn}>
                {<Icon name="heart" size={20} color={COLORS.red} />}
              </View>
            </TouchableHighlight>
            :
            <TouchableHighlight
              underlayColor={COLORS.white}
              activeOpacity={0.9}
              onPress={() => addToFav(food)}>
              <View style={style.addToCartBtn}>
                {<Icon name="heart" size={20} color={COLORS.white} />}
              </View>
            </TouchableHighlight>


          }

        </View>
      </View >

    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={style.header}>
        {user.name != undefined ?
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 28 }}>Hello,</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', marginLeft: 10 }}>

                {user.name}


              </Text>
            </View>

            <Text style={{ marginTop: 5, fontSize: 22, color: COLORS.grey }}>
              What do you want today
            </Text>
          </View>
          :
          <View>



          </View>
        }

        {/* <Image
          source={require('../../assets/close.png')}
          style={{ height: 30, width: 30, borderRadius: 25,backgroundColor:'gray' }}
        /> */}
        {/* <TouchableHighlight
          underlayColor={COLORS.white}
          activeOpacity={0.9}
          onPress={() => Alert.alert('1')}>
          <View style={style.bagBtn} >
            {<Icon name="cube-outline" size={28} color={COLORS.white} />}
          </View>
        </TouchableHighlight> */}
        {/* <View style={{ width: 30, height: 30, backgroundColor: 'red', borderRadius: 15, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: -10, right: 8 }}>
          <Text style={{ color: '#fff' }}>{carts.length}</Text>
        </View> */}
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: 'row',
          paddingHorizontal: 20,
        }}>
        <View style={style.inputContainer}>
          {<Icon name="search-outline" size={28} />}
          <TextInput
            style={{ flex: 1, fontSize: 18 }}
            placeholder="Search for food" onChangeText={(value) => setKey(value)}
          />
        </View>
        <TouchableHighlight
          underlayColor={COLORS.white}
          activeOpacity={0.9}
          onPress={() => search()}>
          <View style={style.sortBtn}>
            {<Icon name="search-outline" size={28} color={COLORS.white} />}
          </View>
        </TouchableHighlight>
      </View>
      <View>
        <ListCategories />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={food}
        renderItem={({ item }) => <Card food={item} />}
      />

    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  categoriesListContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryBtn: {
    height: 90,
    width: cateWidth,
    marginRight: 10,
    borderRadius: 12,
    alignItems: 'center',
    padding: 3,
    //flexDirection: 'row',
  },
  categoryBtnImgCon: {
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: cardWidth,
    marginHorizontal: 10,
    paddingVertical:10,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: COLORS.white,
  },
  addToCartBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;