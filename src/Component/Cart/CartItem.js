// css styles from old other file
import oldStyles from "../../styles/home.module.css"
// new css styles 
import styles from "../../styles/cart.module.css";
import { useDispatch } from "react-redux";
import { incQtyAsync,decQtyAsync,removeFromCartAsync } from "../../redux/reducers/cartReducer";


// render single cart item 
export default function CartItem(props){

    // product data from props
    const {name,image,price,category,quantity}=props.product;
    const product = props.product;
    
    // Initialize dispatch method
    const dispatch = useDispatch();

    return(
        <>
            {/* item card container */}
            <div className={oldStyles.cardContainer} >
                
                {/* image container */}
                <div className={styles.imageContainer}>
                    {/* product image */}
                    <img src={image} alt={category} />
                </div>

                {/* description of the product name,price, add button */}
                <div className={styles.itemInfo}>
                    {/* product name */}
                    <div className={styles.namePrice}>
                        {name}
                    </div>
                    
                    <div className={styles.priceQuant}>
                        {/* price of the product */}
                        <div className={styles.price}>
                            ₹{price}   
                        </div>

                        {/* quantity of the product */}
                        <div className={styles.quantity}>

                            {/* to decrease product quantity */}
                            <span className={styles.minus}>
                                <i class="fa-solid fa-circle-minus"
                                   onClick={() => dispatch(decQtyAsync({product}))} ></i> 
                            </span>

                            {/* quantity */}
                             &nbsp; {quantity} &nbsp;

                            {/* increase product quantity */}
                            <span className={styles.plus}>
                                <i class="fa-solid fa-circle-plus"
                               onClick={() => dispatch(incQtyAsync({product}))} ></i>  
                            </span>
                            
                        </div>

                    </div>

                    {/* remove from cart button */}
                    <div className={styles.btnContainer}>
                        <button className={styles.removeBtn}
                            onClick={() => dispatch(removeFromCartAsync({product}))}    >
                            Remove From Cart
                        </button>
                    </div>

                </div>

            </div>
        </>
    )
}