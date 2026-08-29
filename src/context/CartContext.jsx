import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const initialState = { items: [], wishlist: [], isOpen: false, coupon: null, discount: 0, toast: null }

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
    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.some(item => item._id === action.payload._id)
      return {
        ...state,
        wishlist: exists
          ? state.wishlist.filter(item => item._id !== action.payload._id)
          : [...state.wishlist, action.payload],
      }
    }
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload }
    case 'HIDE_TOAST':
      return { ...state, toast: null }
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

function getInitialState() {
  const saved = localStorage.getItem('cart')
  if (!saved) return initialState

  try {
    const parsed = JSON.parse(saved)
    return {
      ...initialState,
      ...parsed,
      items: parsed.items || [],
      reservations: parsed.reservations || [],
    }
  } catch (error) {
    return initialState
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem('cart')
      if (!saved) return initial
      const parsed = JSON.parse(saved)
      return {
        ...initial,
        ...parsed,
        items: parsed.items || [],
        wishlist: parsed.wishlist || [],
        coupon: parsed.coupon || null,
        discount: parsed.discount || 0,
        isOpen: false,
        toast: null,
      }
    } catch {
      return initial
    }
  })

  useEffect(() => {
    const cartState = {
      items: state.items,
      wishlist: state.wishlist,
      coupon: state.coupon,
      discount: state.discount,
    }
    localStorage.setItem('cart', JSON.stringify(cartState))
    if (state.items.length === 0) {
      sessionStorage.removeItem('savedAddress')
      localStorage.removeItem('savedAddress')
    }
  }, [state.items, state.wishlist, state.coupon, state.discount])

  const addItem    = (item)          => dispatch({ type: 'ADD_ITEM',    payload: item })
  const removeItem = (_id)           => dispatch({ type: 'REMOVE_ITEM', payload: _id })
  const updateQty  = (_id, qty)      => dispatch({ type: 'UPDATE_QTY',  payload: { _id, qty } })
  const toggleWishlist = (item)      => dispatch({ type: 'TOGGLE_WISHLIST', payload: item })
  const showToast  = (title, subtitle = 'Added to your cart') => dispatch({ type: 'SHOW_TOAST', payload: { title, subtitle } })
  const hideToast  = ()              => dispatch({ type: 'HIDE_TOAST' })
  const clearCart  = ()              => {
    dispatch({ type: 'CLEAR_CART' })
    sessionStorage.removeItem('savedAddress')
    localStorage.removeItem('savedAddress')
  }
  const addReservation = (reservation) => dispatch({ type: 'ADD_RESERVATION', payload: reservation })
  const removeReservation = (_id) => dispatch({ type: 'REMOVE_RESERVATION', payload: _id })
  const clearReservations = () => dispatch({ type: 'CLEAR_RESERVATIONS' })
  const toggleCart = ()              => dispatch({ type: 'TOGGLE_CART' })
  const applyCoupon = (code, discount) => dispatch({ type: 'APPLY_COUPON', payload: { code, discount } })
  const removeCoupon = ()            => dispatch({ type: 'REMOVE_COUPON' })

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      wishlist: state.wishlist,
      isOpen: state.isOpen,
      coupon: state.coupon,
      discount: state.discount,
      toast: state.toast,
      totalItems,
      totalPrice,
      wishlistCount: state.wishlist.length,
      addItem,
      removeItem,
      updateQty,
      toggleWishlist,
      showToast,
      hideToast,
      clearCart,
      addReservation,
      removeReservation,
      clearReservations,
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
