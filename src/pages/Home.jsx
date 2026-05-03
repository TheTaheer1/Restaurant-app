import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import ReviewCard from '../components/ReviewCard'
import styles from './Home.module.css'

const FEATURED = [
  { id: 1, name: 'Raan-e-Sikandari', category: 'Chef\'s Special', description: 'Slow-roasted whole leg of lamb marinated 48 hours in saffron, yoghurt & royal spices.', price: 1650, emoji: '🍖', spice: 2, isVeg: false, isPopular: true },
  { id: 2, name: 'Dal Makhani', category: 'Village Classic', description: 'Black lentils slow-cooked overnight in a wood-fired pot with hand-churned cream and ghee.', price: 480, emoji: '🫕', spice: 1, isVeg: true, isPopular: true },
  { id: 3, name: 'Seekh Kebab Platter', category: 'From the Tandoor', description: 'Minced lamb with fresh herbs, charred over live charcoal. Served with mint chutney.', price: 720, emoji: '🔥', spice: 3, isVeg: false, isPopular: false },
]

const REVIEWS = [
  { id: 1, name: 'Priya Mehta', location: 'Bengaluru', rating: 5, text: 'The Raan-e-Sikandari was absolutely divine. Fell right off the bone and the whole ambiance takes you back in time.', date: 'Apr 2026' },
  { id: 2, name: 'Arjun & Kavitha', location: 'Bengaluru', rating: 5, text: 'We celebrated our anniversary here and it was magical. The private room, attentive service, and the food — sheer perfection.', date: 'Mar 2026' },
  { id: 3, name: 'Rahul Singh', location: 'Mumbai', rating: 5, text: 'Best dal makhani in the city. No contest. I have been coming every month for two years and it never disappoints.', date: 'Feb 2026' },
]

export default function Home() {
  return (
    <div className={styles.home}>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroBadge}>Est. 2012 · Bengaluru</span>
          <h1 className={styles.heroTitle}>
            A Taste of<br /><em>Ancient India</em>
          </h1>
          <p className={styles.heroSub}>
            Where centuries-old recipes meet open-flame cooking. Every dish tells a story — of spice routes, village kitchens, and the warmth of a shared table.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/menu" className="btn-primary">Explore Menu</Link>
            <Link to="/cart" className="btn-ghost">View Cart</Link>
          </div>
        </div>
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className={styles.stats}>
        {[['12+', 'Years of Heritage'], ['80+', 'Signature Dishes'], ['4.9', 'Guest Rating'], ['3', 'Award Wins']].map(([num, label]) => (
          <div key={label} className={styles.statItem}>
            <div className={styles.statNum}>{num}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURED DISHES ── */}
      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <div className="section-tag">Signature Dishes</div>
              <h2 className="section-title">From Our Kitchen</h2>
            </div>
            <Link to="/menu" className="btn-secondary">Full Menu →</Link>
          </div>
          <div className={styles.cardGrid}>
            {FEATURED.map(item => <FoodCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className={styles.experience}>
        <div className={styles.expImgSide} />
        <div className={styles.expTextSide}>
          <div className="section-tag">The Experience</div>
          <h2 className="section-title" style={{ color: 'var(--brown-pale)' }}>More Than a Meal</h2>
          <ul className={styles.featureList}>
            {[
              ['Live Tandoor Kitchen', 'Watch our chefs work the traditional clay oven — bread pulled fresh, kebabs kissed by flame.'],
              ['Seasonal Thali Nights', 'Every Thursday, a curated feast of 14 courses inspired by a different Indian state.'],
              ['Private Dining Rooms', 'Intimate spaces for gatherings of 8–40, with personalised menus crafted just for you.'],
            ].map(([title, desc]) => (
              <li key={title} className={styles.featureItem}>
                <div className={styles.featureDot} />
                <div>
                  <h4 className={styles.featureTitle}>{title}</h4>
                  <p className={styles.featureDesc}>{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className={styles.reviews}>
        <div className="container">
          <div className={styles.reviewsHeader}>
            <div className="section-tag">Guest Stories</div>
            <h2 className="section-title">What Our Guests Say</h2>
          </div>
          <div className={styles.reviewGrid}>
            {REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        </div>
      </section>

      {/* ── RESERVATION CTA ── */}
      <section className={styles.cta}>
        <div className="container">
          <div className="section-tag" style={{ color: 'var(--brown-light)' }}>Visit Us</div>
          <h2 className={styles.ctaTitle}>Join Us for Dinner</h2>
          <p className={styles.ctaSub}>
            14 Koramangala High St, Bengaluru · Mon–Sun 12pm–11pm
          </p>
          <Link to="/menu" className="btn-primary" style={{ marginTop: '28px' }}>
            Order Online Now
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <div className={styles.footerLogo}>Saffron & Smoke</div>
            <p className={styles.footerCopy}>© 2026 Saffron & Smoke. All rights reserved.</p>
            <div className={styles.footerLinks}>
              {['Instagram', 'Facebook', 'Zomato'].map(l => (
                <a key={l} href="#" className={styles.footerLink}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
