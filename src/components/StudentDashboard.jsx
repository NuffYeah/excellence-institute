import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function StudentDashboard() {
  const [studentId, setStudentId] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleProfileSearch = (e) => {
    e.preventDefault()
    if (!studentId.trim()) {
      setMessage('Please enter your Student ID')
      return
    }
    // Navigate to profile with the entered ID
    navigate(`/student/${studentId}`)
  }

  const handleConfirmationSlip = () => {
    window.location.href = '/confirmation-slip'
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <Link to="/" className="back-btn">← Back to Home</Link>
        <h1>Student Portal</h1>
        <p>Access your academic information and reports</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Profile Summary Report</h2>
          <p>View your complete academic profile including personal details, course information, and enrollment status.</p>
          
          <form onSubmit={handleProfileSearch} className="profile-search">
            <div className="form-group">
              <label htmlFor="studentId">Enter your Student ID:</label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g., STU001"
                required
              />
              <small style={{ color: '#666', fontSize: '0.9rem' }}>
                Try using: STU001 (test student)
              </small>
            </div>
            <button type="submit" className="btn-primary">
              View Profile Report
            </button>
          </form>
        </div>



        {message && (
          <div className="message-box">
            {message}
          </div>
        )}
      </div>

      <style jsx>{`
        .student-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .back-btn {
          display: inline-block;
          margin-bottom: 20px;
          color: #666;
          text-decoration: none;
          font-weight: 500;
        }

        .back-btn:hover {
          color: #333;
        }

        .dashboard-header h1 {
          color: #333;
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .dashboard-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .dashboard-content {
          max-width: 500px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
        }

        .dashboard-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .dashboard-card h2 {
          color: #333;
          margin-bottom: 15px;
          font-size: 1.5rem;
        }

        .dashboard-card p {
          color: #666;
          margin-bottom: 25px;
          line-height: 1.6;
        }

        .profile-search {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          text-align: left;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #2e7d32;
        }

        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: #2e7d32;
          color: white;
        }

        .btn-primary:hover {
          background: #388e3c;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: #1976d2;
          color: white;
        }

        .btn-secondary:hover {
          background: #1565c0;
          transform: translateY(-2px);
        }

        .message-box {
          grid-column: 1 / -1;
          background: #e3f2fd;
          color: #1565c0;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          border-left: 4px solid #1976d2;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            max-width: 100%;
            padding: 0 10px;
          }
          
          .dashboard-card {
            padding: 20px;
          }
          
          .dashboard-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}

export default StudentDashboard