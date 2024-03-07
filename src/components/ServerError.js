import React, { useEffect, useState } from 'react'
import { Modal, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { LoaderScreen, Text, Icon } from 'react-native-ui-lib'
import { useSelector } from 'react-redux'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
function ServerError({ isModalVisible, verifyAuth, setModalVisible, message }) {


  const action = () => {
    if (verifyAuth !== undefined) {
      verifyAuth();

    }
    setModalVisible(false)

  }


  return (
    <Modal animationType="fade" visible={isModalVisible} transparent={true} >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 300, height: 120, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
          <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', }}>
            <Icon source={require('../assets/icons/error2.png')} style={{ width: 20, height: 20 }} size={32} tintColor={'red'} />
            <Text style={{ color: 'red', fontWeight: '600', fontSize: 18, marginLeft: 7 }} >{message}</Text>
          </View>
          <TouchableOpacity style={styles.retryBtn} onPress={action}><LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={styles.retryBtn}>
            <Icon source={require('../assets/icons/retry.png')} size={25} tintColor={'white'} />

            <Text style={{ color: 'white', marginLeft: 4, fontSize: 20 }}>Retry </Text>


          </LinearGradient></TouchableOpacity>




        </View>




      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  retryBtn: {
    width: wp('36'),
    height: hp('6'),
    alignItems: 'center',
    justifyContent: 'center',
    top: 1,
    borderRadius: 30,
    flexDirection: 'row'

  },

})
export default ServerError;