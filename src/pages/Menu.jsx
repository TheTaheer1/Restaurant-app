import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import { FoodGridSkeleton } from '../components/Skeleton'
import styles from './Menu.module.css'

import { MENU } from '../data/menu'

const CATEGORIES = ['All', ...new Set(MENU.map(i => i.category))]

export default function Menu() {
  const location = useLocation()
  const initialCategory = location.state?.category || 'All'
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [vegFilter, setVegFilter] = useState('all')

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [activeCategory, search, vegFilter])

  const filtered = MENU.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchVeg = vegFilter === 'all' || (vegFilter === 'veg' ? item.isVeg : !item.isVeg)
    return matchCat && matchSearch && matchVeg
  })

  return (
    <div className="page">
      <div className={styles.hero}>
        <div className="container">
          <div className="section-tag">Our Menu</div>
          <h1 className={`${styles.heroTitle} glow-text`}>Every Dish, a Story</h1>
          <p className={styles.heroSub}>Crafted from centuries-old recipes, served fresh from our kitchen.</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className="container">
          {/* Search */}
          <div className={styles.searchRow}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search dishes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.vegToggle}>
              {[['all','All'],['veg','Veg Only'],['nonveg','Non-Veg']].map(([val, label]) => (
                <button
                  key={val}
                  className={`${styles.toggleBtn} ${vegFilter === val ? styles.toggleActive : ''}`}
                  onClick={() => setVegFilter(val)}
                >{label}</button>
              ))}
            </div>
            
            <div className={styles.filterWrap}>
              <button 
                className={styles.filterFab} 
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                aria-label="Filter Categories"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
              </button>

              {isCategoryMenuOpen && (
                <div className={styles.filterDropdown}>
                  <div className={styles.filterHeader}>Categories</div>
                  <div className={styles.filterList}>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        className={`${styles.filterOption} ${activeCategory === cat ? styles.filterOptionActive : ''}`}
                        onClick={() => { setActiveCategory(cat); setIsCategoryMenuOpen(false); }}
                      >{cat}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.menuBody}>
        <div className="container">
          {loading ? (
            <div className={styles.grid}>
              <FoodGridSkeleton count={filtered.length || 8} />
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <span>🍽️</span>
              <p>No dishes found. Try a different filter.</p>
            </div>
          ) : (
            <div className={`${styles.grid} stagger-in`}>
              {filtered.map(item => <FoodCard key={item._id} item={item} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
