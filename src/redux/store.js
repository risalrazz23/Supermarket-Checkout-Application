import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import OtpRequestReducer from './reducers/OtpRequest';
import OtpVerifyReducer from './reducers/OtpVerifyReducer';
import authReducer from './reducers/authReducer';
import permissionsReducer from './reducers/permissions';
import cartReducer from './reducers/cartReducer';
const rootReducer = combineReducers({
    OtpRequest: OtpRequestReducer,
    OtpVerify:OtpVerifyReducer,
    auth:authReducer,
    permissions:permissionsReducer,
    cart:cartReducer
  });
  
  
export const store=createStore(rootReducer);
