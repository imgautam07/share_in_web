import { faEllipsisH, faFileAlt, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { filesAPI } from '../../services/api'
import { downloadFile, formatDate } from '../../utils/helpers'
import Button from '../common/Button'
import TextField from '../common/TextField'

const DocTile = ({ file, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const menuRef = useRef(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmail, setShareEmail] = useState("")

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleDeleteClick = async () => {
    closeMenu()

    try {
      const confirmDelete = window.confirm("Do you want to delete this file?")
      if (confirmDelete) {
        await filesAPI.delete(file.id)
        toast.success("File deleted successfully")
        if (onDelete) onDelete(file.id)
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error("Failed to delete file")
    }
  }

  const handleShareClick = () => {
    closeMenu()
    setShowShareModal(true)
  }

  const handleDownload = async () => {

    if (!isDownloading) {
      setIsDownloading(true)
      try {
        await downloadFile(file.fileUrl, file.name, setDownloadProgress)
      } catch (error) {
        console.error('Error downloading file:', error)
        toast.error("Failed to download file")
      } finally {
        setIsDownloading(false)
        setDownloadProgress(0)
      }
    }
  }

  return (
    <div
      className={`
        rounded-2xl transition-all duration-300 ease-out
        ${isDownloading ? 'shadow-[0_0_40px_rgba(255,193,7,0.3),0_0_10px_rgba(253,107,103,0.3)]' : ''}
      `}
    >
      <div className="relative rounded-2xl overflow-hidden">
        {/* Main tile */}
        <div
          className="bg-white bg-opacity-20 relative"
          onClick={isDownloading ? undefined : handleDownload}
        >
          <div className="px-4 py-5 flex items-center">
            <div className="w-14 h-14 flex items-center justify-center border border-gray-400 border-opacity-90 rounded-xl">
              <FontAwesomeIcon icon={faFileAlt} className="text-xl" />
            </div>

            <div className="ml-4 flex-1">
              <h3 className="font-medium">{file.name}</h3>
              <p className="text-sm opacity-80">
                {file.type.charAt(0).toUpperCase() + file.type.slice(1)} | {formatDate(file.createdAt)}
              </p>
            </div>

            <button
              className="p-2 text-black text-opacity-60"
              onClick={(e) => {
                e.stopPropagation()
                toggleMenu()
              }}
            >
              <FontAwesomeIcon icon={faEllipsisH} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute right-0 top-0 bottom-0 z-10 w-32 bg-white"
              ref={menuRef}
            >
              <div className="h-full flex flex-col">
                <button
                  className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-100"
                  onClick={handleShareClick}
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                  <span>Share</span>
                </button>

                <div className="h-px bg-black bg-opacity-60" />

                <button
                  className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-100"
                  onClick={handleDeleteClick}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download progress bar */}
        <AnimatePresence>
          {isDownloading && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '50px' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 w-full"
            >
              <div className="h-full flex items-center px-5">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                <span className="text-white text-opacity-70 text-xs">Downloading...</span>
                <div className="ml-auto">
                  <span className="text-white text-opacity-70 text-base font-bold">
                    {Math.round(downloadProgress * 100)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{file.name}</h2>
              <button onClick={() => setShowShareModal(false)} className="text-gray-600 hover:text-black">&times;</button>
            </div>
            <TextField
              type="email"
              placeholder="Enter email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}

            />
            <Button
              text="Send"
              onClick={async () => {
                try {
                  const response = await fetch(`http://3.12.1.104:4000/api/files/${file._id}/share-email`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "x-auth-token": localStorage.token,
                    },
                    body: JSON.stringify({ emailAddress: shareEmail })
                  })
                  if (response.ok) {
                    toast.success("Link sent to " + shareEmail)
                    setShowShareModal(false)
                    setShareEmail("")
                  } else {
                    toast.error("Failed to send link")
                  }
                } catch (err) {
                  toast.error("Error occurred while sending link")
                  console.error(err)
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DocTile