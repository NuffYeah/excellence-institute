import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_BASE = 'http://localhost/excellence-institute/api'

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth.php`, {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.authenticated) {
        setIsAuthenticated(true)
        setAdmin(data.admin)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsAuthenticated(true)
        setAdmin(data.admin)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth.php`, {
        method: 'DELETE',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsAuthenticated(false)
      setAdmin(null)
    }
  }

  const value = {
    isAuthenticated,
    admin,
    loading,
    login,
    logout,
    API_BASE
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}