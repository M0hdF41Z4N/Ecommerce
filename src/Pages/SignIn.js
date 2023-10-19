
// react hook
import { useEffect, useRef } from "react";
import { useDispatch ,useSelector } from 'react-redux';

// react router
import { NavLink, useNavigate } from "react-router-dom";

// css styles
import styles from "../styles/signIn.module.css";

// custom context hook (authentication)
// import { useAuthValue } from "../authContext";
import { authSelector, createSession } from "../redux/reducers/authReducer";

// toast notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// signin page
export function SignIn(){
    // Initialize dispatch method
    const dispatch = useDispatch();
    // Getting users and sign in status
    const {isLoggedIn,userList} = useSelector(authSelector);


    // navigate variable to navigate to some page
    const navigate=useNavigate();
    
    // ref variables for email, password
    const emailRef=useRef();
    const passwordRef=useRef();

    // Redirect to home if already logged in
    useEffect(()=>{
        if (isLoggedIn) {
            navigate("/");
        }
    },[isLoggedIn]);


    // form submit function
    async function handleSubmit(e){
        e.preventDefault();
        // storing user's data
        const data={
            email:emailRef.current.value,
            password:passwordRef.current.value
        }
        // sign in user
        // if user signed in redirect to corresponding page
        {isLoggedIn?navigate("/"):navigate("/signin")}; 
        const index = userList.findIndex((user) => user.email === data.email);
        if(index === -1){
                toast.error("Email does not exist, Try again or SignUp Instead!!!");
                return ;
            }
        // if email found in database then match password
        if(userList[index].password === data.password){
            toast.success("Sign In Successfully!!!");
            // logging in user and storing its data in local variable
            let user = userList[index];
            dispatch(createSession(user));
            // logging redirect to home page
            navigate("/");
        }
        else{
            // if password doesn't match in database
            toast.error("Wrong UserName/Password, Try Again");
        }
    }   


    return(
        // main container of the page
        <div className={styles.container}>
            
            <div className={styles.inputForm}>
                {/* heading */}
                <h1>SignIn</h1>
                {/* form */}
                <form onSubmit={handleSubmit}>
                    {/* email */}
                    <input type="email" 
                        placeholder="Enter Email" 
                        required
                        ref={emailRef} />

                    <br />
                    {/* password */}
                    <input type="password" 
                        placeholder="Enter Password"
                        required
                        ref={passwordRef} />
                    <br />
                    {/* submit button */}
                    <button>Submit</button>
                </form>
                <br /> 
                <span>or &nbsp;</span>
                {/* link for signup page */}
                <NavLink to="/signup">
                    Create New Account
                </NavLink>
            </div>
            
        </div>
    );
}