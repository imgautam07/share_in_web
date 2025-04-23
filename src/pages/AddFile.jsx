import { faFolder, faMinus, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../components/common/Button'
import ScaleButton from '../components/common/ScaleButton'
import TextField from '../components/common/TextField'
import { useAuth } from '../contexts/AuthContext'
import { filesAPI } from '../services/api'
import { formatFileSize } from '../utils/helpers'


import * as jwt_decode from 'jwt-decode'
const jwtDecode = jwt_decode.jwtDecode

const AddFile = () => {
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { token } = useAuth()

  const handleFileSelect = () => {
    const input = document.createElement('input')
    input.type = 'file'

    input.onchange = (e) => {
      if (e.target.files.length) {
        const selectedFile = e.target.files[0]

        // Check file size (25MB limit)
        if (selectedFile.size > 25 * 1024 * 1024) {
          toast.error('File size exceeds 25MB limit')
          return
        }

        setFile(selectedFile)

        // Auto-set filename based on the file name
        const name = selectedFile.name.split('.')
        name.pop() // Remove extension
        setFileName(name.join('.'))
      }
    }

    input.click()
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFileName('')
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    if (!fileName.trim()) {
      toast.error('Please add a name to the file')
      return
    }

    setLoading(true)

    try {
      // Get user ID from token for access control
      const decoded = jwtDecode(token)
      const userId = decoded.userId || decoded.id

      await filesAPI.upload(file, fileName, [userId])
      toast.success('File uploaded successfully')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-xl bg-[#D0D4E3] bg-opacity-40">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="pt-safe-top">
          <div className="h-16 flex items-center px-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 flex flex-col">
          <div className="mt-7 mb-3">
            <ScaleButton onClick={handleFileSelect} scale={1.01}>
              <div className="border-2 border-dashed border-gray-400 rounded-3xl">
                <div className="h-44 flex flex-col items-center justify-center">
                  <FontAwesomeIcon icon={faUpload} className="text-2xl mb-6" />
                  <p className="font-bold">Select file</p>
                  <p className="text-xs text-black text-opacity-50">Tap here to select file.</p>
                </div>
              </div>
            </ScaleButton>
          </div>

          <div className="text-right text-sm mb-2">
            <span>Max Size: 25 MB</span>
          </div>

          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="border border-[#fd6b67] bg-white bg-opacity-[0.13] rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl border-[0.5px] border-[#fd6b67] border-opacity-40 bg-white bg-opacity-10 shadow-[0_0_100px_rgba(253,107,103,0.8)]">
                    <FontAwesomeIcon icon={faFolder} className="text-[#fd6b67]" />
                  </div>

                  <div className="ml-5 flex-1">
                    <p className="font-bold">{file.name}</p>
                    <p className="text-sm">{formatFileSize(file.size)}</p>
                  </div>

                  <button
                    onClick={handleRemoveFile}
                    className="p-2 text-red-500"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mb-8">
            <TextField
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Name this file"
            />
          </div>

          <div className="mt-auto pb-safe-bottom mb-8">
            <Button
              text="Upload"
              onClick={handleUpload}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddFile