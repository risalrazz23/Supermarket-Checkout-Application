const initialState={
    phoneNumber:null,
    loading: false,
    isError: false,
    error:''
}


const OtpVerifyReducer=(state=initialState,action)=>{
    switch (action.type) {
        case 'SEND_OTP_VERIFY_REQUEST':
            return{...state,loading:true}
        case 'OTP_SUCCESS':
            return{...state,loading:false}
        case 'INVALID_OTP':
            return { ...state, loading:false, isError: true,error:action.payload };
        default:
            return state;
    }

}

export default OtpVerifyReducer;