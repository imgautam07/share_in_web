import { toast } from 'react-toastify'

// Format file size from bytes to human-readable format
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Show success toast notification
export const showSuccess = (message) => {
  toast.success(message)
}

// Show error toast notification
export const showError = (message) => {
  toast.error(message)
}

// Format date to display format
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

// Get file type icon based on file type
export const getFileTypeIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'docs':
      return 'file-text'
    case 'sheets':
      return 'file-spreadsheet'
    case 'media':
      return 'file-image'
    default:
      return 'file'
  }
}

// Download a file from URL
export const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Download error:', error)
    showError('Failed to download file')
  }
}