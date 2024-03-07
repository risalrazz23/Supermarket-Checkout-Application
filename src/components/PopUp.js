import React,{useState} from 'react'
import { Modal,View,Text,TouchableOpacity,ActivityIndicator } from 'react-native'
import { LoaderScreen } from 'react-native-ui-lib'
import Loader from './Loader';
import { useSelector } from 'react-redux';
function PopUp({isLoading,message}) {
  const [indicatorColor, setIndicatorColor] = useState('#0051ff');


  setTimeout(() => {
    if(indicatorColor=='#0051ff'){
      setIndicatorColor('#7ad2dd')
    }else{

      setIndicatorColor('#0051ff'); 
    }
  },900);

  return (
    <Modal  animationType="fade" visible={isLoading} transparent={true} >
        <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center',alignItems:'center'}}>
        <View style={{width:300,height:100,backgroundColor:'white',borderRadius:10,justifyContent:'flex-start',alignItems:'center',flexDirection:'row',}}>
             
             <Loader size={50} style={true} />
        <Text style={{color:'#364956',fontWeight:'600',fontSize:18,marginLeft:13}} >{message}</Text>

          </View>
        
          
        </View>
      </Modal>
  )
}

export default React.memo(PopUp);