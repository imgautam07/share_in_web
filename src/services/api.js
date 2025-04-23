import axios from 'axios'

const baseUrl = "http://3.12.1.104:4000"

// Create axios instance with default config
const api = axios.create({
  baseURL: baseUrl,
})

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['x-auth-token'] = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth API calls
export const authAPI = {
  login: (email, password) => api.post('/api/auth/signin', { email, password }),
  register: (email, name, password) => api.post('/api/auth/signup', { email, name, password }),
  verifyToken: () => api.post('/api/auth/verify-token')
}

// Files API calls
export const filesAPI = {
  getAll: () => api.get('/api/files'),
  search: (type, name) => {
    const params = {}
    if (type && type !== 'all') params.type = type
    if (name) params.name = name
    return api.get('/api/files', { params })
  },
  delete: (fileId) => api.delete(`/api/files/${fileId}`),
  shareViaEmail: (fileId, emailAddress) => api.post(`/api/files/${fileId}/share-email`, { emailAddress }),
  upload: (file, name, access) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name)
    formData.append('access', JSON.stringify(access))
    return api.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default api