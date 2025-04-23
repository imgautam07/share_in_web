import { useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { formatDate } from '../../utils/helpers'
import { filesAPI } from '../../services/api'
import { toast } from 'react-toastify'
import TextField from '../common/TextField'
import Button from '../common/Button'
import { isValidEmail } from '../../utils/helpers'

const ShareView = ({ file, onClose }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleShare = async () => {
    if (!isValidEmail(email)) {
      toast.error("Invalid email address")
      return
    }
    
    setLoading(true)
    
    try {
      await filesAPI.shareViaEmail(file.id, email)
      toast.success("Mail sent successfully!")
      onClose()
    } catch (error) {
      console.error('Error sharing file:', error)
      toast.error("Failed to share file")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-lg" onClick={onClose}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-white bg-opacity-50 backdrop-blur-md rounded-xl overflow-hidden"
      >
        {/* Preview area */}
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 blur-3xl opacity-80">
            {file.previewImage && (
              <img 
                src={file.previewImage} 
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="absolute top-0 right-0 p-2 z-10">
            <button 
              onClick={onClose}
              className="bg-gray-500 rounded-full w-6 h-6 flex items-center justify-center text-white"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xs" />
            </button>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-52 h-28 border-4 border-gray-300 rounded-lg overflow-hidden shadow-lg">
              {file.previewImage ? (
                <img 
                  src={file.previewImage} 
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Preview</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold">{file.name}</h3>
            <p className="text-sm">
              {file.type.charAt(0).toUpperCase() + file.type.slice(1)} | {formatDate(file.createdAt)}
            </p>
          </div>
          
          <div className="opacity-60 mb-6">
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              validator={(val) => !val ? "Enter an email address" : !isValidEmail(val) ? "Invalid email address" : null}
            />
          </div>
          
          <Button
            text="Send Mail"
            onClick={handleShare}
            loading={loading}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default ShareView