import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const TextField = ({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  validator = null,
  className = ''
}) => {
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(type === 'password')
  const inputRef = useRef(null)

  const handleFocus = () => setFocused(true)
  const handleBlur = () => {
    setFocused(false)
    if (validator && value) {
      const validationError = validator(value)
      setError(validationError)
    }
  }

  const handleChange = (e) => {
    onChange(e)
    if (error && validator) {
      const validationError = validator(e.target.value)
      setError(validationError)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const actualType = type === 'password' ? (showPassword ? 'password' : 'text') : type

  return (
    <div className={`w-full ${className}`}>
      <div 
        className={`
          relative rounded-lg transition-all duration-300 ease-out
          ${focused ? 'shadow-[0_0_15px_5px_rgba(208,212,227,0.8)]' : 'shadow-[0_0_10px_2px_rgba(208,212,227,0.3)]'}
          bg-[#d0d4e3]
        `}
      >
        <input
          ref={inputRef}
          type={actualType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            w-full p-5 rounded-lg outline-none
            bg-white bg-opacity-${focused ? '60' : '50'}
          `}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        )}
      </div>
      
      <div className="h-6 overflow-hidden">
        {error && (
          <p className="text-red-500 text-xs pl-3 pt-1 transition-all duration-200">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default TextField