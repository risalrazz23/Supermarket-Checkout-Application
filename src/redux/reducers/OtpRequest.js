const initialState={
    loading: false,
    error:''
}


const OtpRequestReducer=(state=initialState,action)=>{
    switch (action.type) {
        case 'SEND_OTP_REQUEST':
            return{...state,loading:true}
        case 'SEND_OTP_SUCCESS':
            return{...state,loading:false}
        case 'SEND_OTP_FAILURE':
            return { loading:false ,error:action.payload};
        default:
            return state;
    }

}

export default OtpRequestReducer;