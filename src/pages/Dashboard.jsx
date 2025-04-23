import { faPlus, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import bgImage from '../assets/bg.png'
import noDataSvg from '../assets/no_data.svg'
import ScaleButton from '../components/common/ScaleButton'
import DocTile from '../components/dashboard/DocTile'
import ShareView from '../components/dashboard/ShareView'
import { useAuth } from '../contexts/AuthContext'
import { filesAPI } from '../services/api'

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [files, setFiles] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const navigate = useNavigate()
  const { logout, token } = useAuth()

  const categories = ['All', 'Docs', 'Sheets', 'Media', 'Others']

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const response = await filesAPI.getAll()
      setFiles(response.data.files || [])
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('Failed to load files')
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    logout()
    navigate('/login')
  }

  const filteredFiles = files
    ? files.filter(file =>
      selectedCategory === 'All' || file.type.toLowerCase() === selectedCategory.toLowerCase()
    )
    : []

  const handleDeleteFile = (fileId) => {
    setFiles(prev => prev.filter(file => file._id !== fileId))
  }

  const handleShareFile = (file) => {
    setSelectedFile(file)
    setShowShareModal(true)
  }

  const handleAddFile = () => {
    navigate('/add-file')
  }

  const getUserNameFromToken = () => {
    if (!token) return 'User'
    try {
      const decoded = jwtDecode(token)
      return decoded.name || 'User'
    } catch (error) {
      console.error('Error decoding token:', error)
      return 'User'
    }
  }

  const userName = getUserNameFromToken()

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-gray-50">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-[#D0D4E3] bg-opacity-40 z-10" />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30"
      >
        <div className="relative backdrop-blur-md bg-white bg-opacity-50 rounded-b-3xl overflow-hidden pb-8">
          <div className="pt-12 px-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-medium">Hello {userName}</h2>
                <p className="text-sm font-semibold italic underline decoration-1">Welcome Back!</p>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-black"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>

            <div className="mt-5 relative">
              <div className="overflow-x-auto pb-2 hide-scrollbar">
                <div className="flex space-x-3 pr-16">
                  {categories.map(category => (
                    <ScaleButton
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      disabled={selectedCategory === category}
                    >
                      <div
                        className={`
                          py-2 px-5 rounded-full border border-black border-opacity-15
                          ${selectedCategory === category
                            ? 'bg-black text-white'
                            : 'bg-black bg-opacity-[0.02]'}
                        `}
                      >
                        {category}
                      </div>
                    </ScaleButton>
                  ))}
                </div>
              </div>

              <div className="absolute right-0 bottom-0 top-0 z-10 flex items-center">
                <div className="w-16 h-full bg-gradient-to-l from-white via-[rgba(242,242,247,0.8)] to-transparent"></div>
                <button
                  className="absolute right-0 p-3 text-black"
                  onClick={() => navigate('/search')}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Files list */}
      <div className="relative z-20 flex-1 px-6">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#fd6b67] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="py-6 space-y-5">
            {filteredFiles.map(file => (
              <DocTile
                key={file._id}
                file={file}
                onDelete={handleDeleteFile}
                onShare={() => handleShareFile(file)}
              />
            ))}
            <div className="h-40"></div> {/* Spacing for FAB */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <img src={noDataSvg} alt="No files" className="w-48 mb-8" />
            <h3 className="text-xl font-bold mb-2">No file uploaded yet</h3>
            <p className="text-center text-black text-opacity-60">
              You've not uploaded any file hit the<br />
              plus button below to add a file.
            </p>
          </div>
        )}
      </div>

      {/* Add file button */}
      <div className="fixed right-10 bottom-10 z-30">
        <div className="bg-white rounded-full">
          <ScaleButton onClick={handleAddFile}>
            <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-[#fd6b67] shadow-lg shadow-[#fd6b67]/40 transform rotate-45">
              <FontAwesomeIcon
                icon={faPlus}
                className="text-white text-2xl transform -rotate-45"
              />
            </div>
          </ScaleButton>
        </div>
      </div>

      {/* Share modal */}
      {showShareModal && selectedFile && (
        <ShareView
          file={selectedFile}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  )
}

export default Dashboard