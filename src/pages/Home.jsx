import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FoodCard from '../components/FoodCard'
import ReviewCard from '../components/ReviewCard'
import { MENU } from '../data/menu'
import { REVIEWS } from '../data/reviews'
import { ORDERS } from '../data/orders'
import styles from './Home.module.css'

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

export default function Home() {
  const topItems = getTopSelling();
  const navigate = useNavigate();
  const scrollTo = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      {/* HERO */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.heroBadge}>Est. 2012 · Bengaluru</motion.div>
          <motion.h1 variants={fadeInUp}>A Taste of <em>Ancient</em> India</motion.h1>
          <motion.p variants={fadeInUp}>Where centuries-old recipes meet open-flame cooking. Every dish tells a story — of spice routes, village kitchens, and the warmth of a shared table.</motion.p>
          <motion.div variants={fadeInUp} className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={() => scrollTo(`.${styles.reservationSection}`)}>Book Your Table</button>
            <button className={styles.btnGhost} onClick={() => navigate('/menu')}>Explore Menu</button>
          </motion.div>
        </motion.div>
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

      {/* TESTIMONIALS */}
      <motion.section
        id="reviews"
        className={`${styles.section} ${styles.testimonialsSection}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className={styles.sectionTag} style={{ textAlign: 'center' }}>Guest Stories</motion.div>
        <motion.div variants={fadeInUp} className={styles.sectionTitle}>What Our Guests Say</motion.div>
        <motion.div variants={fadeInUp} className={styles.testimonialGrid}>
          {REVIEWS.map(review => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </motion.div>
      </motion.section>

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
