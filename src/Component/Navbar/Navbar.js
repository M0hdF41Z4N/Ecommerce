
// custom context hook
// import { useAuthValue } from "../../authContext";
import { useSelector , useDispatch} from "react-redux";
import { 
    deleteSession ,
    authSelector ,
    createSession,
    setInitialStateAsync
} from "../../redux/reducers/authReducer";
import {  getCartDataAsync } from "../../redux/reducers/cartReducer";
import {   updateOrdersAsync } from "../../redux/reducers/orderReducer"
// css styles 
import styles from "../../styles/navbar.module.css";

// import form react router
import { Outlet, NavLink } from "react-router-dom";
import { useEffect } from "react";
// toast notification
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notySelector , reset} from "../../redux/reducers/notificationReducer";


// Navbar Component
export default function Navbar(){
    const dispatch = useDispatch();

    // Initializing the the auth state
    useEffect(()=>{
        dispatch(setInitialStateAsync());
    },[]);
    

    // to check if the user is still logged in on page refresh
    useEffect(()=>{
        // getting user authentication token from local storage
        const token=window.localStorage.getItem("token");
        if(token){
            // loggedIn user's data 
            const index=window.localStorage.getItem("index");
            const user=JSON.parse(index);
            dispatch(createSession(user));
        }
    },[]);
    
    // user's login status
    const authState = useSelector(authSelector);
    const {isLoggedIn,userLoggedIn}=authState;

    // getting real time update of user's cart / order
    useEffect(()=>{
        // Case : user logged in
        if(isLoggedIn){
            // updating cart
            dispatch(getCartDataAsync(userLoggedIn));
            // updating order
            dispatch(updateOrdersAsync(userLoggedIn));
        }
    });

    // Getting message for notification
    const {message} = useSelector(notySelector);

    // resetting notification after 5s
    useEffect(()=>{
        if (message) {
            toast.success(message);
            setTimeout(()=>{
                dispatch(reset());
            },500)
        }
    },[message]);

    
    
    

    return(
        <>
            {/* main container */}
            <div className={styles.navbarContainer}> 
                {/* app heading */}
                <div className={styles.appName}>
                    <NavLink to="/">
                        {/* logo of the app */}
                        <i className="fa-solid fa-shop"></i>
                        Buy Busy
                    </NavLink>
                </div>

                {/* all the navigation link */}
                <div className={styles.navLinks}>

                    {/* homepage link */}
                    <NavLink to="/">
                        <span>
                            {/* home logo */}
                            <i className="fa-solid fa-house"></i>
                            Home
                        </span>
                    </NavLink>

                    {/* myorder link */}
                    {/* show when user is logged in */}
                    {isLoggedIn && <NavLink to="/myorder">
                        <span>
                            {/* my order logo */}
                            <i className="fa-solid fa-bag-shopping"></i>
                            My Order
                        </span>
                    </NavLink> }


                    {/* cart link */}
                    {/* show when user is logged in */}
                    {isLoggedIn && <NavLink to="/cart">
                        <span>
                            {/* cart icon */}
                            <i className="fa-sharp fa-solid fa-cart-shopping"></i>
                            Cart
                        </span>
                    </NavLink> }


                    {/* for signIN and signOut */}
                    <NavLink to={!isLoggedIn?"/signin":"/"}>
                        <span>
                            {!isLoggedIn?
                                <>
                                    {/* sign in icon */}
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                    SignIn
                                </>
                                :
                                <>
                                    {/* sign out icon */}
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                    {/* sign out user  */}
                                    <span onClick={()=>dispatch(deleteSession())}>SignOut</span>
                                </>
                            }
                        </span>
                    </NavLink>
                </div>
            </div>
            {/* render child pages */}
            <Outlet />
        </>
    )
}