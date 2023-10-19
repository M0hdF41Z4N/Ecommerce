import { createSlice , createAsyncThunk} from '@reduxjs/toolkit';
// firebase database
import {db} from "../../firebaseInit";
import { onSnapshot ,updateDoc,doc, arrayRemove} from "firebase/firestore";

// Initializing state
const initialState = {
    cartItems:[], total:0, items:0
}

// update cart in firebase database

// To increase Quantity
export const incQtyAsync= createAsyncThunk("cart/incQty",async (payload,thunkAPI)=> {
    // dispatching action to update state
    thunkAPI.dispatch(incQty(payload));
    // getiting updated state
    const state = thunkAPI.getState();
    // getting user id
    const id = state.auth.userLoggedIn.id;
    // getting updated cart
    const cart = state.cart.cartItems;
    // updating firestore
    const userRef = doc(db, "buybusy", id);
        await updateDoc(userRef, {
            cart: cart
    });
});

// To remove product from cart
export const removeFromCartAsync= createAsyncThunk("cart/removeFromCart",async (payload,thunkAPI)=> {
    // dispatching action to update state
    thunkAPI.dispatch(removeFromCart(payload));
    // getiting updated state
    const state = thunkAPI.getState();
    // getting user id
    const id = state.auth.userLoggedIn.id;
    // getting product
    const {product}= payload;
    // updating firestore
    const userRef = doc(db, "buybusy", id);
        await updateDoc(userRef, {
            cart: arrayRemove(product)
    });
});

// To decrease Quantity
export const decQtyAsync= createAsyncThunk("cart/decQty",async (payload,thunkAPI)=> {
    // dispatching action to update state
    thunkAPI.dispatch(decQty(payload));
    // getiting updated state
    const state = thunkAPI.getState();
    // getting user id
    const id = state.auth.userLoggedIn.id;
    // updating firestore
    const userRef = doc(db, "buybusy", id);
        await updateDoc(userRef, {
            cart: state.cart.cartItems
    });
});

// To add product to cart
export const addToCartAsync = createAsyncThunk("cart/addToCart",async (payload,thunkAPI)=> {
    // dispatching action to update state
    thunkAPI.dispatch(addToCart(payload));
    // getiting updated state
    const state = thunkAPI.getState();
    // getting user id
    const id = state.auth.userLoggedIn.id;
    // Getting updated cart
    const cart = state.cart.cartItems;
    // updating firestore
    const userRef = await doc(db, "buybusy", id);
        await updateDoc(userRef, {
            cart: cart
    });
});

// Making cart empty
export const clearCartAsync = createAsyncThunk("cart/clearCart",async (_,thunkAPI)=> {
    // dispatching action to update state
    thunkAPI.dispatch(clearCart());
    // getiting updated state
    const state = thunkAPI.getState();
    // getting user id
    const id = state.auth.userLoggedIn.id;
    // updating firestore
    const userRef = await doc(db, "buybusy", id);
        await updateDoc(userRef, {
            cart: []
    });
});

// To get real time data from db
export const getCartDataAsync = createAsyncThunk("cart/setCart", async (payload,thunkAPI) => {
    try {
        // Getting user id
        const id = payload.id;
        // Using snapshot for real time data
        const unsub = await onSnapshot(doc(db, "buybusy",id), (doc) => {
                    // dispatching action to update the state
                    thunkAPI.dispatch(updateCart(doc.data()));
                });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
});



// Creating cart slice
const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers: {
        // action to increase quantity
        incQty : (state,action) => {
            // deconstructing the product
            const {product} = action.payload;
            // finding index in cart array
            const index = state.cartItems.findIndex((item) => item.name === product.name);
            // adding total
            state.total += product.price;
            // increasing items
            state.items++;
            // increasing quantiyt of product
            state.cartItems[index].quantity++;
            }
        // action to decrease quantity
        ,decQty :  (state,action) => {
            // deconstructing the product
            const { product} = action.payload;
            // finding index in cart array
            const index = state.cartItems.findIndex((item) => item.name === product.name);
            // checking if qunating is greater than 1
            if (state.cartItems[index].quantity >= 1) {
                // Case : Product quantity 1 then remove it from cart
                if (state.cartItems[index].quantity == 1) {
                    //  Removing product from cart
                    state.cartItems.splice(index,1);
                }else {
                    // decreasing quantity of product
                    state.cartItems[index].quantity--;
                }
                // subtracting total
                state.total -= product.price;
                // deccreasing items
                state.items--;
            }
            }
        // Action to add product to cart
        ,addToCart : (state,action) => {
            // deconstructing the product
            const {product} = action.payload;
            // finding index in cart array
            const index = state.cartItems.findIndex((item) => item.name === product.name);
            // if product is already in the cart increase quantity
            if (index !== -1) {
                // increase qty
                state.cartItems[index].quantity++;
            } else{
                state.cartItems.push({...product,quantity:1});
            }
            // adding total
            state.total += product.price;
            // increasing cart items
            state.items++;
            
        }
        // action to remove product from cart
        ,removeFromCart : (state,action) => {
            const { product} = action.payload;
            // finding index in cart array
            const index = state.cartItems.findIndex((item) => item.name === product.name);
            // getting product quantity
            const qty = state.cartItems[index].quantity;
            // updating total
            state.total-=product.price*qty;
            // updating items
            state.items-=qty;
            // updating cart
            state.cartItems.splice(index,1);
        }
        // remove all products from cart
        ,clearCart : (state,action) => { 
            // Reseting cart state
            state.cartItems = [];
            state.total = 0;
            state.items = 0;
        }
        // updating cart with initial values
        ,updateCart : (state,action) => {
            // Reseting initial value of total and items in cart to zero
            state.total = 0;
            state.items = 0;
            state.cartItems = action.payload.cart;
                state.cartItems.map((item) => {
                    const qty  = item.quantity;
                // updating total
                state.total+=item.price*qty;
                // updating items
                state.items+=qty;
            })
        }
    }
});

// cart reducer
export const cartReducer = cartSlice.reducer;
// cart actions
export const {addToCart,incQty,decQty,removeFromCart,clearCart,updateCart} = cartSlice.actions;
// cart selector
export const cartSelector = (state) => state.cart;