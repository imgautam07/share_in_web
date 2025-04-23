import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

import * as jwt_decode from 'jwt-decode'
const jwtDecode = jwt_decode.jwtDecode

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  
  const baseUrl = "http://3.12.1.104:4000" // From constants.dart
  
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      
      try {
        const response = await axios.post(`${baseUrl}/api/auth/verify-token`, {}, {
          headers: {
            'x-auth-token': token
          }
        })
        
        if (response.status === 200) {
          const decoded = jwtDecode(token)
          setUser(decoded)
        } else {
          logout()
        }
      } catch (error) {
        console.error('Error verifying token:', error)
        logout()
      } finally {
        setLoading(false)
      }
    }
    
    verifyToken()
  }, [token])
  
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${baseUrl}/api/auth/signin`, {
        email,
        password
      })
      
      if (response.status === 200) {
        const { token } = response.data
        localStorage.setItem('token', token)
        setToken(token)
        const decoded = jwtDecode(token)
        setUser(decoded)
        return true
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.response?.status === 400) {
        throw new Error("There is no account with these credentials")
      } else if (error.response?.status === 500) {
        throw new Error("Sorry! We're facing issues with our server.")
      } else {
        throw new Error("An error occurred. Please try again.")
      }
    }
    return false
  }
  
  const register = async (email, name, password) => {
    try {
      const response = await axios.post(`${baseUrl}/api/auth/signup`, {
        email,
        password,
        name
      })
      
      if (response.status === 200) {
        const { token } = response.data
        localStorage.setItem('token', token)
        setToken(token)
        const decoded = jwtDecode(token)
        setUser(decoded)
        return true
      }
    } catch (error) {
      console.error('Registration error:', error)
      if (error.response?.status === 400) {
        throw new Error("There is an account with these credentials")
      } else if (error.response?.status === 500) {
        throw new Error("Sorry! We're facing issues with our server.")
      } else {
        throw new Error("An error occurred. Please try again.")
      }
    }
    return false
  }
  
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }
  
  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}