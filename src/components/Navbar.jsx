import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (e, id) => {
    e.preventDefault()
    setIsOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 600)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleHomeClick = (e) => {
    setIsOpen(false)
    if (location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const menuVariants = {
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    opened: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.1, delayChildren: 0.2 } }
  }

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    opened: { opacity: 1, x: 0 }
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <Link to="/" onClick={handleHomeClick} className={styles.navLogo}>Restaurant</Link>

      {/* Desktop Links */}
      <ul className={`${styles.navLinks} ${styles.desktopOnly}`}>
        <li><Link to="/" onClick={handleHomeClick}>Home</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><a href="#reviews" onClick={(e) => handleNavClick(e, 'reviews')}>Reviews</a></li>
        <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
      </ul>

      <div className={styles.navRight}>
        <Link to="/profile" className={styles.iconBtn} aria-label="Profile">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        </Link>
        <Link to="/cart" className={styles.iconBtn} aria-label="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
          {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
        </Link>

        <a href="#reserve" onClick={(e) => handleNavClick(e, 'reserve')} className={`${styles.navCta} ${styles.desktopOnly}`}>Reserve a Table</a>

        {/* Mobile Hamburger */}
        <button
          className={`${styles.hamburger} ${isOpen ? styles.hamburgerActive : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              className={styles.mobileDrawer}
              variants={menuVariants}
              initial="closed"
              animate="opened"
              exit="closed"
            >
              <div className={styles.drawerHeader}>
                <Link to="/" onClick={handleHomeClick} className={styles.drawerBrand}>Restaurant</Link>
              </div>

              <ul className={styles.mobileLinks}>
                <motion.li variants={linkVariants}><Link to="/" onClick={handleHomeClick}>Home</Link></motion.li>
                <motion.li variants={linkVariants}><Link to="/menu">Menu</Link></motion.li>
                <motion.li variants={linkVariants}><a href="#reviews" onClick={(e) => handleNavClick(e, 'reviews')}>Reviews</a></motion.li>
                <motion.li variants={linkVariants}><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></motion.li>
                <motion.li variants={linkVariants}><Link to="/profile">My Account</Link></motion.li>
              </ul>

              <div className={styles.drawerFooter}>
                <motion.div variants={linkVariants} className={styles.drawerInfo}>
                  <p>14 Koramangala High St, Bengaluru</p>
                  <p>+91 98765 43210</p>
                </motion.div>
                <motion.div variants={linkVariants}>
                  <a href="#reserve" onClick={(e) => handleNavClick(e, 'reserve')} className={styles.mobileCta}>Reserve a Table</a>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
