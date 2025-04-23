import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AddFile from './pages/AddFile'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import SplashScreen from './pages/SplashScreen'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate initialization process
    console.log("hii");
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <SplashScreen />
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-file" element={<AddFile />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </AuthProvider>
  )
}

export default App