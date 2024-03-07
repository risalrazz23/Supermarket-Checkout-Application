import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as Keychain from 'react-native-keychain';
import { useDispatch ,useSelector} from 'react-redux'
import { Icon } from 'react-native-ui-lib'
function Settings({navigation}) {


  const dispatch=useDispatch();
  const isLogin = useSelector(state => state.auth.isLogin)
  const phoneNumber=useSelector(state=>state.auth.phoneNumber)
 async function logOut(){
      await Keychain.resetGenericPassword()
      dispatch({type:'RESET_TOKEN'})
      if(isLogin){

        navigation.navigate('Login')
      }
  }
  return (
    <View style={styles.Container}>
      <LinearGradient start={{ x: 0, y: 1 }} style={styles.ProfileContainer} end={{ x: 1, y: 0 }} colors={['#0051ff', '#0051ff', '#7ad2dd']}  >
      <View style={styles.ProfileImg}>
        <Image style={styles.Profile} source={require('../../assets/images/profile.png')} />
      </View>
     
      </LinearGradient>
      <Text style={{color:'#364956',fontSize:wp(7),fontWeight:'bold',marginBottom:10}}>{phoneNumber}</Text>
      <LinearGradient start={{ x: 0, y: 1 }} style={styles.Settings} end={{ x: 1, y: 0 }} colors={['#0051ff', '#0051ff', '#7ad2dd']}  >

        <TouchableOpacity style={styles.SettingsBtn}  >
        <Icon source={require('../../assets/icons/question.png')} size={30}  style={{  marginLeft: 10 }} />
           <Text style={{color:'#364956',fontWeight:'bold',marginLeft: 10,fontSize:wp(6)}}>Tutorial </Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient start={{ x: 0, y: 1 }} style={styles.Settings} end={{ x: 1, y: 0 }} colors={['#0051ff', '#0051ff', '#7ad2dd']}  >
        
        <TouchableOpacity style={styles.SettingsBtn} onPress={logOut} >
        <Icon source={require('../../assets/icons/logout.png')} size={30} tintColor={'#364956'} style={{  marginLeft: 10 }} />
           <Text style={{color:'#364956',fontWeight:'bold',marginLeft: 10,fontSize:wp(6)}}>Log Out </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
    width: wp('100%'),
    height: hp('100%'),
    alignItems: 'center'
  },
  ProfileContainer: {
    width: wp(66),
    height: wp(66),
    borderRadius: wp('50%'),
    marginTop: 40,
marginBottom:40,
justifyContent:'center',
alignItems:'center'
  },
  ProfileImg: {
    width: wp(66),
    height: wp(66),
    // backgroundColor:'blue',
    borderRadius: wp('50%'),
    alignItems:'center',
    justifyContent:'center'
    
  },
  Profile: {
    width: wp(63),
    height: wp(63),
    borderRadius: wp('50%'),
  },
  Settings: {
    width: wp('90%'),
    height: hp('10%'),
    backgroundColor: 'black',
    borderRadius: 20,
    marginTop: 7,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  },
  SettingsBtn: {
    width: wp('88%'),
    height: hp('9%'),
    backgroundColor: 'black',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems:'center',
    flexDirection:'row'
  }

})
export default Settings