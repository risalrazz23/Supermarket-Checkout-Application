import React, { useRef, useMemo, useCallback } from 'react'
import { View, Text, Button, Image } from 'react-native-ui-lib';
import {BottomSheet} from '@gorhom/bottom-sheet';
import Loader from './Loader';
import { ActivityIndicator, Touchable } from 'react-native';
import { StyleSheet,Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { TouchableOpacity } from 'react-native-gesture-handler';


 function BottomPopUpSheet() {
  const bottomSheetRef = useRef(null);

  const onScanSuccess = (e) => {

    setScannedData(e.data);
    // navigation.navigate('Cart')
  };
  bottomSheetRef.current?.expand();
  const closeBottomSheet = () => {
    bottomSheetRef.current.close();
  };
  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      // isVisible={true}
      enablePanDownToClose={true}
    >
      {/* <View style={{flex: 1,alignItems: 'center',justifyContent:'center'}}> */}
      {/* <Loader size={60}/>
    <Text style={{color:'#364956',fontSize:15}}>Loading...</Text> */}

      {/* </View> */}

      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={styles.itemShown}>
          <Image style={styles.itemImage} source={require('../assets/images/logo.png')} />

        </View>
        <View style={styles.buttons}>
         <TouchableOpacity style={styles.cencelBtn}>
        <Text style={{color:'white',fontSize:15}}>Cencel</Text> 

         </TouchableOpacity>
         <TouchableOpacity style={styles.addBtn}>
        <Text style={{color:'white',fontSize:15}}>ADD+</Text> 

         </TouchableOpacity>
        </View>
      </View>

    </BottomSheet>

 
  )
}

export default BottomPopUpSheet
const styles = StyleSheet.create({
  itemShown: {
    width: wp('95'),
    height: hp('34'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(10),
    elevation:5,
    borderColor:'#000',
    borderWidth:2,
    marginBottom:5
  },
  itemImage:{
    width:wp('40'),
    height:wp('40'),
    borderRadius:wp(5),
    backgroundColor:'white',
    marginLeft:wp(3),
    marginTop:wp(3)
  },
  buttons:{
    width:wp(95),
   height:hp(10),
  //  backgroundColor:'blue',
   flexDirection:'row',
  //  justifyContent:'center',
   alignItems:'center'
  },
  cencelBtn:{
    width:wp('20'),
    height:wp(10),
    backgroundColor:'blue',
    alignSelf:'flex-start',
    marginLeft:20
    
  },addBtn:{
    width:wp('20'),
    height:wp(10),
    backgroundColor:'blue',
    alignSelf:'flex-end'
  }
  
})