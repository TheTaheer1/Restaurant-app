import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.navLogo}>Saffron & Smoke</Link>
      
      {/* Desktop Links */}
      <ul className={`${styles.navLinks} ${styles.desktopOnly}`}>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="#">Story</Link></li>
        <li><Link to="#">Gallery</Link></li>
        <li><Link to="#">Contact</Link></li>
      </ul>
      <Link to="/menu" className={`${styles.navCta} ${styles.desktopOnly}`}>Reserve a Table</Link>

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

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <ul className={styles.mobileLinks}>
          <li><Link to="/menu" onClick={() => setIsOpen(false)}>Menu</Link></li>
          <li><Link to="#" onClick={() => setIsOpen(false)}>Story</Link></li>
          <li><Link to="#" onClick={() => setIsOpen(false)}>Gallery</Link></li>
          <li><Link to="#" onClick={() => setIsOpen(false)}>Contact</Link></li>
        </ul>
        <Link to="/menu" className={styles.mobileCta} onClick={() => setIsOpen(false)}>Reserve a Table</Link>
      </div>
    </nav>
  )
}
