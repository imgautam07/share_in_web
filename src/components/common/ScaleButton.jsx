import { motion } from 'framer-motion'
import { useState } from 'react'

const ScaleButton = ({
  children,
  onClick,
  disabled = false,
  scale = 0.97,
  className = '',
  opacity = 0.75
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = async () => {
    if (disabled) return
    
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
    
    if (onClick) {
      try {
        await onClick()
      } catch (error) {
        console.error('Error in ScaleButton onClick:', error)
      }
    }
  }

  return (
    <motion.div
      className={`${className} ${disabled ? 'opacity-50' : ''}`}
      whileTap={{ scale }}
      style={{ 
        opacity: isPressed ? opacity : 1,
        transition: 'opacity 50ms'
      }}
      onClick={handleClick}
    >
      <div className="relative">
        {children}
      </div>
    </motion.div>
  )
}

export default ScaleButton