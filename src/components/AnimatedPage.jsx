import { useEffect } from 'react'
import { motion } from 'framer-motion'

const pageVariants = {
  initial:  { opacity: 0, x: 32, filter: 'blur(4px)' },
  animate:  { opacity: 1, x: 0,  filter: 'blur(0px)' },
  exit:     { opacity: 0, x: -24, filter: 'blur(2px)' },
}

const pageTransition = {
  duration: 0.38,
  ease: [0.25, 0.46, 0.45, 0.94],
}

export default function AnimatedPage({ children, className = '' }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}
