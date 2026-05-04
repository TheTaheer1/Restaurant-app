import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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

export default function App() {
  const location = useLocation()
  
  return (
    <CartProvider>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"         element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/menu"     element={<AnimatedPage><Menu /></AnimatedPage>} />
          <Route path="/cart"     element={<AnimatedPage><Cart /></AnimatedPage>} />
          <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
          <Route path="/profile"  element={<AnimatedPage><Profile /></AnimatedPage>} />
          <Route path="/admin"    element={<AnimatedPage><Admin /></AnimatedPage>} />
          <Route path="/order-tracking/:orderId" element={<AnimatedPage><OrderTracking /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </CartProvider>
  )
}
