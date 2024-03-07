import React, { useEffect, useState } from 'react'
import { Text, View, Image } from 'react-native-ui-lib'
import { SectionList, StatusBar, StyleSheet } from 'react-native'
import { Carousel,SkeletonView } from 'react-native-ui-lib';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-ui-lib';
import { useDispatch,useSelector } from 'react-redux';
const IMAGES = [
    'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
];
const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'];


function ProductList() {

    const[seconds,setSeconds]=useState(60)
    const[minutes,setMinutes]=useState(0)
    const dispatch=useDispatch()
    const getTime =setTimeout(() => {
        // Function to execute after 1 minute
        console.log('Function executed after 1 minute');
      },60000);
    //    clearInterval(interval);

    getTime 
    const isLogin = useSelector(state => state.auth.isLogin)
    
    useEffect(()=>{
        
      console.log("loginn",isLogin);
         
          
          dispatch({type:'OTP_SUCCESS'})

       
    },[])
    return (
        <View style={styles.Container} >
            <StatusBar barStyle={'dark-content'} backgroundColor={'#FFFFFF'} />
            <ScrollView showsVerticalScrollIndicator={false} >

                <Carousel containerStyle={styles.CarouselContainer}
                
                    pageControlProps={styles.pageControl}
                    pageControlPosition={Carousel.pageControlPositions.OVER}
                    showCounter
                    initialPage={1}
                
                    >

                    {IMAGES.map((image, i) => (
                        <View flex centerV key={i} >

                            <Image
                                overlayType={Image.overlayTypes.BOTTOM}
                                style={styles.CarouselImage}
                                source={{
                                    uri: image
                                }}
                            />
                        </View>
                    ))}


                </Carousel>
                
                <SkeletonView
  template={SkeletonView.templates.LIST_ITEM}
  showContent={true}
  renderContent={<View style={styles.ProductBox}>

</View>}
  times={10}
/>
                <View style={styles.ProductContainer}>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {items.map((item) => (
                            <SkeletonView
                       width= {wp('44%')}
                       height= {hp('25%')}
                       colors={['#ececec', '#d3d3d3']}
                       speed={800}
                       gradientDirection={"vertical"}
                    //    locations={[0, 0.75]} // First color takes 0-75%
                      borderRadius={10}
                      

                      style={styles.ProductBox}
                    />
                        ))}
                    </View>

                </View>

                <View style={styles.ProductContainer}>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {items.map((item) => (
                            <View style={styles.ProductBox}>

                            </View>
                        ))}
                    </View>

                </View>
                <View style={{...styles.ProductContainer,marginBottom:100}}>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {items.map((item) => (
                            <View style={styles.ProductBox}>

                            </View>
                        ))}
                    </View>

                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFFFFF',

    },
    CarouselContainer: {
        height: hp('29%'),
        borderRadius: 20,
        marginTop: hp('1'),
        margin: 5,
        overflow: 'hidden',
        bottom: 0,
        elevation: 30
    },
    pageControl: {
        size: wp(3),
        containerStyle: {
            position: 'absolute',
            bottom: 15,
            alignSelf: 'center'

        }

    },
    CarouselImage: {
        flex: 1,
        height: hp('40%')

    },
    ProductContainer: {
        flex: 1,
        width: wp('97'),
        height: hp('86'),
        borderRadius: 20,
        elevation: 30,
        marginTop: hp('2'),
        marginHorizontal:wp('2'),
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingTop: hp('1%')
    },
    ProductBox: {
        width: wp('44%'),
        height: hp('25%'),
        backgroundColor: '#FFFFFF',
        elevation: 15,
        marginVertical: hp('1%'),
        marginHorizontal: wp('2.2%'),
        borderRadius: 10
    }
})

export default ProductList