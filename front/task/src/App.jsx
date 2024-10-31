import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar/Navbar'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/cart/cart'
import PlaceOrder from './pages/placeOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'

function App() {
  const [showLogin,setShowLogin] = useState(false)
  


  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>

<Routes>
  
<Route path='/' element={<Home/>}/>
<Route path='/cart' element={<Cart/>}/>
<Route path='/order' element={<PlaceOrder/>}/>
<Route path='/verify' element={<Verify/>}/>
<Route path='/myorders' element={<MyOrders/>}/>


</Routes>



    </div>
      <Footer/>
    </>
  )
}

export default App
