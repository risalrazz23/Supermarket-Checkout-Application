import React,{useState,useEffect} from 'react'
import { ActivityIndicator } from 'react-native';

function Loader({size,style}) {
    const [color, setColor] = useState('#0051ff');
    setTimeout(() => {
        if(color=='#0051ff'){
          setColor('#7ad2dd')
        }else{
    
          setColor('#0051ff'); 
        }
      },900);
     
  return (
    <ActivityIndicator size={size} color={color} style={style&&{marginLeft:13}} /> 
    
  )
}

export default Loader