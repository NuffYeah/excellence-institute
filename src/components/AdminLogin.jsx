import React from 'react'
import { Link } from 'react-router-dom'
import Login from './Login'

function AdminLogin() {
  return (
    <div className="admin-login-page">
      <div className="admin-header">
        <Link to="/" className="back-btn">← Back to Home</Link>
        <h1>Admin Access</h1>
        <p>Please login to access the administrative dashboard</p>
      </div>
      
      <Login />
      
      <style jsx>{`
        .admin-login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #c62828 0%, #8e24aa 100%);
        }

        .admin-header {
          text-align: center;
          padding: 40px 20px 20px;
          color: white;
        }

        .back-btn {
          display: inline-block;
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-weight: 500;
        }

        .back-btn:hover {
          color: white;
        }

        .admin-header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .admin-header p {
          font-size: 1.1rem;
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}

export default AdminLogin