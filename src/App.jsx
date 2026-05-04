import { Routes, Route, useLocation } from 'react-router-dom'
import AnimatedPage from './components/AnimatedPage'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import OrderTracking from './pages/OrderTracking'
import Success from './pages/Success'

export default function App() {
  const location = useLocation()
  
  return (
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/menu"     element={<Menu />} />
        <Route path="/cart"     element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile"  element={<Profile />} />
        <Route path="/admin"    element={<Admin />} />
        <Route path="/order-success/:orderId" element={<Success />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
      </Routes>
    </CartProvider>
  )
}
