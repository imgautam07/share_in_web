import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import bgImage from '../assets/bg.png'
import googleIcon from '../assets/google.png'
import appleIcon from '../assets/apple.png'
import TextField from '../components/common/TextField'
import Button from '../components/common/Button'
import ScaleButton from '../components/common/ScaleButton'
import { useAuth } from '../contexts/AuthContext'
import { isValidEmail } from '../utils/helpers'

const Register = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  // Validators
  const emailValidator = (value) => {
    if (!value.trim()) return "Enter your email"
    if (!isValidEmail(value)) return "Invalid email address"
    return null
  }
  
  const nameValidator = (value) => {
    if (!value.trim()) return "Enter your name"
    if (value.length < 3) return "Must have at least 3 characters"
    return null
  }
  
  const passwordValidator = (value) => {
    if (!value) return "Enter a password"
    if (value.length < 6) return "Must have at least 6 characters"
    return null
  }
  
  const confirmPasswordValidator = (value) => {
    if (!value) return "Enter your password again"
    if (value.length < 6) return "Must have at least 6 characters"
    if (value !== password) return "Passwords didn't match"
    return null
  }

  const handleRegister = async () => {
    // Validate inputs
    if (!email || !name || !password || !confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }
    
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email")
      return
    }
    
    if (name.length < 3) {
      toast.error("Name must be at least 3 characters")
      return
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    
    setLoading(true)
    
    try {
      await register(email, name, password)
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-[#D0D4E3] bg-opacity-40 z-10" />
      
      {/* Back button */}
      <div className="absolute top-12 left-4 z-30">
        <ScaleButton onClick={() => navigate(-1)}>
          <div className="bg-white rounded-full p-4 shadow-lg bg-opacity-60">
            <div className="bg-[#D0D4E3] bg-opacity-40 rounded-full p-4">
              <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
            </div>
          </div>
        </ScaleButton>
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex-1 flex flex-col px-8 pt-12 pb-4 overflow-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl font-medium mb-2">Welcome!</h1>
            <p className="text-2xl font-extralight">
              Fill your details.
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              validator={nameValidator}
            />
            
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              validator={passwordValidator}
            />
            
            <TextField
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              validator={confirmPasswordValidator}
            />
          </div>
          
          <div className="mt-8">
            <Button 
              text="Sign Up" 
              onClick={handleRegister}
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
        </div>
      </div>
    </div>
  )
}

export default Register