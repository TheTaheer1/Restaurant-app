import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { calcTotal, formatPrice } from '../utils/cartSlice'
import { ORDERS, addOrder } from '../data/orders'
import ModalPortal from '../components/ModalPortal'
import styles from './Checkout.module.css'

export default function Checkout() {
  const { items, clearCart, discount, applyCoupon, removeCoupon, coupon } = useCart()
  const [form, setForm] = useState({ 
    name: '', phone: '', 
    flat: '', area: '', landmark: '', 
    city: 'Bengaluru', pincode: '', payMethod: 'upi' 
  })
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const fullAddress = `${form.flat}, ${form.area}${form.landmark ? `, ${form.landmark}` : ''}`
  const { subtotal, tax, delivery, total } = calcTotal(items, discount, fullAddress)
  const [errors, setErrors] = useState({})
  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const saved = localStorage.getItem('user_addresses')
    return saved ? JSON.parse(saved) : []
  })

  const detectLocation = () => {
    setIsDetecting(true)
    setTimeout(() => {
      setForm(f => ({
        ...f,
        flat: 'Unit 402, Block B, Uniworld 2',
        area: 'Electronic City Phase 1',
        landmark: 'Near Wipro Gate 5',
        city: 'Bengaluru',
        pincode: '560100'
      }))
      setIsDetecting(false)
      setErrors({})
    }, 1200)
  }

  const VALID_COUPONS = {
    'WELCOME50': 50,
    'FIRST100': 100,
    'SAVE200': 200
  }

  const [isReady, setIsReady] = useState(false)
  const [isOrdered, setIsOrdered] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  useEffect(() => {
    // Pre-fill from active user profile
    const activeUser = localStorage.getItem('active_user')
    if (activeUser) {
      const user = JSON.parse(activeUser)
      setForm(f => ({
        ...f,
        name: user.name || f.name,
        phone: user.phone || f.phone
      }))
    }

    const saved = sessionStorage.getItem('savedAddress')
    if (saved) {
      try {
        setForm(f => ({ ...f, ...JSON.parse(saved) }))
      } catch (e) { /* ignore */ }
    }
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (isReady && !isOrdered) {
      sessionStorage.setItem('savedAddress', JSON.stringify(form))
    }
  }, [form, isReady, isOrdered])

  function handle(e) { 
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleNext() {
    const errs = {}
    if (!form.name.trim() || form.name.trim().length < 3) errs.name = "Full name must be at least 3 characters"
    
    if (!form.phone.trim()) errs.phone = "Phone is required"
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = "Enter a valid 10-digit number"
    
    if (!form.flat.trim()) errs.flat = "Flat/Building is required"
    else if (form.flat.trim().length < 4) errs.flat = "Please enter a valid flat/building name"

    if (!form.area.trim()) errs.area = "Area/Street is required"
    else if (form.area.trim().length < 5) errs.area = "Please enter a valid area/street name"
    
    if (!form.city.trim()) errs.city = "City is required"
    else if (form.city.trim().toLowerCase() !== 'bengaluru') errs.city = "Sorry, we only deliver in Bengaluru for now"
    
    const SERVICEABLE_PINCODES = ['560100', '560034', '560068', '560076', '560102', '560103', '560001', '560002']
    if (!form.pincode.trim()) errs.pincode = "Pincode is required"
    else if (!/^\d{6}$/.test(form.pincode.trim())) errs.pincode = "Enter a valid 6-digit pincode"
    else if (!SERVICEABLE_PINCODES.includes(form.pincode.trim())) errs.pincode = "Please enter a valid serviceable pincode"

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Auto-scroll to the first error field
      setTimeout(() => {
        const firstErrorKey = Object.keys(errs)[0]
        const errorEl = document.getElementsByName(firstErrorKey)[0]
        if (errorEl) {
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          errorEl.focus()
        }
      }, 100)
    } else {
      setErrors({})
      setStep(2)
    }
  }

  function handleCoupon() {
    const code = couponCode.toUpperCase().trim()
    if (VALID_COUPONS[code]) {
      applyCoupon(code, VALID_COUPONS[code])
      setCouponMsg({ text: `Coupon ${code} applied!`, type: 'success' })
      setCouponCode('')
    } else {
      setCouponMsg({ text: 'Invalid coupon code', type: 'error' })
    }
    setTimeout(() => setCouponMsg({ text: '', type: '' }), 3000)
  }

  const QUOTES = [
    "\"One cannot think well, love well, sleep well, if one has not dined well.\"",
    "\"First we eat, then we do everything else.\"",
    "\"Good food is the foundation of genuine happiness.\"",
    "\"Laughter is brightest in the place where food is good.\"",
    "\"Life is uncertain. Eat dessert first.\""
  ]
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

  function placeOrder() {
    try {
      setIsSubmitting(true)
      const newId = 'o' + Math.floor(Math.random() * 1000000)
      
      const newOrder = {
        _id: newId,
        userId: 'u1',
        items: [...items],
        subtotal: subtotal,
        tax: tax,
        delivery: delivery,
        total: total,
        totalAmount: total,
        paymentMethod: form.payMethod,
        status: 'placed',
        createdAt: new Date().toISOString()
      }

      // 1. Save to global store
      addOrder(newOrder)
      
      // 2. Wipe the cart
      clearCart()
      
      // 3. Clear local state
      setIsOrdered(true)
      setIsSubmitting(false)
      
      // 4. Cleanup storage
      localStorage.removeItem('savedAddress')
      sessionStorage.removeItem('savedAddress')
      
      // 5. Navigate to Success Page first
      navigate(`/order-success/${newId}`)
    } catch (err) {
      console.error("CRITICAL CHECKOUT ERROR:", err)
      alert("Order could not be processed. Please try again.")
      setIsSubmitting(false)
    }
  }

  const mapRef = useRef(null)
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 })

  useEffect(() => {
    if (showMap && !window.L) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    } else if (showMap && window.L) {
      setTimeout(initMap, 100)
    }

    function initMap() {
      if (!mapRef.current || !window.L) return
      
      // Cleanup previous instance
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null
        mapRef.current.innerHTML = ''
      }

      const map = window.L.map(mapRef.current, {
        center: [12.9716, 77.5946],
        zoom: 15,
        zoomControl: false
      })

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map)

      map.on('move', () => {
        const center = map.getCenter()
        setMapCenter({ lat: center.lat, lng: center.lng })
      })
    }
  }, [showMap])

  return (
    <div className="page">
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Checkout</h1>
          <div className={styles.steps}>
            {['Delivery', 'Payment', 'Review'].map((s, i) => (
              <div key={s} className={`${styles.step} ${step === i+1 ? styles.stepActive : ''} ${step > i+1 ? styles.stepDone : ''}`}>
                <div className={styles.stepNum}>{step > i+1 ? '✓' : i+1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className="container">
          <div className={styles.layout}>
            <div className={styles.formCol}>
              {step === 1 && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>Delivery Address</h3>
                    <button className={styles.mapTrigger} onClick={() => setShowMap(true)}>
                      <span className={styles.mapIcon}>🗺️</span> Select on Map
                    </button>
                  </div>

                  <div className={styles.fields}>
                    <div className={styles.row2}>
                      <div className={styles.field}>
                        <label>Full Name</label>
                        <input name="name" value={form.name} onChange={handle} placeholder="Priya Sharma" className={errors.name ? styles.inputError : ''} />
                        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                      </div>
                      <div className={styles.field}>
                        <label>Phone</label>
                        <input name="phone" value={form.phone} onChange={handle} placeholder="9840000000" className={errors.phone ? styles.inputError : ''} />
                        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                      </div>
                    </div>

                    {savedAddresses.length > 0 && (
                      <div className={styles.savedAddresses}>
                        <label className={styles.fieldLabel}>Saved Addresses</label>
                        <div className={styles.addrChips}>
                          {savedAddresses.map(addr => (
                            <button 
                              key={addr.id} 
                              className={styles.addrChip}
                              onClick={() => {
                                const fullAddr = addr.address
                                // Extract Pincode (6 digits)
                                const pinMatch = fullAddr.match(/\b\d{6}\b/)
                                const extractedPin = pinMatch ? pinMatch[0] : ''
                                
                                // Extract City (Look for Bengaluru or words near pincode)
                                const cityMatch = fullAddr.match(/Bengaluru|Bangalore/i)
                                const extractedCity = cityMatch ? cityMatch[0] : 'Bengaluru'

                                // Clean address string for Flat/Area
                                let cleanAddr = fullAddr.replace(/\b\d{6}\b/, '').replace(/Bengaluru|Bangalore/i, '').trim()
                                cleanAddr = cleanAddr.replace(/,\s*,/g, ',').replace(/,$/, '').replace(/^,/, '').trim()

                                const parts = cleanAddr.split(', ')
                                if (parts.length >= 2) {
                                  setForm(f => ({
                                    ...f,
                                    flat: parts[0],
                                    area: parts.slice(1).join(', '),
                                    city: extractedCity,
                                    pincode: extractedPin || f.pincode
                                  }))
                                } else {
                                  setForm(f => ({
                                    ...f,
                                    flat: cleanAddr,
                                    area: '',
                                    city: extractedCity,
                                    pincode: extractedPin || f.pincode
                                  }))
                                }
                                setErrors({})
                              }}
                            >
                              <span className={styles.chipIcon}>
                                {addr.label === 'Home' ? '🏠' : addr.label === 'Work' ? '💼' : '📍'}
                              </span>
                              {addr.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={styles.addressBox}>
                      <div className={styles.labelRow}>
                        <label>Detailed Address</label>
                        <button 
                          className={styles.detectBtn} 
                          onClick={detectLocation}
                          disabled={isDetecting}
                        >
                          {isDetecting ? '📍 Locating...' : '📍 Detect My Location'}
                        </button>
                      </div>
                      
                      <div className={styles.field}>
                        <input name="flat" value={form.flat} onChange={handle} placeholder="Flat, House no., Building, Apartment" className={errors.flat ? styles.inputError : ''} />
                        {errors.flat && <span className={styles.errorText}>{errors.flat}</span>}
                      </div>

                      <div className={styles.field}>
                        <input name="area" value={form.area} onChange={handle} placeholder="Area, Colony, Street, Sector" className={errors.area ? styles.inputError : ''} />
                        {errors.area && <span className={styles.errorText}>{errors.area}</span>}
                      </div>

                      <div className={styles.field}>
                        <input name="landmark" value={form.landmark} onChange={handle} placeholder="Landmark (Optional)" />
                      </div>
                    </div>

                    <div className={styles.row2}>
                      <div className={styles.field}>
                        <label>City</label>
                        <input name="city" value={form.city} onChange={handle} placeholder="Bengaluru" className={errors.city ? styles.inputError : ''} />
                        {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                      </div>
                      <div className={styles.field}>
                        <label>Pincode</label>
                        <input name="pincode" value={form.pincode} onChange={handle} placeholder="560100" className={errors.pincode ? styles.inputError : ''} />
                        {errors.pincode ? (
                          <span className={styles.errorText}>{errors.pincode}</span>
                        ) : (
                          <span className={styles.hintText}>Serving Central Bengaluru, E-City, HSR</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.btnRow}>
                      <button className="btn-secondary" onClick={() => navigate('/cart')}>← Back to Cart</button>
                      <button className="btn-primary" onClick={handleNext}>Continue to Payment →</button>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>Payment Method</h3>
                  <div className={styles.payOptions}>
                    {[['upi','UPI / QR Code','📱'],['card','Credit / Debit Card','💳'],['cod','Cash on Delivery','💵']].map(([val, label, icon]) => (
                      <label key={val} className={`${styles.payOption} ${form.payMethod === val ? styles.paySelected : ''}`}>
                        <input type="radio" name="payMethod" value={val} checked={form.payMethod === val} onChange={handle} />
                        <span className={styles.payIcon}>{icon}</span>
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className={styles.btnRow}>
                    <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn-primary" onClick={() => setStep(3)}>Review Order →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>Review & Confirm</h3>
                  <div className={styles.reviewBlock}>
                    <div className={styles.reviewLabel}>Delivering to</div>
                    <p style={{ fontWeight: 600 }}>{form.name} · {form.phone}</p>
                    <div className={styles.reviewAddress}>
                       <span className={styles.addrIcon}>🏠</span>
                       <div>
                         <p>{form.flat}</p>
                         <p>{form.area}</p>
                         {form.landmark && <p className={styles.reviewLandmark}>Lndmrk: {form.landmark}</p>}
                         <p>{form.city} - {form.pincode}</p>
                       </div>
                    </div>
                  </div>
                  <div className={styles.reviewBlock}>
                    <div className={styles.reviewLabel}>Payment</div>
                    <p>{{ upi:'UPI / QR Code', card:'Credit / Debit Card', cod:'Cash on Delivery' }[form.payMethod]}</p>
                  </div>
                  <div className={styles.reviewItems}>
                    {items.map(i => (
                      <div key={i._id} className={styles.reviewItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src={i.image} alt={i.name} className={styles.reviewImg} />
                          <span>{i.name} × {i.qty}</span>
                        </div>
                        <span>{formatPrice(i.price * i.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.btnRow}>
                    <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
                    <button className="btn-primary" onClick={placeOrder} disabled={isSubmitting}>
                      {isSubmitting ? 'Placing Order...' : 'Place Order ✓'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order mini-summary */}
            <div className={styles.summaryCol}>
              <div className={styles.summary}>
                <h3 className={styles.summaryTitle}>Order Total</h3>
                <div className={styles.lines}>
                  <div className={styles.line}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className={styles.line}><span>GST (5%)</span><span>{formatPrice(tax)}</span></div>
                  <div className={styles.line}>
                    <span>Delivery</span>
                    <span>{delivery === 0 ? (subtotal === 0 ? formatPrice(0) : 'FREE') : formatPrice(delivery)}</span>
                  </div>
                  {discount > 0 && (
                    <div className={`${styles.line} ${styles.discountLine}`}>
                      <span>Discount ({coupon})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>
                <div className={styles.totalLine}><span>Total</span><span>{formatPrice(total)}</span></div>
                
                {/* Coupon Input */}
                <div className={styles.couponSection}>
                  <div className={styles.couponInputWrap}>
                    <input 
                      placeholder="Enter Coupon (WELCOME50)" 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                    />
                    <button onClick={handleCoupon}>Apply</button>
                  </div>
                  {couponMsg.text && (
                    <div className={`${styles.couponMsg} ${styles[couponMsg.type]}`}>
                      {couponMsg.text}
                    </div>
                  )}
                  {coupon && (
                    <button className={styles.removeCoupon} onClick={removeCoupon}>Remove {coupon}</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showMap && (
          <ModalPortal>
            <div className={styles.modalOverlay}>
              <motion.div 
                className={styles.mapModal}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
              >
                <div className={styles.modalHeader}>
                  <div>
                    <h3 className={styles.modalTitle}>Select Delivery Location</h3>
                    <p className={styles.modalSub}>Move the map to place the pin on your doorstep</p>
                  </div>
                  <button className={styles.closeBtn} onClick={() => setShowMap(false)}>✕</button>
                </div>

                <div className={styles.mapContainer}>
                  {/* Real Interactive Map */}
                  <div ref={mapRef} className={styles.mapVisual}></div>
                  
                  {/* Center Pin Overlay */}
                  <div className={styles.mapPinOverlay}>
                    <div className={styles.mapPin}>📍</div>
                    <div className={styles.mapPulse}></div>
                  </div>
                  
                  <div className={styles.locationInfo}>
                    <div className={styles.locIcon}>🏠</div>
                    <div className={styles.locText}>
                      <div className={styles.locMain}>Uniworld 2, Block B</div>
                      <div className={styles.locSub}>
                        Lat: {mapCenter.lat.toFixed(4)}, Lng: {mapCenter.lng.toFixed(4)}
                        <br /> Bengaluru, Karnataka 560100
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button className={styles.confirmBtn} onClick={() => {
                    // Simulate fetching address for coordinates
                    const areas = ['Electronic City Phase 1', 'Koramangala 4th Block', 'HSR Layout Sector 2', 'Indiranagar 12th Main'];
                    const randomArea = areas[Math.floor(Math.random() * areas.length)];
                    
                    setForm(f => ({
                      ...f,
                      flat: `Unit ${Math.floor(Math.random() * 900 + 100)}, Block ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`,
                      area: randomArea,
                      city: 'Bengaluru',
                      pincode: '560100'
                    }));
                    setShowMap(false);
                  }}>
                    Confirm Location & Proceed
                  </button>
                </div>
              </motion.div>
            </div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </div>
  )
}
