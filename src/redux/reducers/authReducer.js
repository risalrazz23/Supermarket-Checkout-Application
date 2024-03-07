const initialState = {
    splash: false,
    isLogin: null,
    phoneNumber: null,
    token: null,

}
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PHONE_NUMBER':
            return { ...state, phoneNumber: action.payload }
        case 'SET_TOKEN':
            return { ...state, token: action.payload }
        case 'SET_LOGIN_CREDENTIALS':
            return { ...state, isLogin: true, token: action.payload.token, phoneNumber: action.payload.phoneNumber }
        case 'RESET_TOKEN':
            return { ...state, isLogin: false, phoneNumber: null, token: null }
        case 'SPLASH':
            return { ...state, splash: action.payload }

        default:
            return state;
    }

}

export default authReducer;