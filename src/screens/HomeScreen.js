import React, { useEffect } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductList from './Tabs/ProductList';
import Cart from './Tabs/Cart';
import Scanner from './Tabs/Scanner';
import Orders from './Tabs/Orders';
import Settings from './Tabs/Settings';
import TabBtn from '../components/TabBtn';
import * as Keychain from 'react-native-keychain';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();
function HomeScreen({navigation}) {
     

   
    return (
        <View style={styles.Container}>
            <Tab.Navigator screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBarStyle,
                tabBarShowLabel: false
            }} initialRouteName='ProductList'
            
            >
            
                <Tab.Screen
                    
                    name='ProductList'
                    component={ProductList}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return <TabBtn focused={focused} image={require('../assets/icons/home.png')} />
                        }
                    }}

                />

                <Tab.Screen
                    name='Cart'
                    component={Cart}
                    
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return <TabBtn focused={focused} image={require('../assets/icons/cart.png')} />
                        }
                    }}

                />

                <Tab.Screen

                    name='Scanner'
                    component={Scanner}
                    
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#0051ff', '#0051ff', '#7ad2dd']} style={styles.tabScannerBtn}>
                                <Image source={require('../assets/icons/scanner.png')}
                                    resizeMode='contain'
                                    style={{
                                        width: wp('10%'),
                                        height: hp('10%'),
                                        tintColor: '#FFFFFF',
                                    }}
                                />

                            </LinearGradient>
                            
                        }
                    }}

                />
                <Tab.Screen
                    name='Orders'
                    component={Orders}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return <TabBtn focused={focused} image={require('../assets/icons/orders.png')} />
                        }
                    }}

                />
                <Tab.Screen
                    name='Settings'
                    component={Settings}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return <TabBtn focused={focused} image={require('../assets/icons/settings.png')} />
                        }
                    }}

                />


            </Tab.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    tabBarStyle: {
        height: 80,
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        bottom: 0
    },
    tabScreen: {
        width: 70,
        height: 50,
        alignItems:
            'center',
        justifyContent: 'center',
        top: 1, bottom: 40
    },
    tabScannerBtn: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        top: -30,
        bottom: 40,
        borderRadius: 50
    }

})


export default HomeScreen