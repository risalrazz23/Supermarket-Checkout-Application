import 'react-native-gesture-handler';
import React, { useEffect } from 'react'
import { Text, View ,StyleSheet,} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import Login from './src/screens/Auth/Login';
import Otp from './src/screens/Auth/Otp';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import authReducer from './src/redux/reducers/authReducer';


const Stack = createStackNavigator();


function App() {
  const isLogin = useSelector(state => state.auth.isLogin)
  const splash = useSelector(state => state.auth.splash)

  useEffect(()=>{
    
  })
  return (
    


    <NavigationContainer  screenOptions={{ headerShown: false,
      styles:{
        backgroundColor:'#FFFFFF'
      }
       }} >
         
    
          <Stack.Navigator initialRouteName='SplashScreen'>
             

           {!splash&&<Stack.Screen

              name='SplashScreen'
              component={SplashScreen}
              options={{ headerShown: false }}
              />}

              {!isLogin&&<Stack.Screen
              name='WelcomeScreen'
              component={WelcomeScreen}
              options={{ headerShown: false }}
              />}
              {!isLogin&&<Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />}
               {!isLogin&&<Stack.Screen 

              name='Otp'
              component={Otp}
              options={{headerShown:true,title:"",headerBackTitle:"Back",headerBackTitleStyle:{fontWeight:'bold'},headerBackTitleVisible:true}}

              />}
              {isLogin&&<Stack.Screen 
              name='HomeScreen'
              component={HomeScreen}
              options={{headerShown:false,presentation:'transparentModal'}}

              />}
              </Stack.Navigator>

      </NavigationContainer>
 

    
  )
}


const styles = StyleSheet.create({
 appContainer:{
  flex:1,
  backgroundColor:'rgb(255,255,255)'
 }
});

export default App
