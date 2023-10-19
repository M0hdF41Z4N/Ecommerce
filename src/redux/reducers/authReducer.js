import { createSlice , createAsyncThunk} from '@reduxjs/toolkit';
// firebase database
import {db} from "../../firebaseInit";
import { collection, addDoc, onSnapshot } from "firebase/firestore"; 



// Initializing state
const initialState = {
    userList:[], isLoggedIn:false, userLoggedIn:null
}


  // Method 1 for asynchornous operations: using thunkAPI

  // To create user in db
export const createUserAsync = createAsyncThunk("auth/createSession", async (payload,thunkAPI) => {
    // getting data
    const data = payload;
    // adding user to firestore
    const docRef =await addDoc(collection(db, "buybusy"), {
        name:data.name,
        email:data.email,
        password:data.password,
        cart:[],
        orders:[]
    });
    // updating the state
    thunkAPI.dispatch(createSession(data));
});

// setting up initial state after getting data from db
export const setInitialStateAsync = createAsyncThunk("auth/setInitialState", async (_,thunkAPI)=>{

    // Using snapshot to get real-time data
    const unsub = onSnapshot(collection(db, "buybusy"), async (snapShot) => {
        // Getting users
        const users = await snapShot.docs.map((doc) => {
            return {
                id:doc.id,
                ...doc.data()
            }
        });
        // dispatching action
        thunkAPI.dispatch(setInitialState(users));
    });
});




// Creating Authentication Slice
const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers : {
        // To create session in the browser and update state
        createSession:(state,action) => {
            window.localStorage.setItem("token",true);
            window.localStorage.setItem("index",JSON.stringify(action.payload));
            state.isLoggedIn = true;
            state.userLoggedIn = action.payload;
        },
        // To delete sesion in the browser and update state
        deleteSession:(state,action) => {
            // removing user' data and token from local storage
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("index");
            state.isLoggedIn = false;
            state.userLoggedIn = null;
        },
        // Setting initial userList
        setInitialState:(state,action) => {
            state.userList = action.payload;
        }
    }
   
});

// exporting reducer
export const authReducer = authSlice.reducer;
// exporting actions
export const {
    deleteSession,
    createSession,
    setInitialState
} = authSlice.actions;
// exporting selector
export const authSelector = (state) => state.auth;