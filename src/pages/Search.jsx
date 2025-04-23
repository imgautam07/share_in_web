import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import DocTile from '../components/dashboard/DocTile'
import ScaleButton from '../components/common/ScaleButton'
import { filesAPI } from '../services/api'
import noDataSvg from '../assets/no_data.svg'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const categories = ['all', 'docs', 'sheets', 'media', 'others']
  
  // Debounce search function
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  const fetchFiles = async () => {
    setLoading(true)
    try {
      // Create query parameters based on selected category and search query
      const params = {}
      if (selectedCategory !== 'all') {
        params.type = selectedCategory
      }
      if (searchQuery.trim()) {
        params.name = searchQuery.trim()
      }
      
      const response = await filesAPI.search(
        selectedCategory !== 'all' ? selectedCategory : null,
        searchQuery.trim() || null
      )
      
      if (response.data && Array.isArray(response.data.files)) {
        setFiles(response.data.files)
      } else {
        console.error('Invalid response format:', response.data)
        setFiles([])
      }
    } catch (error) {
      console.error('Error searching files:', error)
      toast.error('Failed to search files')
      setFiles([])
    } finally {
      setLoading(false)
    }
  }
  
  // Create a debounced version of fetchFiles
  const debouncedFetchFiles = useCallback(
    debounce(() => {
      fetchFiles()
    }, 500),
    [selectedCategory, searchQuery]
  )
  
  // Fetch files on initial load
  useEffect(() => {
    fetchFiles()
  }, [])
  
  // When search query or category changes
  useEffect(() => {
    debouncedFetchFiles()
  }, [searchQuery, selectedCategory, debouncedFetchFiles])
  
  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }
  
  const handleDeleteFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-[#D0D4E3] bg-opacity-40">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="backdrop-blur-md bg-white bg-opacity-50 min-h-screen rounded-b-3xl"
      >
        {/* Header */}
        <div className="pt-safe-top">
          <div className="px-6 py-4 flex items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            
            <div className="flex-1 px-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
          
          {/* Categories */}
          <div className="mt-5 pb-8">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex space-x-3 px-6">
                {categories.map(category => (
                  <ScaleButton 
                    key={category}
                    onClick={() => handleCategorySelect(category)}
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
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                  </ScaleButton>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="px-6 py-3 flex-1">
            {loading ? (
              <div className="py-10 flex justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : files.length > 0 ? (
              <div className="space-y-5">
                {files.map(file => (
                  <DocTile 
                    key={file.id} 
                    file={file} 
                    onDelete={handleDeleteFile} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <img src={noDataSvg} alt="No files" className="w-40 mb-6" />
                <h3 className="text-lg font-bold">No files found</h3>
                <p className="text-center text-black text-opacity-60">
                  Try adjusting your search or selecting a different category
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Search