import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    message :null
}

// Creating notification slice
const notySlice =  createSlice({
    name:"notification",
    initialState:initialState,
    reducers :{
        // To reset the notification to null
        reset : (state,action) => {
            state.message = null;
        }
    },
    // According to the actions of different states like cart , auth, orders 
    // notification message / state changes
    extraReducers : (builder) => {
        builder.addCase("cart/addToCart",(state,action) => {
            state.message = "Added to the cart"
        }).addCase("cart/incQty",(state,action) => {
            state.message = "Product Quantity Increased!!"
        }).addCase("cart/decQty",(state,action) => {
            state.message = "Product Quantity Decreased!!"
        }).addCase("cart/removeFromCart",(state,action) => {
            state.message = "Removed from cart"
        }).addCase("cart/clearCart",(state,action) => {
            state.message = "Empty Cart!!"
        }).addCase("auth/deleteSession" , (state,action) => {
            state.message = "Sign Out Successfully!!!!";
        })
    }
});

// creating and exporting notification reducer
export const notyReducer = notySlice.reducer;
// creating and exporting notification actions
export const {reset} = notySlice.actions;
// creating and exporting notification selector
export const notySelector = (state) => state.notification;