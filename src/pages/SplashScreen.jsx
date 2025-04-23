import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import bgImage from '../assets/bg.png'
import logoRounded from '../assets/logo_rounded.png'

const SplashScreen = () => {
  const navigate = useNavigate()

  useEffect(() => {

    console.log("hii");

    const token = localStorage.getItem('token')

    // After 2 seconds, redirect to login or dashboard based on token
    const timer = setTimeout(() => {
      if (token) {
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="h-screen w-full relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-[#D0D4E3] bg-opacity-10 z-10" />

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="z-20"
      >
        <img
          src={logoRounded}
          alt="ShareIn Logo"
          className="w-48 h-48 object-contain"
        />
      </motion.div>
    </div>
  )
}

export default SplashScreen