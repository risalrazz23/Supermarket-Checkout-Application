import axios from "axios";
export const sendOTP=(phoneNumber)=>async(dispatch)=>{
try{
    dispatch({type:'SEND_OTP_REQUEST'})
    await axios.post('http://192.168.164.73:3000/api/send-otp', { phoneNumber });

    dispatch({type:'SEND_OTP_SUCCESS'})
}
catch(error){
    dispatch({ type: 'SEND_OTP_FAILURE', payload: error.message });
  }
}
