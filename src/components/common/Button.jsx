import { useState } from 'react'
import { motion } from 'framer-motion'

const Button = ({ text, onClick, loading = false, className = '' }) => {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = async () => {
    if (loading) return
    
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 100)
    
    try {
      await onClick()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`w-full relative overflow-hidden rounded-xl ${className}`}
      style={{ 
        opacity: isPressed ? 0.85 : 1,
        transition: 'opacity 100ms'
      }}
      disabled={loading}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
      <div 
        className="relative py-4 rounded-xl w-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(90deg, rgba(253,107,103,0.9) 0%, rgba(253,107,103,1) 50%, rgba(253,107,103,0.9) 100%)'
        }}
      >
        {loading ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <span className="text-white font-bold">{text}</span>
        )}
      </div>
    </motion.button>
  )
}

export default Button