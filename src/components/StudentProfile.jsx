import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const StudentProfile = () => {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const { API_BASE, isAuthenticated } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchStudent()
  }, [id])

  const fetchStudent = async () => {
    try {
      const response = await fetch(`${API_BASE}/student.php?id=${id}`)
      const data = await response.json()
      
      if (response.ok && data.student) {
        setStudent(data.student)
      } else {
        setError(data.error || 'Student not found')
      }
    } catch (error) {
      setError('Failed to load student profile')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${student.full_name}?`)) {
      return
    }

    try {
      const response = await fetch(`${API_BASE}/student.php?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        navigate('/dashboard')
      } else {
        alert('Failed to delete student')
      }
    } catch (error) {
      alert('Failed to delete student')
    }
  }

  const generateReport = async (type) => {
    try {
      const response = await fetch(`${API_BASE}/reports.php?type=${type}&student_id=${id}`, {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.report) {
        // Open report in new window for printing/PDF
        const reportWindow = window.open('', '_blank')
        reportWindow.document.write(generateReportHTML(data.report, type))
        reportWindow.document.close()
      }
    } catch (error) {
      alert('Failed to generate report')
    }
  }

  const generateReportHTML = (report, type) => {
    const isProfile = type === 'profile'
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${report.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; }
            .print-btn { margin: 20px 0; }
            @media print { .print-btn { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Excellence Institute</h1>
            <h2>${report.title}</h2>
            <p>Generated: ${new Date(report.generated_at).toLocaleString()}</p>
          </div>
          
          ${isProfile ? `
            <div class="field"><span class="label">Name:</span> ${report.fields.Name}</div>
            <div class="field"><span class="label">Student ID:</span> ${report.fields['Student ID']}</div>
            <div class="field"><span class="label">Email:</span> ${report.fields.Email}</div>
            <div class="field"><span class="label">Date of Birth:</span> ${report.fields['Date of Birth']}</div>
            <div class="field"><span class="label">Course:</span> ${report.fields.Course}</div>
            <div class="field"><span class="label">Enrollment Date:</span> ${report.fields['Enrollment Date']}</div>
            <div class="field"><span class="label">Status:</span> ${report.fields.Status}</div>
          ` : `
            <div class="field"><span class="label">Student Name:</span> ${report.student.full_name}</div>
            <div class="field"><span class="label">Student ID:</span> ${report.student.student_id}</div>
            <div class="field"><span class="label">Course:</span> ${report.course_summary}</div>
            <div class="field"><span class="label">Registration Date:</span> ${new Date(report.registration_timestamp).toLocaleDateString()}</div>
            <div class="field"><span class="label">Status:</span> ${report.status}</div>
            <div class="field"><span class="label">Confirmation Number:</span> ${report.confirmation_number}</div>
          `}
          
          <div class="print-btn">
            <button onclick="window.print()">Print Report</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `
  }

  if (loading) {
    return <div className="loading">Loading student profile...</div>
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="card">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="student-profile">
      <div className="profile-header">
        <div className="card">
          <div className="profile-info">
            <div className="profile-avatar">
              {student.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-details">
              <h1>{student.full_name}</h1>
              <p className="student-id">ID: {student.student_id}</p>
              <span className={`status status-${student.status.toLowerCase()}`}>
                {student.status}
              </span>
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="profile-actions">
              <Link to={`/student/${id}/edit`} className="btn-secondary">
                Edit Student
              </Link>
              <button onClick={handleDelete} className="btn-danger">
                Delete Student
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="card">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <span>{student.full_name}</span>
            </div>
            <div className="info-item">
              <label>Student ID</label>
              <span>{student.student_id}</span>
            </div>
            <div className="info-item">
              <label>Email</label>
              <span>{student.email}</span>
            </div>
            <div className="info-item">
              <label>Date of Birth</label>
              <span>{new Date(student.date_of_birth).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Course of Study</label>
              <span>{student.course_of_study}</span>
            </div>
            <div className="info-item">
              <label>Enrollment Date</label>
              <span>{new Date(student.enrollment_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Student Reports</h2>
          <div className="reports-section">
            <div className="report-item">
              <h3>Profile Summary Report</h3>
              <p>Complete profile information for official records</p>
              <button 
                onClick={() => generateReport('profile')} 
                className="btn-primary"
              >
                Generate Profile Report
              </button>
            </div>
            
            <div className="report-item">
              <h3>Registration Confirmation</h3>
              <p>Official registration confirmation slip</p>
              <button 
                onClick={() => generateReport('confirmation')} 
                className="btn-primary"
              >
                Generate Confirmation Slip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile