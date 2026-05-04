import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const initialState = { items: [], isOpen: false, coupon: null, discount: 0 }

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i._id === action.payload._id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.payload._id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i._id !== action.payload) }
    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter(i => i._id !== action.payload._id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload._id ? { ...i, qty: action.payload.qty } : i
        ),
      }
    }
    case 'CLEAR_CART':
      return { ...state, items: [], coupon: null, discount: 0 }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload.code, discount: action.payload.discount }
    case 'REMOVE_COUPON':
      return { ...state, coupon: null, discount: 0 }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : initial
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state))
  }, [state])

  const addItem    = (item)          => dispatch({ type: 'ADD_ITEM',    payload: item })
  const removeItem = (_id)           => dispatch({ type: 'REMOVE_ITEM', payload: _id })
  const updateQty  = (_id, qty)      => dispatch({ type: 'UPDATE_QTY',  payload: { _id, qty } })
  const clearCart  = ()              => dispatch({ type: 'CLEAR_CART' })
  const toggleCart = ()              => dispatch({ type: 'TOGGLE_CART' })
  const applyCoupon = (code, discount) => dispatch({ type: 'APPLY_COUPON', payload: { code, discount } })
  const removeCoupon = ()            => dispatch({ type: 'REMOVE_COUPON' })

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      coupon: state.coupon,
      discount: state.discount,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      toggleCart,
      applyCoupon,
      removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
