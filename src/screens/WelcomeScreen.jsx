import React, { useRef, useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native-ui-lib'
import { SafeAreaView, StyleSheet, StatusBar, FlatList } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import welcomeScreenContent from '../constents/welcomeScreenContent'
import LinearGradient from 'react-native-linear-gradient'
import WelcomeCard from '../components/WelcomeCard'

// import welcomeScreenContent from '../contents/welcomeScreenContent'


const pageStyle = isActive => isActive ? ['#0051ff', '#0051ff', '#7ad2dd']
  : ['#64869e', '#64869e', '#64869e']


const Pagination = ({ welcomeListIndex }) => {

  return (
    <View style={styles.PaginationContainer}>

      {[...Array(welcomeScreenContent.WELCOME_CONTENTS.length).keys()].map((_, i) => {
        return (
          <LinearGradient
            key={i}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={pageStyle(i === welcomeListIndex)}
            style={styles.Pagination}
          />
        )
      })}




    </View>
  )
}



const WelcomeScreen = ({ navigation }) => {

  const [welcomeListIndex, setWelcomeListIndex] = useState(0)
  const welcomeList = useRef()
  const onViewRef = useRef(({ changed }) => {
    console.log(changed[0].index)
    setWelcomeListIndex(changed[0].index);
  })

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })




  //This function for to scroll when click next button
  const pageScroll = () => {

    welcomeList.current.scrollToIndex({
      index: welcomeListIndex < 2 ? welcomeListIndex + 1 : welcomeListIndex,
    })

    if (welcomeListIndex == 2) {
      navigation.navigate('Login')
    }
  }


  return (

    <View style={styles.Container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#FFFFFF'} />


      <View style={styles.WelcomeContainer}>

        <FlatList
          ref={welcomeList}
          data={welcomeScreenContent.WELCOME_CONTENTS}
          keyExtractor={item => item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          overScrollMode='never'
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewRef.current}
          renderItem={({ item }) => {
            return (

              <WelcomeCard title={item.title} description={item.description} image={item.image} />
            )

          }} />
        <Pagination welcomeListIndex={welcomeListIndex} />

      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.skipBtn} activeOpacity={0.3} onPress={() => welcomeList.current.scrollToEnd()}>
        {welcomeListIndex != 2 && <View style={styles.btnGradient}   >
            <Text style={styles.skip}>skip</Text>
          </View>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} activeOpacity={0.3} onPress={() => pageScroll()}>
          <LinearGradient start={{ x: 0, y: 1 }} style={styles.btnGradient} end={{ x: 1, y: 0 }} colors={['#0051ff', '#0051ff', '#7ad2dd']}  >
            <Text style={styles.next}>{welcomeListIndex == 2 ? 'Get ready' : 'NEXT'}</Text>
          </LinearGradient>
        </TouchableOpacity>


      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,

    backgroundColor: '#FFFFFF',
  },
  WelcomeContainer: {
    height: hp('80%')
  },
  PaginationContainer: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  Pagination: {
    width: wp('7%'),
    height: hp('1.5%'),
    borderRadius: 10,

    marginHorizontal: 5
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    height: hp('20%'),
    bottom:10
  },
  nextBtn: {
    width: wp('35%'),
    height: ('30%'),
    borderRadius: 30,
    marginTop: 90,
    opacity: 0.9,
    marginRight: 6,
  },
  skipBtn: {
    width: wp('35%'),
    height: ('30%'),

    marginTop: 90,
    opacity: 0.9,
    marginRight: 6,
  },
  btnGradient: {
    width: wp('35%'),
    height: ('100%'),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',

  },
  skip: {
    color: '#364956',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 0
  },
  next: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',

  }

})

export default WelcomeScreen