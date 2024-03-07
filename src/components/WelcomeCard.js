import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

function WelcomeCard({ title, description, image }) {
  return (
    <View style={styles.Container}>
      <Image style={styles.Image} source={image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

    </View>
  )
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    width: wp('100%'),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Image: {
    width: hp('40%'),
    height: hp('40%'),

  },
  title: {
    color: '#364956',
    fontSize: 24,
    fontFamily: 'Kalnia-Medium',
    textAlign: "center",

  },
  description: {
    fontSize: 18,
    color: '#64869e',
    textAlign: "center",
    marginTop: 20,
    marginHorizontal: 3,
    fontFamily: 'Kalnia',
    lineHeight: 18 * 1.4,

  }
})

export default WelcomeCard