import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedPage from './components/AnimatedPage'
import { CartProvider, useCart } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import OrderTracking from './pages/OrderTracking'
import Success from './pages/Success'
import ScrollToTop from './components/ScrollToTop'
import { useEffect } from 'react'

function CartToast() {
  const { toast, hideToast } = useCart()

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => hideToast(), 6000)
    return () => clearTimeout(timer)
  }, [toast, hideToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="floating-toast"
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <div className="floating-toast-copy">
            <strong>{toast.title}</strong>
            <span>{toast.subtitle}</span>
          </div>
          <Link to="/cart" className="floating-toast-action" onClick={hideToast}>View cart</Link>
          <button type="button" className="floating-toast-close" onClick={hideToast} aria-label="Close cart popup">×</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AppShell() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <CartToast />
      <AnimatePresence mode="popLayout">
        <Routes location={location} key={location.pathname}>
          <Route path="/"         element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/menu"     element={<AnimatedPage><Menu /></AnimatedPage>} />
          <Route path="/cart"     element={<AnimatedPage><Cart /></AnimatedPage>} />
          <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
          <Route path="/profile"  element={<AnimatedPage><Profile /></AnimatedPage>} />
          <Route path="/admin"    element={<AnimatedPage><Admin /></AnimatedPage>} />
          <Route path="/order-success/:orderId" element={<AnimatedPage><Success /></AnimatedPage>} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppShell />
    </CartProvider>
  )
}
