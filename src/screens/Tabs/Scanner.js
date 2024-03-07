import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Image, Button, StyleSheet, ImageBackground, PermissionsAndroid, Linking } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { BASE_URL } from '@env'
import { useIsFocused } from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import axios from 'axios';
import RNRestart from 'react-native-restart';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, SkeletonView } from 'react-native-ui-lib';
import Loader from '../../components/Loader';
import BottomSheet from '@gorhom/bottom-sheet';
import Sound from 'react-native-sound';
import { useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';
import ServerError from '../../components/ServerError';

function Scanner({ navigation }) {
  const dispatch = useDispatch();
  const phoneNumber = useSelector(state => state.auth.phoneNumber)

  const snapPoints = useMemo(() => ['25%', '55%'], []);
  const isCamerPermission = useSelector(state => state.permissions.camera)
  const bottomSheetRef = useRef(null);
  const textInputRef = useRef(null);
  const [scannedData, setScannedData] = useState('');
  const [isAutoScan, setIsAutoScan] = useState(false)
  const [isRefresh, setIsRefresh] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [inputError, setInputError] = useState(false)
  const [errorMidalVisible, setErrorModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false)
  const [itemLoading, setItemLoading] = useState(false);
  const numberPattern = /[0-9]/;

  function validNumber(quantity) {
    return numberPattern.test(quantity);
  }



  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setScannedData('')
      setIsModalOpen(false)
    }
  }, []);




  const getItem = async (id) => {
    setIsNotFound(false)
    setItemLoading(true)
    const response = await axios.get(`${BASE_URL}/product/getItem`, { params: { id } }).then((res) => {
      setItemLoading(false)
      setItem('')
      setIsNotFound(false)

      console.log(res.data.data[0].productImage);
      setItem(res.data.data[0])
      setUnit(res.data.data[0].Units[0])
      console.log(res.data.data[0].Units[0]);
      setTotalPrice(res.data.data[0].price)
      setQuantity(1)
    }).catch((err) => {
      if (err.message === "Network Error") {
        setItemLoading(false)

        setErrorModalVisible(true)
        setScannedData('')
        setIsModalOpen(false)
      }
      else {
        setItemLoading(false)

        setIsNotFound(true)
      }
    })
  }

  const addToCart = async () => {
    setIsLoading(true)
    const Cart = {
      phoneNumber: phoneNumber,
      product: { ...item },
      quantity: quantity,
      unit: unit,
      totalPrice: totalPrice
    }
    const response = await axios.post(`${BASE_URL}/product/addToCart`, { Cart }).then((res) => {
      if (res.data) {
        console.log(res.data.cart);
        const cart = res.data.cart
        setScannedData('')
        setIsLoading(false)
        dispatch({ type: 'SET_CART_ITEMS', payload: cart })

        setIsModalOpen(false)
        setItem('')
        navigation.navigate('Cart')
      }

    }).catch((err) => {
      setIsLoading(false)
      if (err.message === "Network Error") {
        // dispatch({ type: 'faildToAdd', payload: 'server not respond' });
        setErrorModalVisible(true)

      } else {
        // dispatch({ type: 'faildToAdd', payload: 'invalid OTP' });
        setErrorModalVisible(true)
      }

    })
  }


  const checkCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission Required',
          message: 'This app needs access to your camera to scan QR codes.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        dispatch({ type: 'CAMERA_PERMISSION_GRANT' })
        setIsRefresh(false)

      } else {
        dispatch({ type: 'CAMERA_PERMISSION_FAIL' })
        setIsRefresh(false)




      }
    } catch (err) {
      dispatch({ type: 'CAMERA_PERMISSION_FAIL' })



    }
  };



  const openAppSettings = async () => {
    await Linking.openSettings();
    setIsRefresh(true)



  };
  const whoosh = new Sound('scannersound.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.error('Error loading sound:', error);
      // Handle the error gracefully, e.g., display an error message or disable the play button
    } else {
      whoosh.setVolume(0.5);
      // Proceed with playback
      console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

    }
  });
  const onScanSuccess = (e) => {
    setIsAutoScan(false)
    console.log("sound", isAutoScan);
    whoosh.play(); // Play the audio
    setScannedData(e.data);
    setIsModalOpen(true)
    // navigation.navigate('Cart')
    console.log("scan", e.data);
    getItem(e.data)
  };
  // const whoosh = new Sound('../../assets/sounds/scanningSound.mp3', Sound.MAIN_BUNDLE); // Load your audio file
  // whoosh.setVolume(0.5);

  const playAudio = async () => {

    whoosh.play(); // Play the audio
  };

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

  useEffect(() => {
    setScannedData('')

  }, [])


  return (



    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
      {isCamerPermission && <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>

        <Image source={require('../../assets/icons/qr-code-scan.png')} style={{ objectFit: 'fill', width: wp('80%'), height: hp('40%') }}></Image>
        <View style={{ width: wp('71%'), height: hp('36%'), top: hp('-38.1%'), left: 0, borderRadius: 10, overflow: 'hidden', opacity: 2, justifyContent: 'center', alignItems: 'center' }}>
          {!scannedData && <QRCodeScanner
            onRead={onScanSuccess}
            vibrate={false}
          > </QRCodeScanner>}
        </View>
        {errorMidalVisible && <ServerError isModalVisible={errorMidalVisible} setModalVisible={setErrorModalVisible} message={'Network Disconnected'} />}

        <Modal animationType="fade" onRequestClose={() => { setItem(''), setIsLoading(false); setScannedData(''); setIsModalOpen(false) }} visible={isModalOpen} transparent={true}>
          {/* <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', }}> */}
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
                {isNotFound ? <Image source={require('../../assets/images/notFound.png')} style={{ width: wp(70), height: wp(70) }}></Image> :
                  <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={{
                    width: wp('95'),
                    height: wp('78'),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    marginTop: 3,

                  }}>







                    {itemLoading && <View style={styles.itemShown}>



                      <View style={{ flexDirection: 'row' }}>


                        <SkeletonView
                          width={wp(39)}
                          height={wp(40)}
                          borderRadius={10}


                          style={{ margin: 8 }}
                        />


                        <View style={{ width: 200, flexDirection: 'column' }}>

                          <SkeletonView
                            width={wp(44)}
                            height={wp(5)}
                            borderRadius={10}
                            style={{ marginTop: 20, marginLeft: 20 }}
                          />

                          <SkeletonView
                            width={wp(35)}
                            height={wp(3)}
                            borderRadius={10}
                            style={{ marginTop: 15, marginLeft: 20 }}
                          />
                          <SkeletonView
                            width={wp(35)}
                            height={wp(5)}
                            borderRadius={10}
                            style={{ marginTop: 15, marginLeft: 20 }}
                          />
                          <SkeletonView
                            width={wp(35)}
                            height={wp(5)}
                            borderRadius={10}
                            style={{ marginTop: 15, marginLeft: 20 }}
                          />



                        </View>

                      </View>
                      <SkeletonView
                        width={wp(35)}
                        height={wp(5)}
                        borderRadius={10}
                        style={{ marginTop: 15, marginLeft: 20 }}
                      />

                      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 4 }}>
                        <SkeletonView
                          width={wp(50)}
                          height={wp(14)}
                          borderRadius={10}



                        />
                        <SkeletonView
                          width={wp(30)}
                          height={wp(14)}
                          borderRadius={10}
                          style={{ marginLeft: 2 }}


                        />

                      </View>

                    </View>}














                    {item && <View style={styles.itemShown}>



                      <View style={{ flexDirection: 'row' }}>

                        <Image style={styles.itemImage} source={{ uri: `${item.productImage}` }} />



                        <View style={{ width: 200, flexDirection: 'column' }}>

                          <Text style={{ marginTop: 20, fontSize: wp(7), marginLeft: 20, color: '#364956' }}>{item.productName}</Text>

                          <Text style={{ marginTop: 5, fontSize: wp(5), marginLeft: 20, color: '#364956' }}>Price:₹{item.price}/{item.Units[0]}</Text>
                          <Text style={{ marginTop: 5, fontSize: wp(5), marginLeft: 20, color: '#364956' }}>Quantity {quantity}{unit}</Text>
                          <Text numberOfLines={2} style={{ marginTop: 5, fontSize: wp(6), marginLeft: 20, color: '#364956' }}>Total price:</Text>
                          <Text numberOfLines={2} style={{ marginTop: 5, fontSize: wp(6), marginLeft: 20, color: '#364956' }}>₹{totalPrice}</Text>


                        </View>

                      </View>
                      <Text style={{ color: '#000', marginLeft: wp(9), fontSize: wp(5) }}>Enter Quantity</Text>

                      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 4 }}>
                        <TextInput ref={textInputRef} maxLength={5} keyboardType='numeric' value={quantity} placeholder='type here...' placeholderTextColor={'#000'} style={{ width: wp(50), color: '#000', borderColor: '#000', borderWidth: 2, borderRadius: 10, fontSize: wp(5), paddingLeft: 10 }} onChangeText={handleChange}></TextInput>
                        <SelectDropdown
                          defaultValue={unit}
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

                  </LinearGradient>}
                <View style={styles.buttons}>
                  {!isLoading && <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={{ ...styles.cancelBtn, width: item ? wp(45) : wp(98), height: wp(15), }}>
                    {/* <Icon source={require('../assets/icons/retry.png')}   size={25} tintColor={'white'}  /> */}


                    <TouchableOpacity style={{ ...styles.cancelBtn, width: item ? wp(43) : wp(96), }} onPress={() => { setIsAutoScan(true); setItem(''), setScannedData(''); setIsModalOpen(false); }}>
                      <Text style={{ color: '#000', fontSize: 15 }}>Cancel </Text>


                    </TouchableOpacity>

                  </LinearGradient>}
                  {item && <TouchableOpacity disabled={isLoading} style={{ ...styles.addBtn, width: isLoading ? wp(98) : wp(45) }} onPress={(() => {
                    const valid = validNumber(quantity);
                    if (valid) {
                      addToCart()
                    } else {
                      setInputError(false)
                    }
                  })}><LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={{ ...styles.addBtn, width: isLoading ? wp(98) : wp(45) }}>
                      {/* <Icon source={require('../assets/icons/retry.png')}   size={25} tintColor={'white'}  /> */}

                      <Text style={{ color: 'white', fontSize: 15 }}>{isLoading ? <ActivityIndicator size={'large'} color={'#fff'} />
                        : 'ADD+'}</Text>

                    </LinearGradient>


                  </TouchableOpacity>}
                </View>
              </View>

            </BottomSheet>

          </GestureHandlerRootView>


        </Modal>




      </View>}
      {!isCamerPermission && <View style={{ width: wp(100), height: wp(200), justifyContent: 'center', alignItems: 'center' }} >
        <Image source={require('../../assets/images/camera.png')} style={{ objectFit: 'fill', width: wp(35), height: wp(35) }}></Image>

        <Text style={{ color: '#364956', fontSize: wp(6) }}>Access camara permission</Text>

        <Text style={{ color: '#364956' }}><Icon source={require('../../assets/icons/settings.png')} size={25} tintColor={'#364956'} />{'Settings>Permissions>Camera>Select Allow'}  </Text>
        {!isRefresh && <TouchableOpacity style={styles.accessBtn}
          onPress={() => openAppSettings()} ><LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={styles.accessBtn}>

            <Icon source={require('../../assets/icons/access.png')} size={25} tintColor={'white'} />
            <Text style={{ color: 'white', marginLeft: 4, fontSize: wp(5) }}>Access</Text>
          </LinearGradient></TouchableOpacity>}
        {isRefresh && <TouchableOpacity style={styles.retryBtn}

          onPress={() => checkCameraPermission()} ><LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={styles.retryBtn}>
            <Icon source={require('../../assets/icons/retry.png')} size={25} tintColor={'white'} />

            <Text style={{ color: 'white', marginLeft: 4, fontSize: wp(5) }}>Refresh </Text>
          </LinearGradient></TouchableOpacity>}
      </View>}



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
  accessBtn: {
    width: wp('35'),
    height: hp('6'),
    alignItems: 'center',
    justifyContent: 'center',
    top: 1,
    borderRadius: 30,
    flexDirection: 'row',
    marginTop: 10,
    elevation: 15
  }, retryBtn: {
    width: wp('35'),
    height: hp('6'),
    alignItems: 'center',
    justifyContent: 'center',
    top: 1,
    borderRadius: 30,
    flexDirection: 'row',
    marginTop: 10,
    elevation: 15
  }, container2: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  }, itemShown: {
    width: wp('93'),
    height: wp('76'),
    backgroundColor: '#fff',
    borderRadius: 10,

  },
  itemImage: {
    width: wp(40),
    height: wp(40),
    objectFit: 'scale-down',
    borderRadius: wp(5),
    backgroundColor: 'white',
    marginLeft: wp(3),
    marginTop: wp(3)
  },
  buttons: {
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


  }, addBtn: {

    height: wp(15),
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 30,

  }

})

export default Scanner










