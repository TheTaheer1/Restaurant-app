import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import FoodCard from '../components/FoodCard'
import ReviewCard from '../components/ReviewCard'
import { MENU } from '../data/menu'
import { REVIEWS } from '../data/reviews'
import { ORDERS } from '../data/orders'
import styles from './Home.module.css'

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1400&q=80',
    badge: 'Est. 2012 · Bengaluru',
    heading: <>A Taste of <em>Ancient</em> India</>,
    quote: 'Where centuries-old recipes meet open-flame cooking. Every dish tells a story — of spice routes, village kitchens, and the warmth of a shared table.',
    cta: { label: 'Explore Menu', type: 'ghost', action: 'menu' },
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80',
    badge: 'Open-Flame Mastery',
    heading: <>Crafted with <em>Fire</em> & Soul</>,
    quote: 'Our chefs channel generations of wisdom into every dish. A dining experience that awakens the senses and stays with you long after.',
    cta: { label: 'Book Your Table', type: 'primary', action: 'reserve' },
  },
  {
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=1400&q=80',
    badge: 'Seasonal Harvest',
    heading: <>Fresh Ingredients, <em>Timeless</em> Taste</>,
    quote: 'We source only the finest seasonal produce from local farms. Pure ingredients, cooked with heart, served with pride.',
    cta: { label: 'Explore Menu', type: 'ghost', action: 'menu' },
  },
]

const getTopSelling = () => {
  const counts = {}
  ORDERS.forEach(order => {
    order.items.forEach(item => {
      counts[item.menuId] = (counts[item.menuId] || 0) + item.qty
    })
  })
  const sortedIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a])
  return sortedIds.slice(0, 3).map(id => MENU.find(m => m._id === id)).filter(Boolean)
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const REVIEWS_PER_PAGE = 4

function ReviewCarousel() {
  const totalPages = Math.ceil(REVIEWS.length / REVIEWS_PER_PAGE)
  const [page, setPage] = useState(0)
  const pageReviews = REVIEWS.slice(page * REVIEWS_PER_PAGE, (page + 1) * REVIEWS_PER_PAGE)

  useEffect(() => {
    const t = setInterval(() => setPage(p => (p + 1) % totalPages), 6000)
    return () => clearInterval(t)
  }, [totalPages])

  return (
    <div className={styles.reviewCarousel}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          className={styles.testimonialGrid}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          {pageReviews.map(review => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className={styles.reviewControls}>
        <button
          className={styles.reviewArrow}
          onClick={() => setPage(p => (p - 1 + totalPages) % totalPages)}
          aria-label="Previous reviews"
        >‹</button>
        <div className={styles.reviewDots}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === page ? styles.dotActive : ''}`}
              onClick={() => setPage(i)}
            />
          ))}
        </div>
        <button
          className={styles.reviewArrow}
          onClick={() => setPage(p => (p + 1) % totalPages)}
          aria-label="Next reviews"
        >›</button>
      </div>
    </div>
  )
}

export default function Home() {
  const topItems = getTopSelling();
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);

  const scrollTo = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCta = (action) => {
    if (action === 'menu') navigate('/menu')
    else scrollTo('#reserve')
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = HERO_SLIDES[slideIndex]

  return (
    <div>
      {/* HERO SLIDESHOW */}
      <section className={styles.hero}>
        {/* Background Images */}
        <AnimatePresence mode="sync">
          <motion.div
            key={slideIndex}
            className={styles.heroBg}
            style={{ backgroundImage: `url('${slide.image}')` }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </AnimatePresence>

        {/* Dark overlay */}
        <div className={styles.heroDimmer} />

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${slideIndex}`}
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className={styles.heroBadge}>{slide.badge}</div>
            <h1>{slide.heading}</h1>
            <p>{slide.quote}</p>
            <div className={styles.heroActions}>
              {slide.cta.type === 'primary' ? (
                <button className={styles.btnPrimary} onClick={() => handleCta(slide.cta.action)}>{slide.cta.label}</button>
              ) : (
                <button className={styles.btnGhost} onClick={() => handleCta(slide.cta.action)}>{slide.cta.label}</button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot Indicators */}
        <div className={styles.slideDots}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === slideIndex ? styles.dotActive : ''}`}
              onClick={() => setSlideIndex(i)}
            />
          ))}
        </div>

        <div className={styles.scrollHint}>
          <span className={styles.scrollLine}></span>
          Scroll to explore
        </div>
      </section>

      {/* STATS STRIP */}
      <div className={styles.aboutStrip}>
        <div className={styles.aboutItem}>
          <div className={styles.aboutNum}>12+</div>
          <div className={styles.aboutLabel}>Years of Heritage</div>
        </div>
        <div className={styles.aboutItem}>
          <div className={styles.aboutNum}>80+</div>
          <div className={styles.aboutLabel}>Signature Dishes</div>
        </div>
        <div className={styles.aboutItem}>
          <div className={styles.aboutNum}>4.9</div>
          <div className={styles.aboutLabel}>Guest Rating</div>
        </div>
        <div className={styles.aboutItem}>
          <div className={styles.aboutNum}>3</div>
          <div className={styles.aboutLabel}>Award Wins</div>
        </div>
      </div>

      {/* BROWSE BY CATEGORY */}
      <section className={`${styles.section} ${styles.categorySection}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionTag} style={{ textAlign: 'center' }}>Explore Our Menu</div>
          <div className={styles.sectionTitle} style={{ textAlign: 'center' }}>Browse by Category</div>
        </motion.div>
        <div className={styles.categoryGrid}>
          {[
            {
              label: 'Starters',
              category: 'Snacks',
              desc: 'Crispy, bold, and perfectly spiced bites to begin your journey.',
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
              gradient: 'linear-gradient(135deg, #3d1a00 0%, #1a0f05 100%)',
              icon: '🥗',
            },
            {
              label: 'Main Course',
              category: 'Main Course',
              desc: 'Hearty curries and slow-cooked mains that define Indian comfort.',
              image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
              gradient: 'linear-gradient(135deg, #2d1500 0%, #1a0f05 100%)',
              icon: '🍛',
            },
            {
              label: 'Desserts',
              category: 'Desserts',
              desc: 'Sweet, indulgent finales crafted from traditional recipes.',
              image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
              gradient: 'linear-gradient(135deg, #3d2200 0%, #1a1008 100%)',
              icon: '🍮',
            },
          ].map((cat, i) => (
            <motion.div
              key={cat.label}
              className={styles.categoryCard}
              style={{ background: cat.gradient }}
              onClick={() => navigate('/menu', { state: { category: cat.category } })}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className={styles.categoryCardImg} style={{ backgroundImage: `url('${cat.image}')` }} />
              <div className={styles.categoryCardOverlay} />
              <div className={styles.categoryCardBody}>
                <div className={styles.categoryCardIcon}>{cat.icon}</div>
                <div className={styles.categoryCardLabel}>{cat.label}</div>
                <div className={styles.categoryCardDesc}>{cat.desc}</div>
                <div className={styles.categoryCardCta}>Explore →</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* MENU SECTION */}
      <motion.section
        className={`${styles.section} ${styles.menuSection}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className={styles.menuHeader}>
          <div>
            <div className={styles.sectionTag}>Signature Dishes</div>
            <div className={styles.sectionTitle}>From Our Kitchen</div>
          </div>
          <Link to="/menu" className={styles.btnGhost} style={{ padding: '12px 28px', fontSize: '12px' }}>Full Menu →</Link>
        </motion.div>
        <div className={styles.menuGrid}>
          {topItems.map(item => (
            <motion.div key={item._id} variants={fadeInUp}>
              <FoodCard item={item} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* EXPERIENCE */}
      <motion.div
        className={styles.experienceSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }} className={styles.expImgSide}></motion.div>
        <motion.div variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }} className={styles.expTextSide}>
          <div className={styles.sectionTag}>The Experience</div>
          <div className={styles.sectionTitle} style={{ fontSize: '38px' }}>More Than a Meal</div>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <div className={styles.featureDot}></div>
              <div className={styles.featureText}>
                <h4>Live Tandoor Kitchen</h4>
                <p>Watch our chefs work the traditional clay oven — bread pulled fresh, kebabs kissed by flame.</p>
              </div>
            </li>
            <li className={styles.featureItem}>
              <div className={styles.featureDot}></div>
              <div className={styles.featureText}>
                <h4>Seasonal Thali Nights</h4>
                <p>Every Thursday, a curated feast of 14 courses inspired by a different Indian state.</p>
              </div>
            </li>
            <li className={styles.featureItem}>
              <div className={styles.featureDot}></div>
              <div className={styles.featureText}>
                <h4>Private Dining Rooms</h4>
                <p>Intimate spaces for gatherings of 8–40, with personalised menus crafted just for you.</p>
              </div>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* TESTIMONIALS CAROUSEL */}
      <section id="reviews" className={`${styles.section} ${styles.testimonialsSection}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionTag} style={{ textAlign: 'center' }}>Guest Stories</div>
          <div className={styles.sectionTitle} style={{ textAlign: 'center' }}>What Our Guests Say</div>
        </motion.div>
        <ReviewCarousel />
      </section>

      {/* RESERVATION */}
      <section id="reserve" className={`${styles.section} ${styles.reservationSection}`}>
        <div>
          <div className={styles.sectionTag}>Reservations</div>
          <div className={styles.sectionTitle} style={{ fontSize: '40px' }}>Join Us for Dinner</div>
          <div className={styles.sectionSub}>We'd love to have you. Book your table and let us take care of everything else.</div>
          <div style={{ marginTop: '32px', fontSize: '13px', color: '#8a7560', lineHeight: 2 }}>
            <div>📍 &nbsp; 14 Koramangala High St, Bengaluru</div>
            <div>🕕 &nbsp; Mon–Sun · 12pm – 3pm · 7pm – 11pm</div>
            <div>📞 &nbsp; +91 98400 00000</div>
          </div>
        </div>
        <form className={styles.resForm} onSubmit={(e) => { e.preventDefault(); alert('Table reserved! We look forward to welcoming you.'); e.target.reset(); }}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Full Name</label>
              <input type="text" required placeholder="Priya Sharma" />
            </div>
            <div className={styles.formField}>
              <label>Phone</label>
              <input type="tel" required pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" placeholder="+91 00000 00000" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Date</label>
              <input type="date" required min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className={styles.formField}>
              <label>Time</label>
              <select>
                <option>7:00 PM</option>
                <option>7:30 PM</option>
                <option>8:00 PM</option>
                <option>8:30 PM</option>
                <option>9:00 PM</option>
              </select>
            </div>
          </div>
          <div className={styles.formField}>
            <label>Guests</label>
            <select defaultValue="4 Guests">
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option value="4 Guests">4 Guests</option>
              <option>5–8 Guests</option>
              <option>Large party (8+)</option>
            </select>
          </div>
          <button className={styles.btnPrimary} style={{ marginTop: '8px', padding: '16px' }}>Confirm Reservation</button>
        </form>
      </section>

      {/* FOOTER / CONTACT US */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.footerMain}>
          <div className={styles.footerCol}>
            <div className={styles.footerBrand}>Restaurant</div>
            <p style={{ maxWidth: '300px' }}>Where centuries-old recipes meet open-flame cooking. A taste of ancient India, reimagined for the modern palate.</p>
          </div>
          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Contact Us</h4>
            <p>14 Koramangala High St<br />Bengaluru, KA 560095</p>
            <a href="tel:+919840000000">+91 98400 00000</a>
            <a href="mailto:hello@restaurant.com">hello@restaurant.com</a>
          </div>
          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Hours</h4>
            <p>Mon–Sun</p>
            <p>12:00 PM – 3:00 PM<br />7:00 PM – 11:00 PM</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.footerCopy}>© 2026 Restaurant. All rights reserved.</div>
          <div className={styles.footerLinks}>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Zomato</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
