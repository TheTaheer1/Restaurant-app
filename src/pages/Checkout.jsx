import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { calcTotal, formatPrice } from '../utils/cartSlice'
import styles from './Checkout.module.css'

export default function Checkout() {
  const { items, clearCart } = useCart()
  const navigate = useNavigate()
  const { subtotal, tax, delivery, total } = calcTotal(items)
  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Confirm
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '', payMethod: 'upi' })
  const [placed, setPlaced] = useState(false)

  function handle(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  function placeOrder() {
    setPlaced(true)
    clearCart()
    setTimeout(() => navigate('/profile'), 3000)
  }

  if (placed) {
    return (
      <div className="page">
        <div className={styles.success}>
          <div className={styles.successIcon}>✓</div>
          <h2>Order Placed!</h2>
          <p>Your food is being prepared. We will update you shortly.</p>
          <p className={styles.successSub}>Redirecting to your orders...</p>
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
                      <div className={styles.field}><label>Full Name</label><input name="name" value={form.name} onChange={handle} placeholder="Priya Sharma" /></div>
                      <div className={styles.field}><label>Phone</label><input name="phone" value={form.phone} onChange={handle} placeholder="+91 98400 00000" /></div>
                    </div>
                    <div className={styles.field}><label>Address</label><input name="address" value={form.address} onChange={handle} placeholder="House No, Street, Area" /></div>
                    <div className={styles.row2}>
                      <div className={styles.field}><label>City</label><input name="city" value={form.city} onChange={handle} placeholder="Bengaluru" /></div>
                      <div className={styles.field}><label>Pincode</label><input name="pincode" value={form.pincode} onChange={handle} placeholder="560034" /></div>
                    </div>
                    <button className="btn-primary" onClick={() => setStep(2)} style={{ marginTop: '8px' }}>Continue to Payment →</button>
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
                      <div key={i.id} className={styles.reviewItem}>
                        <span>{i.emoji} {i.name} × {i.qty}</span>
                        <span>{formatPrice(i.price * i.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.btnRow}>
                    <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
                    <button className="btn-primary" onClick={placeOrder}>Place Order ✓</button>
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
                  <div className={styles.line}><span>Delivery</span><span>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
                </div>
                <div className={styles.totalLine}><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
