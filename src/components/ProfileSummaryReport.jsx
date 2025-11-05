import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProfileSummaryReport() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { API_BASE } = useAuth()

  useEffect(() => {
    fetchStudentData()
  }, [id])

  const fetchStudentData = async () => {
    try {
      console.log('Fetching student data for ID:', id)
      const response = await fetch(`${API_BASE}/student.php?id=${id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.success) {
        setStudent(data.student)
        setError('')
      } else {
        setError(data.error || 'Student not found')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setError(`Error loading student data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    const url = `${API_BASE}/report_view.php?type=profile&id=${id}&auto_print=1`
    window.open(url, '_blank')
  }

  const generateProfileReportHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Profile Summary Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .field { margin: 10px 0; }
            .label { font-weight: 600; }
            .print-btns { margin: 20px 0; }
            .print-btns button { margin-right: 10px; padding: 8px 14px; }
            @media print { .print-btns { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Excellence Institute</h1>
            <h2>Student Profile Summary Report</h2>
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
          <div class="field"><span class="label">Full Name:</span> ${student.full_name}</div>
          <div class="field"><span class="label">Student ID:</span> ${student.student_id}</div>
          <div class="field"><span class="label">Email:</span> ${student.email}</div>
          <div class="field"><span class="label">Date of Birth:</span> ${new Date(student.date_of_birth).toLocaleDateString()}</div>
          <div class="field"><span class="label">Course:</span> ${student.course_of_study}</div>
          <div class="field"><span class="label">Enrollment Date:</span> ${new Date(student.enrollment_date).toLocaleDateString()}</div>
          <div class="field"><span class="label">Status:</span> Active</div>
          <div class="print-btns">
            <button onclick="window.print()">Print</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `
  }

  if (loading) return <div className="loading">Loading student profile...</div>
  if (error) return <div className="error">{error}</div>
  if (!student) return <div className="error">Student not found</div>

  return (
    <div className="profile-report">
      <div className="report-header no-print">
        <Link to="/student-dashboard" className="back-btn">← Back to Dashboard</Link>
        <div className="report-actions">
          <button onClick={handlePrint} className="btn-print">Print Report</button>
          <button onClick={handleDownloadPDF} className="btn-download">Download PDF</button>
        </div>

      <Link to={`/student/${id}/confirmation`} className="confirm-btn no-print">Registration Confirmation</Link>
      </div>

      <div className="report-content">
        <div className="report-title">
          <h1>Excellence Institute</h1>
          <h2>Student Profile Summary Report</h2>
          <p className="report-date">Generated on: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="student-info">
          <div className="info-section">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name:</label>
                <span>{student.full_name}</span>
              </div>
              <div className="info-item">
                <label>Student ID:</label>
                <span>{student.student_id}</span>
              </div>
              <div className="info-item">
                <label>Email Address:</label>
                <span>{student.email}</span>
              </div>
              <div className="info-item">
                <label>Date of Birth:</label>
                <span>{new Date(student.date_of_birth).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Academic Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Course of Study:</label>
                <span>{student.course_of_study}</span>
              </div>
              <div className="info-item">
                <label>Enrollment Date:</label>
                <span>{new Date(student.enrollment_date).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <label>Academic Status:</label>
                <span className="status active">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="report-footer">
          <p>This is an official document from The Excellence Institute</p>
          <p>Report ID: RPT-{student.student_id}-{Date.now()}</p>
        </div>
      </div>

      <style jsx>{`
        .profile-report {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 20px;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .back-btn {
          color: #666;
          text-decoration: none;
          font-weight: 500;
        }

        .back-btn:hover {
          color: #333;
        }

        .report-actions {
          display: flex;
          gap: 10px;
        }

        .btn-print, .btn-download {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-print {
          background: #2e7d32;
          color: white;
        }

        .btn-download {
          background: #1976d2;
          color: white;
        }

        .btn-print:hover, .btn-download:hover {
          transform: translateY(-2px);
        }

        .report-content {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .report-title {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #eee;
          padding-bottom: 20px;
        }

        .report-title h1 {
          color: #c62828;
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .report-title h2 {
          color: #333;
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .report-date {
          color: #666;
          font-style: italic;
        }

        .info-section {
          margin-bottom: 30px;
        }

        .info-section h3 {
          color: #333;
          font-size: 1.3rem;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .info-item label {
          font-weight: 600;
          color: #555;
          font-size: 0.9rem;
        }

        .info-item span {
          color: #333;
          font-size: 1rem;
        }

        .status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-block;
          width: fit-content;
        }

        .status.active {
          background: #e8f5e8;
          color: #2e7d32;
        }

        .report-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #666;
          font-size: 0.9rem;
        }

        .confirm-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #6a1b9a;
          color: #fff;
          padding: 10px 14px;
          border-radius: 20px;
          text-decoration: none;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          font-size: 0.9rem;
        }

        .confirm-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 1.1rem;
        }

        .error {
          color: #c62828;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          
          .profile-report {
            background: white;
            padding: 0;
          }
          
          .report-content {
            box-shadow: none;
            border-radius: 0;
          }
        }

        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .report-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .report-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default ProfileSummaryReport