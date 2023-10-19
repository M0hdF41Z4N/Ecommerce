import { configureStore ,getDefaultMiddleware } from '@reduxjs/toolkit'

// importing all the reducers
import  {authReducer}  from './reducers/authReducer';
import { cartReducer } from './reducers/cartReducer';
import { orderReducer } from './reducers/orderReducer';
import { notyReducer } from './reducers/notificationReducer';

// creating store
export const store = configureStore({
    reducer:{
        auth:authReducer,
        cart:cartReducer,
        order:orderReducer,
        notification:notyReducer
    }
    ,middleware:[...getDefaultMiddleware()]
})