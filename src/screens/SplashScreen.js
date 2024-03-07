import React, { useEffect, useState, memo, useMemo } from 'react'
import { ActivityIndicator, StatusBar, StyleSheet, PermissionsAndroid } from 'react-native'
import { Image, Text, View } from 'react-native-ui-lib'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view';
import * as Keychain from 'react-native-keychain';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '@env'
import Loader from '../components/Loader'
import ServerError from '../components/ServerError'
import { useNavigation } from '@react-navigation/native';

function SplashScreen() {
  const navigation = useNavigation()
  const isCamerPermission = useSelector(state => state.permissions.camera)

  const [color, setColor] = useState('#0051ff');
  const [isModalVisible, setModalVisible] = useState(false)

  const dispatch = useDispatch()


  setTimeout(() => {
    if (color == '#0051ff') {
      setColor('#7ad2dd')
    } else {

      setColor('#0051ff');
    }
  }, 900);



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
        console.log("permission");
        dispatch({ type: 'CAMERA_PERMISSION_GRANT' })


      } else {
        dispatch({ type: 'CAMERA_PERMISSION_FAIL' })





      }
    } catch (err) {
      dispatch({ type: 'CAMERA_PERMISSION_FAIL' })



    }
  };

  const verifyAuth = async () => {
    await checkCameraPermission();

    const credentials = await Keychain.getGenericPassword();

    if (credentials.password) {

      const token = credentials.password
      const phoneNumber = credentials.username
      console.log("token", token);

      const response = await axios.post(`${BASE_URL}/auth/verifyingAuth`, { token: token, phoneNumber: phoneNumber })
        .then(res => {
          console.log(res.status);
          console.log(res.data);
          if (res.status === 200) {
            const cart = res.data.cart
            dispatch({ type: 'SET_LOGIN_CREDENTIALS', payload: { token, phoneNumber } })
            dispatch({ type: 'SET_CART_ITEMS', payload: cart })
            dispatch({type:'SPLASH',payload:true})
            return navigation.navigate('HomeScreen');

          }
        })
        .catch(error => {
          // Navigate to the WelcomeScreen
          if (error.message === "Network Error") {

            setModalVisible(true)
          } else {
            console.log(error.message);
            navigation.navigate('WelcomeScreen');
          }

        });
    }
    else {
      dispatch({type:'SPLASH',payload:true})

      return navigation.navigate('WelcomeScreen');
      
    }

  }


  useEffect(() => {
   
      verifyAuth();
    
  },[]);
  return (
    <View style={styles.conatiner}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'}></StatusBar>
      <Image style={styles.image} source={require('../assets/images/logo.png')} />
      <MaskedView style={{ marginTop: -17 }} maskElement={
        <Text style={styles.title}>Cart Pay</Text>

      }>

        <LinearGradient
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0051ff', '#0051ff', '#7ad2dd', '#7ad2dd']}


        >
          <Text style={{ fontSize: 60, opacity: 0, fontFamily: 'Kalnia-Bold' }}>Cart Pay </Text>

        </LinearGradient>
      </MaskedView>

      {isModalVisible ? <ServerError isModalVisible={isModalVisible} setModalVisible={setModalVisible} verifyAuth={verifyAuth} message={"Network Disconnected"} /> : <View style={{ width: wp('50%'), height: hp('5%'), marginTop: 100, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>

        <Loader size={40} style={false} />
        <Text>Loading...</Text>

      </View>}

    </View>
  )
}
const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: wp('80'),
    height: wp('60'),
    marginTop: hp('10')
  },
  title: {
    color: '#000',
    textAlign: 'center',
    fontSize: wp('10'),
    fontFamily: 'Kalnia-Bold',
    backgroundColor: 'transparent',
  }
})
export default SplashScreen