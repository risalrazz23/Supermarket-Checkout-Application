import React, { useState, useMemo, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, Modal, Image, Button, ActivityIndicator } from 'react-native'
import { ScrollView, State } from 'react-native-gesture-handler'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { TouchableOpacity, SkeletonView, Icon } from 'react-native-ui-lib'
import { UseSelector, useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'
// import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import SelectDropdown from 'react-native-select-dropdown';
import RNUpiPayment from 'react-native-upi-payment'
import axios from 'axios'
import { useDispatch, } from 'react-redux'
import { BASE_URL } from '@env'
import ServerError from '../../components/ServerError';
import moment from 'moment';
function Cart({ navigation }) {

  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['25%', '55%'], []);
  const bottomSheetRef = useRef(null);
  const textInputRef = useRef(null);

  const phoneNumber = useSelector(state => state.auth.phoneNumber)
  const cart = useSelector(state => state.cart.items)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [item, setItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [inputError, setInputError] = useState(false)
  const [errorMidalVisible, setErrorModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false)
  const [itemLoading, setItemLoading] = useState(false);
 



  const updateCart = async () => {
    setIsLoading(true)
    const Cart = {
      phoneNumber: phoneNumber,
      product: { ...item },
      quantity: quantity,
      unit: unit,
      totalPrice: totalPrice
    }
    const response = await axios.post(`${BASE_URL}/product/update`, { Cart }).then((res) => {
      if (res.data) {
        console.log("this is new", res.data.cart);
        const newCart = res.data.cart

        setIsLoading(false)
        dispatch({ type: 'SET_CART_ITEMS', payload: newCart })

        setItem('')
        setIsModalOpen(false)
        
      }

    }).catch((err) => {
      setIsLoading(false)
      if (err.message === "Network Error") {
       
        setErrorModalVisible(true)

      } else {
      
        setErrorModalVisible(true)
      }

    })
  }

  const deleteCart = async () => {
    setIsLoading(true)
    const Cart = {
      phoneNumber: phoneNumber,
      product: { ...item },
      quantity: quantity,
      unit: unit,
      totalPrice: totalPrice
    }
    const response = await axios.post(`${BASE_URL}/product/deleteItem`, { Cart }).then((res) => {
      if (res.data) {
        console.log("this is new", res.data.cart);
        const newCart = res.data.cart

        setIsLoading(false)
        dispatch({ type: 'SET_CART_ITEMS', payload: newCart })

        setItem('')
        setIsRemoveModalOpen(false)
       
      }

    }).catch((err) => {
      setIsLoading(false)
      if (err.message === "Network Error") {
        
        setErrorModalVisible(true)

      } else {
        
        setErrorModalVisible(true)
      }

    })
  }

const purchase=async(data)=>{
  const date = new Date();
  
  // setIsLoading(true)
  const pay = {
    phoneNumber: phoneNumber,
    txnId: data.txnId,
    products:cart[0].cart,
    dateAndTime:moment(date).format('LLLL'),
    payTotal:cart[0].payTotal
  }
  const response = await axios.post(`${BASE_URL}/product/purchase`, { pay }).then((res) => {
    // console.log(res.data.data[0],"this is new");
    if (res.data) {
      const newCart = res.data.data
      
      // setIsLoading(false)
      dispatch({ type: 'SET_PURCHASE_DETAILS', payload: newCart })

     
      navigation.navigate('Orders')
    }

  }).catch((err) => {
    setIsLoading(false)
    if (err.message === "Network Error") {
      
      setErrorModalVisible(true)

    } else {
      
      setErrorModalVisible(true)
    }

  })
}



  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
setIsRemoveModalOpen(false)
      setIsModalOpen(false)
    }
  }, []);


  const numberPattern = /[0-9]/;

  function validNumber(quantity) {
    return numberPattern.test(quantity);
  }




  const handleChange = (enteredQuantity) => {
    if (enteredQuantity.length == 0) {
      console.log(enteredQuantity);
      setInputError(false)
      setQuantity(1)





      if (unit == item.Units[0]) {
        return setTotalPrice(item.price)
      } else {
        const convert = 500 / 1000
        setQuantity(500);

        console.log(convert * item.price);
        return setTotalPrice(parseInt(convert * item.price))
      }

    }
    if (parseInt(enteredQuantity) == 0) {
      if (unit == item.Units[0]) {
        return setTotalPrice(item.price)
      } else {
        const convert = 500 / 1000
        setQuantity(500);

        console.log(convert * item.price);
        return setTotalPrice(parseInt(convert * item.price))
      }
    }
    const valid = validNumber(parseInt(enteredQuantity));
    if (valid) {
      setInputError(false)
      if (unit == item.Units[0]) {

        console.log(parseInt(enteredQuantity) * item.price);
        setQuantity(enteredQuantity)
        return setTotalPrice(parseInt(enteredQuantity) * item.price)

      } else {
        const convert = enteredQuantity / 1000
        setQuantity(enteredQuantity)
        const value = convert * item.price
        // console.log(convert,parseInt(value));
        setTotalPrice(parseInt(value))
      }
    }
    else {
      return setInputError(true)
    }


  }


  // console.log(cart[0].cart[0]);

  const Payment = () => {
    RNUpiPayment.initializePayment(
      {
        vpa: `${VPA_ID}`, // or can be john@ybl or mobileNo@upi
        payeeName: 'CartPay',
        amount: cart.totalPrice,
        transactionRef: 'aasf-332-aoei-fn',
      },
      successCallback,
      failureCallback
    );
  }

  function successCallback(data) {

    alert("Payment Successfull", data)
    purchase(data)

  }

  function failureCallback(err) {
    alert("Payment failed", err)
  }
  return (

    <View style={styles.Container}>


      {cart[0]?.cart[0] ? <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={{ ...styles.payBtn, width: wp(98), height: wp(15), marginTop: 20, elevation: 5 }}>
        <TouchableOpacity style={{ ...styles.payBtn, width: wp(98), }} onPress={() => { Payment() }}>
          <Text style={{ color: '#fff', fontSize: wp(6), fontWeight: 'bold' }}>Pay ₹{cart[0]?.payTotal} </Text>
        </TouchableOpacity>
      </LinearGradient>:<View style={{height:hp(100),justifyContent:'center',alignItems:'center'}}>
      <Image style={{width:wp(80),height:wp(80)}} source={require('../../assets/images/EmptyCart.jpeg')}></Image>
      <TouchableOpacity onPress={()=>navigation.navigate('Scanner')}>
        <Text style={{color:'#6E4DE4',fontSize:wp(7),fontFamily:"Kalnia-Medium"}}>Continue shopping</Text>
      </TouchableOpacity>
      </View>
      }
      <ScrollView>
        <View>

          {cart[0]?.cart.map((item) => {
            return (
              <View style={styles.itemBox}>
                <View style={{ flexDirection: 'row' }}>

                  <Image style={styles.itemImage} source={{ uri: `${item.productImage}` }} />



                  <View style={{ width: wp(50), marginLeft: 10, flexDirection: 'column', }}>
                    <View style={{ width: wp(50), flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                      <TouchableOpacity onPress={(() => {
                        setItem(item);
                        setTotalPrice(item.totalPrice);
                        setQuantity(item.quantity);
                        setUnit(item.unit);
                        setIsModalOpen(true)


                      })}>

                        <Icon source={require('../../assets/icons/edit.png')} size={35} tintColor={'blue'} style={{ marginTop: 5, marginRight: 10 }} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>{
                        setItem(item);
                        setTotalPrice(item.totalPrice);
                        setQuantity(item.quantity);
                        setUnit(item.unit);
                        setIsRemoveModalOpen(true)
                      }}>

                        <Icon source={require('../../assets/icons/cancel.png')} size={40} style={{ marginTop: 5, marginRight: 10 }} />
                      </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 2, fontSize: wp(7), marginLeft: 20, color: '#364956', fontWeight: 'bold' }}>{item.productName}</Text>

                    <Text style={{ marginTop: 5, fontSize: wp(5), marginLeft: 20, color: '#364956' }}>Price:₹{item.price}/{item.Units[0]}</Text>
                    <Text style={{ marginTop: 5, fontSize: wp(5), marginLeft: 20, color: '#364956' }}>Quantity:{item.quantity}{item.unit}</Text>


                  </View>

                </View>
                <Text numberOfLines={2} style={{ marginTop: 5, fontSize: wp(6), marginLeft: 20, color: '#364956', fontWeight: 'bold' }}>Total price:₹{item.totalPrice}</Text>


              </View>
            )
          })}


        </View>

        <Modal animationType="fade" onRequestClose={() => { setItem(''), setIsLoading(false); setIsModalOpen(false) }} visible={isModalOpen} transparent={true}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', }}>
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>

              <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                isVisible={true}
                enablePanDownToClose={true}
              >

                <View style={{ flex: 1, alignItems: 'center' }}>

                  <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={{
                    width: wp('95'),
                    height: wp('78'),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    marginTop: 3,

                  }}>

                    {item && <View style={styles.itemShown}>



                      <View style={{ flexDirection: 'row' }}>

                        <Image style={styles.itemImage} source={{ uri: `${item.productImage}` }} />



                        <View style={{ width: 200, flexDirection: 'column' }}>

                          <Text style={{ marginTop: 20, fontSize: wp(7), marginLeft: 20, color: '#364956', fontWeight: 'bold' }}>{item.productName}</Text>

                          <Text style={{ marginTop: 5, fontSize: wp(5), marginLeft: 20, color: '#364956' }}>Price:₹{item.price}/{item.Units[0]}</Text>
                          <Text style={{ marginTop: 5, fontSize: wp(5), marginLeft: 20, color: '#364956' }}>Quantity {quantity}{unit}</Text>
                          <Text numberOfLines={2} style={{ marginTop: 5, fontSize: wp(6), marginLeft: 20, color: '#364956', fontWeight: 'bold' }}>Total price:</Text>
                          <Text numberOfLines={2} style={{ marginTop: 5, fontSize: wp(6), marginLeft: 20, color: '#364956', fontWeight: 'bold' }}>₹{totalPrice}</Text>


                        </View>

                      </View>
                      <Text style={{ color: '#000', marginLeft: wp(9), fontSize: wp(5) }}>Enter Quantity</Text>

                      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 4 }}>
                        <TextInput ref={textInputRef} maxLength={5} keyboardType='numeric' value={quantity} placeholder='type here...' placeholderTextColor={'#000'} style={{ width: wp(50), color: '#000', borderColor: '#000', borderWidth: 2, borderRadius: 10, fontSize: wp(5), paddingLeft: 10 }} onChangeText={handleChange}></TextInput>
                        <SelectDropdown
                          defaultValue={item.unit}
                          data={item.Units}
                          buttonStyle={{ borderWidth: 2, width: wp(30), borderRadius: 10, elevation: 5 }}
                          dropdownStyle={{ backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#000' }}
                          itemStyle={{ padding: 10, fontSize: 16 }}
                          selectedTextStyle={{ fontWeight: 'bold' }}
                          renderDropdownIcon={isOpened => {
                            return <Icon source={require('../../assets/icons/down-arrow.png')} size={36} tintColor={'#000'} />

                          }}
                          onSelect={((selectedUnit) => {
                            setUnit(selectedUnit);
                            textInputRef.current.clear();
                            setInputError(false)
                            if (selectedUnit !== item.Units[0]) {
                              const convert = 500 / 1000
                              setQuantity(500)
                              console.log(convert * 40);
                              return setTotalPrice(convert * item.price)
                            } else {
                              setQuantity(1)
                              return setTotalPrice(item.price);
                            }

                          })}
                        />

                      </View>
                      {inputError && <Text style={{ marginLeft: wp(8), color: 'red', }}>invalid number</Text>}

                    </View>}

                  </LinearGradient>
                  <View style={styles.buttons}>
                    {!isLoading && <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={{ ...styles.cancelBtn, width: item ? wp(45) : wp(98), height: wp(15), }}>



                      <TouchableOpacity style={{ ...styles.cancelBtn, width: item ? wp(43) : wp(96), }} onPress={() => { setItem(''); setIsModalOpen(false); }}>
                        <Text style={{ color: '#000', fontSize: 15 }}>Cancel </Text>


                      </TouchableOpacity>

                    </LinearGradient>}
                    {item && <TouchableOpacity disabled={isLoading} style={{ ...styles.addBtn, width: isLoading ? wp(98) : wp(45) }} onPress={(() => {
                      const valid = validNumber(quantity);
                      if (valid) {
                        updateCart()
                      } else {
                        setInputError(false)
                      }
                    })}><LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={{ ...styles.updateBtn, width: isLoading ? wp(98) : wp(45) }}>
                        {/* <Icon source={require('../assets/icons/retry.png')}   size={25} tintColor={'white'}  /> */}

                        <Text style={{ color: 'white', fontSize: 15 }}>{isLoading ? <ActivityIndicator size={'large'} color={'#fff'} />
                          : 'ADD+'}</Text>

                      </LinearGradient>


                    </TouchableOpacity>}
                  </View>
                </View>
              </BottomSheet>

            </GestureHandlerRootView>
          </View>

        </Modal>



        <Modal animationType="fade" onRequestClose={() => { setItem(''), setIsLoading(false); setIsRemoveModalOpen(false) }} visible={isRemoveModalOpen} transparent={true}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', }}>
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>

              <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                isVisible={true}
                enablePanDownToClose={true}
              >

                <View style={{ flex: 1, alignItems: 'center' }}>

                  <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={{
                    width: wp('95'),
                    height: wp('62'),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    marginTop: 3,
                    
                  }}>

                    {item && <View style={{...styles.itemShown,height:wp(60)}}>



                      <View style={{ flexDirection: 'row' }}>

                        <Image style={styles.itemImage} source={{ uri: `${item.productImage}` }} />



                        <View style={{ width: 200, flexDirection: 'column' }}>

                          <Text style={{ marginTop: 20, fontSize: wp(7), marginLeft: 20, color: '#364956', fontWeight: 'bold' }}>{item.productName}</Text>

                          <Text style={{ marginTop: 5, fontSize: wp(5), marginLeft: 20, color: '#364956' }}>Price:₹{item.price}/{item.Units[0]}</Text>
                          <Text style={{ marginTop: 5, fontSize: wp(5), marginLeft: 20, color: '#364956' }}>Quantity {quantity}{unit}</Text>
                          <Text numberOfLines={2} style={{ marginTop: 5, fontSize: wp(6), marginLeft: 20, color: '#364956', fontWeight: 'bold' }}>Total price:</Text>
                          <Text numberOfLines={2} style={{ marginTop: 5, fontSize: wp(6), marginLeft: 20, color: '#364956', fontWeight: 'bold' }}>₹{totalPrice}</Text>


                        </View>

                      </View>
                      

                     
                    </View>}

                  </LinearGradient>
                  <View style={styles.buttons}>
                    {!isLoading && <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={{ ...styles.cancelBtn, width: item ? wp(45) : wp(98), height: wp(15), }}>



                      <TouchableOpacity style={{ ...styles.cancelBtn, width: item ? wp(43) : wp(96), }} onPress={() => { setItem(''); setIsRemoveModalOpen(false); }}>
                        <Text style={{ color: '#000', fontSize: 15 }}>Cancel </Text>


                      </TouchableOpacity>

                    </LinearGradient>}

                    <TouchableOpacity style={{ ...styles.cancelBtn,backgroundColor:'red',flexDirection:'row', width: isLoading ? wp(98) : wp(45)  }} onPress={(() => {
                      const valid = validNumber(quantity);
                      if (valid) {
                        deleteCart()
                      } else {
                        setInputError(false)
                      }
                    })}>
                    {isLoading ? <ActivityIndicator size={'large'} color={'#fff'} />:<Icon source={require('../../assets/icons/delete.png')} size={25} tintColor={'white'} style={{ marginTop: 5, marginRight: 10 }} />}
                    
                        
                        <Text style={{ color: '#fff', fontSize: 15 ,fontWeight:'bold'}}>{isLoading?'Removing...':'Remove' }</Text>


                      </TouchableOpacity>

                   
                  </View>
                </View>
              </BottomSheet>

            </GestureHandlerRootView>
          </View>

        </Modal>
   




        {errorMidalVisible && <ServerError isModalVisible={errorMidalVisible} setModalVisible={setErrorModalVisible} message={'Network Disconnected'} />}







      </ScrollView>


    </View>
  )
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
    width: wp('100%'),
    height: hp('100%')
  },
  payBtn: {

    height: wp(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,


  }, itemShown: {
    width: wp('93'),
    height: wp('76'),
    backgroundColor: '#fff',
    borderRadius: 10,

  },
  itemBox: {
    width: wp(97),
    height: wp(60),
    marginTop: wp(5),
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 10,
  }, itemImage: {
    width: wp(40),
    height: wp(40),
    objectFit: 'scale-down',
    borderRadius: wp(5),
    backgroundColor: 'white',
    marginLeft: wp(3),
    marginTop: wp(3)
  }, buttons: {
    width: wp(95),
    height: hp(10),
    //  backgroundColor:'blue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cancelBtn: {

    height: wp(13),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,


  }, updateBtn: {

    height: wp(15),
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 30,

  }

})

export default Cart