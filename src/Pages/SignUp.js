// react ref hook 
import { useRef ,useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, createUserAsync } from "../redux/reducers/authReducer";

// navigation router
import { useNavigate } from "react-router-dom";

// custom context hook (authentication)
// import { useAuthValue } from "../authContext";


// css styles
import styles from "../styles/signIn.module.css";

// toast notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// signup page
export function SignUp(){

    const dispatch = useDispatch();

    // ref variables for name, email, password
    const nameRef=useRef();
    const emailRef=useRef();
    const passwordRef=useRef();

    // navigation variable
    const navigate=useNavigate();

    // function for creating new user
    const {userList,isLoggedIn} = useSelector(authSelector);

    // Redirect to home if already logged in
    useEffect(()=>{
        if (isLoggedIn) {
            navigate("/");
        }
    },[isLoggedIn]);


    // handle form submit
    function handleSubmit(e){
        e.preventDefault();

        // storing user's data
        const data={
            name:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value
        };

        // checking whether the email address already in use or not
        const index =userList.findIndex((user) => user.email === data.email);

        // if found email display notification
        if(index !== -1){
            toast.error("Email Address already exist, Try Again or SignIn Instead!!!");
            // redirect to signIn page
            navigate("/signIn")
            return;
        }
        // creating user
        dispatch(createUserAsync(data));
        toast.success("New user Created, Redirecting to home !!");
        // if user created redirect to corresponding page
        navigate("/");
    }
    
    return(
        <>
            {/* main container  */}
            <div className={styles.container}>
                <div className={styles.inputForm}>
                    {/* heading */}
                    <h1>SignUp</h1>
                    {/* form to get user's data */}
                    <form onSubmit={handleSubmit}>
                        {/* for name */}
                        <input type="text" 
                            placeholder="Name" 
                            required
                            ref={nameRef} />
                        {/* for email */}
                        <input type="email" 
                            placeholder="Enter Email"
                            required 
                            ref={emailRef}/>
                        {/* for password */}
                        <input type="password" 
                            placeholder="Enter Password"
                            required
                            ref={passwordRef} />
                        {/* submit button */}
                        <button>Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}