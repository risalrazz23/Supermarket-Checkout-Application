import React, { useEffect, useRef, useState } from 'react'
import { Text, View, StatusBar, StyleSheet,Modal, TouchableOpacity } from 'react-native'
import { Image, TextField } from 'react-native-ui-lib'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import PopUp from '../../components/PopUp'
import ServerError from '../../components/ServerError'
import { State, TextInput } from 'react-native-gesture-handler'
import { BASE_URL } from '@env'
import { Icon } from 'react-native-ui-lib'
function Login({ navigation }) {

    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.OtpRequest.loading)
    const [isModalVisible,setModalVisible]=useState(false)
    const error = useSelector(state => state.OtpRequest.error)

    const [phoneNumber, setPhoneNumber] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const MobileNumberPattern = /^[0-9]{10}$/;

    function isValidMobileNumber(phoneNumber) {
        return MobileNumberPattern.test(phoneNumber);
    }
    const handleChange = (phoneNumber) => {
        setPhoneNumber(phoneNumber)
        setIsValid(isValidMobileNumber(phoneNumber));
        if (!isValid) {
            setErrorMessage("! Invalid number")
        }
        if (phoneNumber.length == 0) {
            setErrorMessage("This field is required")
        }
        if (isValid) {
            return setErrorMessage('')
        }

    }


    const setNumber = () => {
        if (phoneNumber.length == 0) {
            return setErrorMessage("This field is required")
        }

        setIsValid(isValidMobileNumber(phoneNumber));
        if (!isValid) {
            setErrorMessage("! Invalid number")
        }
        if (isValid) {
            dispatch({ type: 'SET_PHONE_NUMBER', payload: phoneNumber })
            sendOTP()
        }
    }



    const sendOTP = async () => {


        // console.log(phoneNumber, isValid);
        if (isValid) {
            dispatch({ type: 'SEND_OTP_REQUEST' })
            setModalVisible(false)
            const response = await axios.post(`${BASE_URL}/auth/sendOTP`, { phoneNumber }).then((res) => {
                console.log(res.data);
                if (res.data.success === true) {
                    dispatch({ type: 'SEND_OTP_SUCCESS' })
                    navigation.navigate('Otp')
                }
            }).catch((err) => {
                console.log(err.message);
                if (err.message === "Network Error") {
                    dispatch({ type: 'SEND_OTP_FAILURE', payload: 'Network Disconnected' });
                    setModalVisible(true)

                } else {
                    dispatch({ type: 'SEND_OTP_FAILURE', payload: 'failed' });
                 
                    setModalVisible(true)
                }
            })

        }



    }


    return (
        <View style={styles.Container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#FFFFFF'} />

            <View style={styles.LoginContainer}>

                <Image style={styles.Image} source={require('../../assets/images/login.jpeg')} ></Image>
                <Text style={styles.GetStart}>Get start</Text>

                <LinearGradient start={{ x: 0, y: 1 }} style={styles.TextFieldContainer} end={{ x: 1, y: 0 }} colors={['#0051ff', '#0051ff', '#7ad2dd']}  >

                    <View style={styles.TextFieldContainer2}  >

                        <TextInput

                            placeholder={'Enter mobile number...'}
                            keyboardType={'number-pad'}
                            placeholderTextColor={'#364956'}
                            color={'black'}
                            maxLength={10}
                            style={styles.TextField}
                            onChangeText={handleChange}
                            value={phoneNumber}
                        />
                    </View>
                </LinearGradient>
                {!isValid && errorMessage.length > 0 ? <Text style={{ alignSelf: 'flex-start', fontSize: 17, marginLeft: 30, marginBottom: 10, marginTop: 2, color: 'red' }}>{errorMessage}</Text> : null}
                <TouchableOpacity style={styles.nextBtn} activeOpacity={0.5} onPress={setNumber}>
                    <LinearGradient start={{ x: 0, y: 1 }} style={styles.btnGradient} end={{ x: 1, y: 0 }} colors={['#0051ff', '#0051ff', '#7ad2dd']}  >
                        <Text style={styles.next}>Get OTP    </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
           
            {isLoading && <PopUp isLoading={isLoading} message={"Sending OTP..."} />}
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

    GetStart: {
        color: '#364956',
        fontSize: 30,
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
        fontSize: 18
    },
    nextBtn: {
        width: wp('90%'),
        height: hp('18%'),
        borderRadius: 30,
        marginTop: 10,
        opacity: 0.9,


    },
    btnGradient: {
        width: wp('90%'),
        height: ('40%'),
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

export default Login