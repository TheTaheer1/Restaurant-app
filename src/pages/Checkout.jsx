import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { calcTotal, formatPrice } from '../utils/cartSlice'
import { ORDERS, addOrder } from '../data/orders'
import styles from './Checkout.module.css'

export default function Checkout() {
  const { items, clearCart, discount, applyCoupon, removeCoupon, coupon } = useCart()
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '', payMethod: 'upi' })
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const { subtotal, tax, delivery, total } = calcTotal(items, discount, form.address)
  const [errors, setErrors] = useState({})
  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)

  const detectLocation = () => {
    setIsDetecting(true)
    setTimeout(() => {
      setForm(f => ({
        ...f,
        address: 'Uniworld 2, Electronic City, Phase 1',
        city: 'Bengaluru',
        pincode: '560100'
      }))
      setIsDetecting(false)
      setErrors(e => ({ ...e, address: '', city: '', pincode: '' }))
    }, 1200)
  }

  const VALID_COUPONS = {
    'WELCOME50': 50,
    'FIRST100': 100,
    'SAVE200': 200
  }

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem('savedAddress')
    if (saved) {
      try {
        setForm(JSON.parse(saved))
      } catch (e) { /* ignore */ }
    }
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (isReady) {
      sessionStorage.setItem('savedAddress', JSON.stringify(form))
    }
  }, [form, isReady])

  function handle(e) { 
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleNext() {
    const errs = {}
    if (!form.name.trim() || form.name.trim().length < 3) errs.name = "Full name must be at least 3 characters"
    
    if (!form.phone.trim()) errs.phone = "Phone is required"
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = "Enter a valid 10-digit number"
    
    if (!form.address.trim()) errs.address = "Address is required"
    else if (form.address.trim().length < 15) errs.address = "Please enter a detailed address (min 15 chars)"
    else if (!form.address.trim().includes(' ') || form.address.trim().split(' ').length < 3) errs.address = "Please enter a valid street and area (e.g. 123 Main St, Indiranagar)"
    
    if (!form.city.trim()) errs.city = "City is required"
    else if (!/^[a-zA-Z\s]+$/.test(form.city.trim())) errs.city = "City name should only contain letters"
    else if (form.city.trim().toLowerCase() !== 'bengaluru') errs.city = "Sorry, we only deliver in Bengaluru for now"
    
    const SERVICEABLE_PINCODES = ['560100', '560034', '560068', '560076', '560102', '560103', '560001', '560002']
    if (!form.pincode.trim()) errs.pincode = "Pincode is required"
    else if (!/^\d{6}$/.test(form.pincode.trim())) errs.pincode = "Enter a valid 6-digit pincode"
    else if (!SERVICEABLE_PINCODES.includes(form.pincode.trim())) errs.pincode = "Please enter a valid serviceable pincode"

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
    } else {
      setErrors({})
      localStorage.setItem('savedAddress', JSON.stringify({
        name: form.name, phone: form.phone, address: form.address, city: form.city, pincode: form.pincode
      }))
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

  const [showSuccess, setShowSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const QUOTES = [
    "\"One cannot think well, love well, sleep well, if one has not dined well.\"",
    "\"First we eat, then we do everything else.\"",
    "\"Good food is the foundation of genuine happiness.\"",
    "\"Laughter is brightest in the place where food is good.\"",
    "\"Life is uncertain. Eat dessert first.\""
  ]
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

  function placeOrder() {
    setIsSubmitting(true)
    const newId = 'o' + Math.floor(Math.random() * 1000000)
    setOrderId(newId)
    
    // Create new order object
    const newOrder = {
      _id: newId,
      userId: 'u1', // Mock user
      items: items.map(i => ({ menuItemId: i._id, name: i.name, qty: i.qty, price: i.price })),
      totalAmount: total,
      status: 'placed',
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    }

    // Push to mock global data
    addOrder(newOrder)

    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      clearCart()
      sessionStorage.removeItem('savedAddress')
      setTimeout(() => navigate(`/order-tracking/${newId}`), 4000)
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className="page" style={{ background: 'var(--brown-darkest)' }}>
        <div className={styles.successScreen}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Order Placed Successfully!</h2>
            <div className={styles.quoteBox}>
              <p className={styles.quoteText}>{quote}</p>
            </div>
            <p className={styles.successSub}>Preparing your meal with love...</p>
          </div>
        </div>
      </div>
    )
  }

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
                  <h3 className={styles.cardTitle}>Delivery Address</h3>
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
                    <div className={styles.field}>
                      <div className={styles.labelRow}>
                        <label>Address</label>
                        <button 
                          className={styles.detectBtn} 
                          onClick={detectLocation}
                          disabled={isDetecting}
                        >
                          {isDetecting ? '📍 Locating...' : '📍 Detect My Location'}
                        </button>
                      </div>
                      <input name="address" value={form.address} onChange={handle} placeholder="House No, Street, Area" className={errors.address ? styles.inputError : ''} />
                      {errors.address && <span className={styles.errorText}>{errors.address}</span>}
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
                          <span className={styles.hintText}>Serving Koramangala, E-City, HSR & Central Bengaluru</span>
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
                    <p>{form.name}, {form.phone}</p>
                    <p>{form.address}, {form.city} - {form.pincode}</p>
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
    </div>
  )
}
