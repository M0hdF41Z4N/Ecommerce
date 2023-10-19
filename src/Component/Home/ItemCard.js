
// import the custom Context hook for values
import { useDispatch, useSelector } from "react-redux";
// import { useProductContext } from "../../productContext";
import { addToCartAsync } from "../../redux/reducers/cartReducer";
// toast notification
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
// css styles
import styles from "../../styles/home.module.css";
import { authSelector } from "../../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";


// component to render single product item on the screen
export default function ItemCard(props){
    
    // getting all the value of product from props
    const {name,image,price,category}=props.item;
    const product = props.item;

    const {isLoggedIn} = useSelector(authSelector);


   // Initializing dispatch and navigate method
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Function to handle Add to cart
    async function handleAdd() {
        // If user not logged in redirecting to sign in page with message
        if(!isLoggedIn){
            toast.error("Please first Login !!!");
            navigate("/signIn");
            return;
        }
        // Otherwise updating the cart
        dispatch(addToCartAsync({product}));
    }

    return(
        <>  
            {/* main container */}
            <div className={styles.cardContainer} >
                
                {/* image container */}
                <div className={styles.imageContainer}>
                    <img src={image} alt={category} />
                </div>

                {/* description of the product name,price, add button */}
                <div className={styles.itemInfo}>
                    <div className={styles.namePrice}>
                        {/* name of product */}
                        <div className={styles.name}>
                            {name}
                        </div>

                        {/* price of the product */}
                        <div className={styles.price}>
                            ₹{price}   
                        </div>
                    </div>
                    

                    {/* add to cart button */}
                    <div className={styles.btnContainer}>
                        <button className={styles.addBtn}
                            onClick={handleAdd}    >
                            Add to Cart
                        </button>
                    </div>

                </div>

            </div>
        </>
    )
}