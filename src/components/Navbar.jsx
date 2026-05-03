import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <Link to="/" className={styles.navLogo}>Restaurant</Link>

      {/* Desktop Links */}
      <ul className={`${styles.navLinks} ${styles.desktopOnly}`}>
        <li><Link to="/">Home</Link></li>
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
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={isOpen ? styles.barOpen1 : styles.bar1}></span>
          <span className={isOpen ? styles.barOpen2 : styles.bar2}></span>
          <span className={isOpen ? styles.barOpen3 : styles.bar3}></span>
        </button>
      </div>

      <div className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/menu" onClick={() => setIsOpen(false)}>Menu</Link></li>
          <li><a href="#reviews" onClick={(e) => handleNavClick(e, 'reviews')}>Reviews</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
        </ul>
        <a href="#reserve" onClick={(e) => handleNavClick(e, 'reserve')} className={styles.mobileCta}>Reserve a Table</a>
      </div>
    </nav>
  )
}
