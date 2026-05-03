import { Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  const scrollTo = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Est. 2012 · Bengaluru</div>
          <h1>A Taste of <em>Ancient</em> India</h1>
          <p>Where centuries-old recipes meet open-flame cooking. Every dish tells a story — of spice routes, village kitchens, and the warmth of a shared table.</p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={() => scrollTo(`.${styles.reservationSection}`)}>Book Your Table</button>
            <button className={styles.btnGhost} onClick={() => scrollTo(`.${styles.menuSection}`)}>Explore Menu</button>
          </div>
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

      {/* MENU SECTION */}
      <section className={`${styles.section} ${styles.menuSection}`}>
        <div className={styles.menuHeader}>
          <div>
            <div className={styles.sectionTag}>Signature Dishes</div>
            <div className={styles.sectionTitle}>From Our Kitchen</div>
          </div>
          <Link to="/menu" className={styles.btnGhost} style={{ padding: '12px 28px', fontSize: '12px' }}>Full Menu →</Link>
        </div>
        <div className={styles.menuGrid}>
          <div className={styles.menuCard}>
            <div className={styles.menuCardImgPlaceholder}>🍛</div>
            <div className={styles.menuCardBody}>
              <div className={styles.menuCardTag}>Chef's Special</div>
              <div className={styles.menuCardName}>Raan-e-Sikandari</div>
              <div className={styles.menuCardDesc}>Slow-roasted whole leg of lamb marinated 48 hours in yoghurt, saffron & royal spices.</div>
              <div className={styles.menuCardFooter}>
                <div className={styles.menuPrice}>₹1,650</div>
                <div className={styles.menuSpice}>
                  <div className={`${styles.chili} ${styles.chiliHot}`}></div><div className={`${styles.chili} ${styles.chiliHot}`}></div><div className={styles.chili}></div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.menuCard}>
            <div className={styles.menuCardImgPlaceholder}>🥘</div>
            <div className={styles.menuCardBody}>
              <div className={styles.menuCardTag}>Village Classic</div>
              <div className={styles.menuCardName}>Dal Makhani</div>
              <div className={styles.menuCardDesc}>Black lentils slow-cooked overnight in a wood-fired pot with hand-churned cream and ghee.</div>
              <div className={styles.menuCardFooter}>
                <div className={styles.menuPrice}>₹480</div>
                <div className={styles.menuSpice}>
                  <div className={`${styles.chili} ${styles.chiliHot}`}></div><div className={styles.chili}></div><div className={styles.chili}></div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.menuCard}>
            <div className={styles.menuCardImgPlaceholder}>🔥</div>
            <div className={styles.menuCardBody}>
              <div className={styles.menuCardTag}>From the Tandoor</div>
              <div className={styles.menuCardName}>Seekh Kebab Platter</div>
              <div className={styles.menuCardDesc}>Minced lamb with fresh herbs, charred over live charcoal and served with mint chutney.</div>
              <div className={styles.menuCardFooter}>
                <div className={styles.menuPrice}>₹720</div>
                <div className={styles.menuSpice}>
                  <div className={`${styles.chili} ${styles.chiliHot}`}></div><div className={`${styles.chili} ${styles.chiliHot}`}></div><div className={`${styles.chili} ${styles.chiliHot}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <div className={styles.experienceSection}>
        <div className={styles.expImgSide}></div>
        <div className={styles.expTextSide}>
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
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section className={`${styles.section} ${styles.testimonialsSection}`}>
        <div className={styles.sectionTag} style={{ textAlign: 'center' }}>Guest Stories</div>
        <div className={styles.sectionTitle}>What Our Guests Say</div>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <div className={styles.testimonialText}>"The Raan-e-Sikandari was unlike anything I've tasted. Fell right off the bone. The whole ambiance takes you back in time."</div>
            <div className={styles.testimonialAuthor}>— Priya M., Bengaluru</div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <div className={styles.testimonialText}>"We celebrated our anniversary here and it was magical. The private room, the attentive service, the food — perfection."</div>
            <div className={styles.testimonialAuthor}>— Arjun & Kavitha</div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>★★★★★</div>
            <div className={styles.testimonialText}>"Best dal makhani in the city. No contest. I've been coming every month for two years and it never disappoints."</div>
            <div className={styles.testimonialAuthor}>— Rahul S., Mumbai</div>
          </div>
        </div>
      </section>

      {/* RESERVATION */}
      <section className={`${styles.section} ${styles.reservationSection}`}>
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
        <form className={styles.resForm} onSubmit={(e) => { e.preventDefault(); alert('Table reserved! We look forward to welcoming you.'); }}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Full Name</label>
              <input type="text" placeholder="Priya Sharma" />
            </div>
            <div className={styles.formField}>
              <label>Phone</label>
              <input type="tel" placeholder="+91 00000 00000" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Date</label>
              <input type="date" />
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

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Saffron & Smoke</div>
        <div className={styles.footerCopy}>© 2026 Saffron & Smoke. All rights reserved.</div>
        <div className={styles.footerLinks}>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
          <a href="#">Zomato</a>
        </div>
      </footer>
    </div>
  )
}
