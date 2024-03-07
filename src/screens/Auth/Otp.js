import React, { useEffect, useState } from 'react'
import { Text, View, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import { Image, TextField } from 'react-native-ui-lib'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
import axios from 'axios'
import { TextInput, } from 'react-native-gesture-handler'
import * as Keychain from 'react-native-keychain';
import constants from 'react-native-ui-lib/src/commons/Constants'
import { useDispatch, useSelector } from 'react-redux'
import PopUp from '../../components/PopUp'
import ServerError from '../../components/ServerError'
import Login from './Login'
import { BASE_URL } from '@env'

function Otp({ navigation }) {
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.OtpVerify.loading)

  const error = useSelector(state => state.OtpVerify.error)
  const [isModalVisible, setModalVisible] = useState(false)

  const phoneNumber = useSelector(state => state.auth.phoneNumber)
  const isLogin = useSelector(state => state.auth.isLogin)
  const [OTP, setOTP] = useState('')
  const [isResend, setIsResend] = useState(false)

  const [isValid, setIsValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const numberPattern = /^[0-9]{6}$/;

  function isValidOtpNumber(OTP) {
    return numberPattern.test(OTP);
  }
  const handleChange = (OTP) => {
    setOTP(OTP)
    const valid = isValidOtpNumber(OTP)
    setIsValid(valid);
    if (!valid) {
      setErrorMessage("Please enter a 6-digit code")
    }
    if (OTP.length == 0) {
      setErrorMessage("Please enter a 6-digit code")
    }
    if (valid) {
      return setErrorMessage('')
    }

  }


  const setNumber = (OTP) => {
    if (OTP.length == 0) {
      return setErrorMessage("Please enter a 6-digit code")
    }

    setIsValid(isValidOtpNumber(OTP));
    if (!isValid) {
      setErrorMessage("Please enter a 6-digit code")
    }
    if (isValid) {
      verifyOTP();
    }
  }
  const verifyOTP = async () => {

    dispatch({ type: 'SEND_OTP_VERIFY_REQUEST' })
    const response = await axios.post(`${BASE_URL}/auth/verifyOTP`, { phoneNumber, OTP }).then(async (res) => {
      const token = res.data.token;
      const cart = res.data.cart
      if (res.data.verify == true) {
        await Keychain.setGenericPassword(phoneNumber, res.data.token);
        dispatch({ type: 'SET_LOGIN_CREDENTIALS', payload: { isLogin, phoneNumber, token } })
        dispatch({ type: 'SET_CART_ITEMS', payload: cart  })
        const credentials = await Keychain.getGenericPassword();
        console.log('Credentials successfully stored', credentials);
        navigation.navigate('HomeScreen')
      }

    }).catch((err) => {

      if (err.message === "Network Error") {
        dispatch({ type: 'INVALID_OTP', payload: 'Network Disconnected' });
        setModalVisible(true)

      } else {
        dispatch({ type: 'INVALID_OTP', payload: 'invalid OTP' });
        setModalVisible(true)
      }
    })

  }
 
  useEffect(() => {
    const intervalId = setInterval(() => {
     setIsResend(true)
    }, 60000); // 60000 milliseconds is 1 minute
  
    return () => clearInterval(intervalId);
  }, []);
  


  return (

    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#FFFFFF'} />

      <View style={styles.LoginContainer}>

        <Image style={styles.Image} source={require('../../assets/images/Otp.jpeg')} ></Image>
        {/* <Text style={styles.GetStart}>Get start</Text> */}
        <Text style={styles.OtpVerification}>OTP verification</Text>
        <Text style={styles.OTPMessage}>OTP code send to your number  </Text>
        <Text style={{ ...styles.OTPMessage, marginTop: 5, marginBottom: 10, }}>+91 {phoneNumber}</Text>

        <LinearGradient start={{ x: 0, y: 1 }} style={styles.TextFieldContainer} end={{ x: 1, y: 0 }} colors={['#0051ff', '#0051ff', '#7ad2dd']}  >

          <View style={styles.TextFieldContainer2}  >

            <TextInput
              placeholder={'Enter 6 digit number...'}
              keyboardType={'number-pad'}
              placeholderTextColor={'#364956'}
              maxLength={6}
              centered={true}
              onChangeText={handleChange}
              style={styles.TextField}

            />
          </View>
        </LinearGradient>
        {!isValid && errorMessage.length > 0 ? <Text style={{ alignSelf: 'flex-start', fontSize: 17, marginLeft: 30, marginBottom: 10, marginTop: 2, color: 'red' }}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.nextBtn} activeOpacity={0.3} onPress={() => setNumber(OTP)}>
          <LinearGradient start={{ x: 0, y: 1 }} style={styles.btnGradient} end={{ x: 1, y: 0 }} colors={['#0051ff', '#0051ff', '#7ad2dd']}  >
            <Text style={styles.next}>Verify    </Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ width: wp(100), height: wp(10),marginTop:30,marginBottom:30,flexDirection:'row'  }}>
          <Text style={{fontSize:20,color:'#364956',marginLeft: 25,fontWeight: 'bold'}}>Didn't get OTP?{' '} </Text>
          {isResend && <TouchableOpacity activeOpacity={0.3} onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#1867D3', fontSize: 20, marginLeft: 1, fontWeight: 'bold' }}>Resend code   </Text>
          </TouchableOpacity>}
        </View>
       
      </View>

      {isLoading && <PopUp isLoading={isLoading} message={"Verifiying OTP..."} />}
      {isModalVisible && <ServerError isModalVisible={isModalVisible} setModalVisible={setModalVisible} message={error} />}


    </View>
  )
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#FFFFFF',

  },
  Image: {
    width: wp('90'),
    height: wp('90'),
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30
  },
  LoginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  OtpVerification: {
    color: '#364956',
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 20
  },
  OTPMessage: {
    color: '#364956',
    marginTop: 10,
    fontSize: 17,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 20
  },
  TextFieldContainer: {
    width: wp('90%'),
    height: hp('8%'),
    backgroundColor: 'black',
    borderRadius: 20,
    marginTop: 7,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  },
  TextFieldContainer2: {
    width: wp('88%'),
    height: hp('7%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  TextField: {
    width: wp('80%'),
    height: hp('8%'),
    fontSize: 18,
    color: '#364956'
  },
  nextBtn: {
    width: wp('90%'),
    height: wp('15%'),
    borderRadius: 30,
    marginTop: 10,
    opacity: 0.9,
    backgroundColor: 'red'

  },
  btnGradient: {
    width: wp('90%'),
    height: wp('15%'),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  next: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',

  },

})
export default Otp