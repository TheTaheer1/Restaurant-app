import { useState } from 'react'
import FoodCard from '../components/FoodCard'
import styles from './Menu.module.css'

const MENU_ITEMS = [
  { id: 1,  name: 'Raan-e-Sikandari',   category: 'Mains',    description: 'Slow-roasted leg of lamb marinated 48 hrs in saffron, yoghurt & royal spices.',  price: 1650, emoji: '🍖', spice: 2, isVeg: false, isPopular: true },
  { id: 2,  name: 'Dal Makhani',         category: 'Mains',    description: 'Black lentils slow-cooked overnight with hand-churned cream and ghee.',            price: 480,  emoji: '🫕', spice: 1, isVeg: true,  isPopular: true },
  { id: 3,  name: 'Seekh Kebab Platter', category: 'Starters', description: 'Minced lamb with herbs, charred over live charcoal. Served with mint chutney.',    price: 720,  emoji: '🔥', spice: 3, isVeg: false, isPopular: false },
  { id: 4,  name: 'Paneer Tikka',        category: 'Starters', description: 'Marinated cottage cheese cubes grilled in a tandoor, served with coriander chutney.', price: 420, emoji: '🧀', spice: 2, isVeg: true,  isPopular: true },
  { id: 5,  name: 'Butter Chicken',      category: 'Mains',    description: 'Tender chicken in a rich, creamy tomato-butter sauce. Our most-loved dish.',        price: 560,  emoji: '🍗', spice: 1, isVeg: false, isPopular: true },
  { id: 6,  name: 'Palak Paneer',        category: 'Mains',    description: 'Cottage cheese in a spiced spinach gravy, finished with a touch of cream.',         price: 380,  emoji: '🥬', spice: 1, isVeg: true,  isPopular: false },
  { id: 7,  name: 'Gulab Jamun',         category: 'Desserts', description: 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup.',                   price: 180,  emoji: '🍮', spice: 0, isVeg: true,  isPopular: true },
  { id: 8,  name: 'Kulfi Falooda',       category: 'Desserts', description: 'Traditional Indian ice cream with rose syrup, basil seeds, and vermicelli.',        price: 220,  emoji: '🍦', spice: 0, isVeg: true,  isPopular: false },
  { id: 9,  name: 'Masala Chai',         category: 'Drinks',   description: 'Freshly brewed spiced tea with cardamom, ginger, cinnamon, and frothed milk.',      price: 120,  emoji: '☕', spice: 1, isVeg: true,  isPopular: false },
  { id: 10, name: 'Mango Lassi',         category: 'Drinks',   description: 'Chilled yoghurt blended with fresh Alphonso mangoes and a hint of cardamom.',       price: 160,  emoji: '🥭', spice: 0, isVeg: true,  isPopular: true },
  { id: 11, name: 'Garlic Naan',         category: 'Breads',   description: 'Pillowy leavened bread with roasted garlic and butter, baked in the tandoor.',      price: 80,   emoji: '🫓', spice: 0, isVeg: true,  isPopular: true },
  { id: 12, name: 'Laccha Paratha',      category: 'Breads',   description: 'Multi-layered flaky whole-wheat flatbread with a crisp exterior.',                  price: 70,   emoji: '🫓', spice: 0, isVeg: true,  isPopular: false },
]

const CATEGORIES = ['All', ...new Set(MENU_ITEMS.map(i => i.category))]

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [vegFilter, setVegFilter] = useState('all') // 'all' | 'veg' | 'nonveg'

  const filtered = MENU_ITEMS.filter(item => {
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
          <h1 className={styles.heroTitle}>Every Dish, a Story</h1>
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
          </div>

          {/* Category pills */}
          <div className={styles.pills}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.pill} ${activeCategory === cat ? styles.pillActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.menuBody}>
        <div className="container">
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <span>🍽️</span>
              <p>No dishes found. Try a different filter.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map(item => <FoodCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
