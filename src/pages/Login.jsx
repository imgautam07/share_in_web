import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import bgImage from '../assets/bg.png'
import googleIcon from '../assets/google.png'
import appleIcon from '../assets/apple.png'
import TextField from '../components/common/TextField'
import Button from '../components/common/Button'
import ScaleButton from '../components/common/ScaleButton'
import { useAuth } from '../contexts/AuthContext'
import { isValidEmail } from '../utils/helpers'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  // Validators
  const emailValidator = (value) => {
    if (!value.trim()) return "Enter your email address"
    if (!isValidEmail(value)) return "Invalid email address"
    return null
  }
  
  const passwordValidator = (value) => {
    if (!value) return "Enter your password"
    if (value.length < 6) return "Must have 6 characters minimum"
    return null
  }

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }
    
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email")
      return
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    
    setLoading(true)
    
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    // This would open a modal in the original app
    toast.info("Forgot password functionality coming soon")
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-[#D0D4E3] bg-opacity-40 z-10" />
      
      {/* Content */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-12 pb-4 overflow-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium mb-2">Hello Again!</h1>
            <p className="text-2xl font-extralight">
              Welcome back you've<br />been missed!
            </p>
          </div>
          
          <div className="space-y-4 mb-4">
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email username"
              validator={emailValidator}
            />
            
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              validator={passwordValidator}
            />
            
            <div className="flex justify-end">
              <button 
                className="text-black font-bold text-sm tracking-wide"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              text="Sign in" 
              onClick={handleLogin}
              loading={loading}
            />
          </div>
          
          <div className="flex items-center my-12">
            <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent to-gray-800" />
            <span className="px-3 text-gray-800 font-semibold text-sm">Or continue with</span>
            <div className="flex-1 h-0.5 bg-gradient-to-l from-transparent to-gray-800" />
          </div>
          
          <div className="flex justify-center gap-8">
            <ScaleButton>
              <div className="p-4 px-6 border border-white rounded-xl">
                <img src={googleIcon} alt="Google" className="h-8" />
              </div>
            </ScaleButton>
            
            <ScaleButton>
              <div className="p-4 px-6 border border-white rounded-xl">
                <img src={appleIcon} alt="Apple" className="h-8" />
              </div>
            </ScaleButton>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/register" className="font-bold text-base">
              <span className="text-black">Not a member? </span>
              <span className="text-blue-700">Register Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
