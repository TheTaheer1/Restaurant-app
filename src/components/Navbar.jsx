import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  const close = () => setMenuOpen(false)

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={close}>
          <span className={styles.logoIcon}>🍛</span>
          <span>Saffron <em>&amp;</em> Smoke</span>
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          {[['/', 'Home'], ['/menu', 'Menu'], ['/profile', 'My Orders']].map(([to, label]) => (
            <li key={to}>
              <NavLink to={to} className={({ isActive }) => isActive ? styles.active : ''} end={to === '/'}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className={styles.actions}>
          <button className={styles.cartBtn} onClick={() => navigate('/cart')} aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </button>

          <button className={styles.reserveBtn} onClick={() => navigate('/menu')}>
            Order Now
          </button>

          {/* Hamburger */}
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <ul className={styles.drawerLinks}>
          {[['/', 'Home'], ['/menu', 'Menu'], ['/cart', 'Cart'], ['/profile', 'My Orders'], ['/admin', 'Admin']].map(([to, label]) => (
            <li key={to}>
              <NavLink to={to} className={({ isActive }) => isActive ? styles.drawerActive : ''} onClick={close} end={to === '/'}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
