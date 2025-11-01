import React from 'react'
import { Link } from 'react-router-dom'
import './Welcome.css'

function Welcome() {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to The Excellence Institute</h1>
        <p className="welcome-subtitle">Your journey to academic excellence starts here</p>
        
        <div className="role-buttons">
          <Link to="/admin" className="btn-role btn-admin">
            <div className="role-icon">🏛️</div>
            <h3>Admin</h3>
            <p>Manage students and system</p>
          </Link>
          
          <Link to="/student-dashboard" className="btn-role btn-student">
            <div className="role-icon">📚</div>
            <h3>Student</h3>
            <p>Access your profile and reports</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Welcome