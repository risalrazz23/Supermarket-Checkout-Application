import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Image,StyleSheet } from 'react-native'
import { widthPercentageToDP as wp ,heightPercentageToDP as hp } from 'react-native-responsive-screen'
function TabBtn({image,focused}) {
  return (
    <LinearGradient start={{x: 0, y: 1}} end={{x: 1, y: 1}} colors={focused?[ '#0051ff','#0051ff','#7ad2dd']:['#fff','#fff','#fff']} style={styles.tabBtn}>
                    <Image source={image} 
                    resizeMode='contain'
                    style={{
                        width:wp('7%'),
                        height:hp('7%'),
                        tintColor:focused ?'#fff':'#364956',
                    }}
                     />
                    
    </LinearGradient>
    

    
  )
}


const styles=StyleSheet.create({
    tabBtn:{
        width:wp('20'),
        height:hp('6'),
        alignItems:'center',
        justifyContent:'center',
        top:1,
        borderRadius:30
    },
    
})

export default TabBtn