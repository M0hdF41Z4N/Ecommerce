
// react router
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';


// all the pages and component to render
import Navbar from "./Component/Navbar/Navbar";
import { Home } from "./Pages/Home";
import {MyOrder} from "./Pages/MyOrder";
import {Cart} from "./Pages/Cart";
import {SignIn} from "./Pages/SignIn";
import { SignUp } from "./Pages/SignUp";
import { Error } from "./Pages/Error";
import { store } from "./redux/store";
import { ToastContainer } from "react-toastify";

// main app function 
function App() {

  // all the link routes
  const router = createBrowserRouter([
    {
      path:"/", 
      element: <Navbar />,
      errorElement: <Error />,
      children:[
        { index:true, element: <Home />},
        { path:"/myorder", element: <MyOrder />},
        { path:"/cart", element: <Cart />},
        { path:"/signin", element: <SignIn />},
        { path:"/signup", element: <SignUp />},
      ]
    }
  ]);

  return (
    <>
    {/* custom authContext provider */}
      {/* <AuthContext> */}
        {/* custom product context provider */}
        {/* <ProductContext> */}
          {/* routes */}
          <Provider store={store}>
            <ToastContainer/>
          <RouterProvider router={router} />   
          </Provider> 
        {/* </ProductContext> */}
      {/* </AuthContext> */}
    </>
  );
}

export default App;
