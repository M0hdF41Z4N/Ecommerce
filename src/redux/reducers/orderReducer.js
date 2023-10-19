import { createSlice , createAsyncThunk} from '@reduxjs/toolkit';
// firebase database
import {db} from "../../firebaseInit";
import {updateDoc, doc,onSnapshot } from "firebase/firestore"; 

// Initializing state
const initialState = {
    orders:[]
}

// Getting and updating real time data from db
export const updateOrdersAsync = createAsyncThunk("cart/updateOrders", async (payload,thunkAPI) => {
    try {
        const id = payload.id;
        // Using snapshot method to get real time data
        const unsub = await onSnapshot(doc(db, "buybusy",id), (doc) => {
                    // Dispatching action to update orders of user
                    thunkAPI.dispatch(updateOrders(doc.data()));
                });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

// Placing order
export const placeOrderAsync = createAsyncThunk("cart/placeOrder", async (payload,thunkAPI) => {
    try {
        // updating state
        thunkAPI.dispatch(placeOrder(payload));
        const state = thunkAPI.getState();
        const id = state.auth.userLoggedIn.id;
        const orders = state.order.orders;
        // updating db
        const userRef = doc(db, "buybusy", id);
            await updateDoc(userRef, {
                orders: orders
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
});

// Creating order slice
const orderSlice = createSlice({
    name:"order",
    initialState,
    reducers : {
        // action to place order
        placeOrder: (state,action) => {
            const {cartItems,total} = action.payload;
            const date = new Date();
            // day
            let day = date.getDate();
            // month
            let month = date.getMonth() + 1;
            // year
            let year = date.getFullYear();
            // yy/mm/dd format
            const currentDate = `${year}-${month}-${day}`;
            state.orders.push({date:currentDate,total:total,list:cartItems});
        }
        // action to update orders realtime
        ,updateOrders : (state,action) => {
            state.orders = action.payload.orders;
        }
    }
});



// cart reducer
export const orderReducer = orderSlice.reducer;
// cart actions
export const {placeOrder,updateOrders} = orderSlice.actions;
// cart selector
export const orderSelector = (state) => state.order;

