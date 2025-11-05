import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RegistrationConfirmationSlip() {
  const { id } = useParams()
  const { API_BASE } = useAuth()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${API_BASE}/student.php?id=${id}`)
        const data = await res.json()
        if (res.ok && data.student) {
          setStudent(data.student)
        } else {
          setError(data.error || 'Student not found')
        }
      } catch (e) {
        setError('Failed to load confirmation slip')
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [id, API_BASE])

  const handlePrint = () => window.print()

  const handleDownloadPDF = () => {
    const url = `${API_BASE}/report_view.php?type=confirmation&id=${id}&auto_print=1`
    window.open(url, '_blank')
  }

  const generateConfirmationHTML = () => {
    const generatedAt = new Date().toLocaleString()
    const registrationDate = student.created_at ? new Date(student.created_at).toLocaleDateString() : generatedAt
    const status = student.status || 'Active'
  

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Registration Confirmation Slip</title>
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
            <h2>Registration Confirmation Slip</h2>
            <p>Generated: ${generatedAt}</p>
          </div>
          <div class="field"><span class="label">Student Name:</span> ${student.full_name}</div>
          <div class="field"><span class="label">Student ID:</span> ${student.student_id}</div>
          <div class="field"><span class="label">Course:</span> ${student.course_of_study}</div>
          <div class="field"><span class="label">Registration Date:</span> ${registrationDate}</div>
          <div class="field"><span class="label">Status:</span> ${status}</div>
          <div class="field"><span class="label">Confirmation Number:</span> ${confirmationNumber}</div>
          <div class="print-btns">
            <button onclick="window.print()">Print</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `
  }

  if (loading) return <div className="loading">Loading confirmation slip...</div>
  if (error) return <div className="error">{error}</div>
  if (!student) return <div className="error">Student not found</div>

  const registrationDate = student.created_at ? new Date(student.created_at).toLocaleDateString() : new Date().toLocaleDateString()
  const status = student.status || 'Active'
  
  return (
    <div className="confirmation-slip">
      <div className="slip-header no-print">
        <Link to={`/student/${id}`} className="back-btn">← Back to Profile Summary</Link>
        <div className="actions">
          <button onClick={handlePrint} className="btn-print">Print Slip</button>
          <button onClick={handleDownloadPDF} className="btn-download">Download PDF</button>
        </div>
      </div>

      <div className="slip-content">
        <div className="slip-title">
          <h1>Excellence Institute</h1>
          <h2>Registration Confirmation Slip</h2>
          <p className="slip-date">Generated on: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="slip-info">
          <div className="info-grid">
            <div className="info-item">
              <label>Student Name</label>
              <span>{student.full_name}</span>
            </div>
            <div className="info-item">
              <label>Student ID</label>
              <span>{student.student_id}</span>
            </div>
            <div className="info-item">
              <label>Course</label>
              <span>{student.course_of_study}</span>
            </div>
            <div className="info-item">
              <label>Registration Date</label>
              <span>{registrationDate}</span>
            </div>
            <div className="info-item">
              <label>Status</label>
              <span className={`status ${status.toLowerCase()}`}>{status}</span>
            </div>
            

          </div>
        </div>

        <div className="slip-footer">
          <p>This is an official document from The Excellence Institute</p>
        </div>
      </div>

      <style jsx>{`
        .confirmation-slip { min-height: 100vh; background: #f5f5f5; padding: 20px; }
        .slip-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; max-width: 800px; margin-left: auto; margin-right: auto; }
        .back-btn { color: #666; text-decoration: none; font-weight: 500; }
        .back-btn:hover { color: #333; }
        .actions { display: flex; gap: 10px; }
        .btn-print, .btn-download { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.3s ease; }
        .btn-print { background: #2e7d32; color: white; }
        .btn-download { background: #1976d2; color: white; }
        .btn-print:hover, .btn-download:hover { transform: translateY(-2px); }
        .slip-content { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
        .slip-title { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .slip-title h1 { color: #c62828; font-size: 2rem; margin-bottom: 10px; }
        .slip-title h2 { color: #333; font-size: 1.5rem; margin-bottom: 10px; }
        .slip-date { color: #666; font-style: italic; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-item { display: flex; flex-direction: column; gap: 5px; }
        .info-item label { font-weight: 600; color: #555; font-size: 0.9rem; }
        .info-item span { color: #333; font-size: 1rem; }
        .status.active { background: #e8f5e8; color: #2e7d32; padding: 4px 12px; border-radius: 20px; width: fit-content; }
        .slip-footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 0.9rem; }
        @media print { .no-print { display: none !important; } .confirmation-slip { background: white; padding: 0; } .slip-content { box-shadow: none; border-radius: 0; } }
        @media (max-width: 768px) { .info-grid { grid-template-columns: 1fr; } .slip-header { flex-direction: column; gap: 15px; } .slip-content { padding: 20px; } }
      `}</style>
    </div>
  )
}

export default RegistrationConfirmationSlip
