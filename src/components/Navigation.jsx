import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navigation = () => {
  const { admin, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">Excellence Institute</div>
      
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/register">Register Student</Link>
      </div>
      
      <div className="nav-user">
        <span>Welcome, {admin?.username}</span>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navigation