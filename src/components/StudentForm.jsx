import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const StudentForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    date_of_birth: '',
    course_of_study: '',
    enrollment_date: new Date().toISOString().split('T')[0]
  })
  const [generatedStudentId, setGeneratedStudentId] = useState('')
  const [courses, setCourses] = useState([])
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  
  const { API_BASE } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/courses.php`)
      const data = await response.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }, [API_BASE])

  const fetchStudent = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/student.php?id=${id}`)
      const data = await response.json()
      
      if (data.student) {
        setFormData({
          full_name: data.student.full_name,
          email: data.student.email,
          date_of_birth: data.student.date_of_birth,
          course_of_study: data.student.course_of_study,
          enrollment_date: data.student.enrollment_date
        })
        setGeneratedStudentId(data.student.student_id)
      }
    } catch (error) {
      console.error('Failed to fetch student:', error)
    }
  }, [API_BASE, id])

  useEffect(() => {
    fetchCourses()
    if (id) {
      setIsEdit(true)
      fetchStudent()
    }
  }, [id, fetchCourses, fetchStudent])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    try {
      const url = isEdit ? `${API_BASE}/student.php?id=${id}` : `${API_BASE}/register.php`
      const method = isEdit ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (!isEdit && data.generated_student_id) {
          setGeneratedStudentId(data.generated_student_id)
          // Show success message with generated ID for 3 seconds before redirecting
          setTimeout(() => navigate('/dashboard'), 3000)
        } else {
          navigate('/dashboard')
        }
      } else {
        setErrors(data.errors || [data.error])
      }
    } catch {
      setErrors(['Failed to save student. Please try again.'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="student-form">
      <div className="card">
        <h2>{isEdit ? 'Edit Student' : 'Register New Student'}</h2>
        
        {errors.length > 0 && (
          <div className="error">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        {generatedStudentId && !isEdit && (
          <div className="success">
            <strong>Student registered successfully!</strong><br/>
            Generated Student ID: <strong>{generatedStudentId}</strong><br/>
            <small>Redirecting to dashboard...</small>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          {isEdit && generatedStudentId && (
            <div className="form-group">
              <label>Student ID</label>
              <input
                type="text"
                value={generatedStudentId}
                disabled
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
          )}

          {!isEdit && (
            <div className="info-box">
              <p><strong>Note:</strong> Student ID will be automatically generated based on enrollment date, course, and date of birth.</p>
            </div>
          )}

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Enrollment Date *</label>
              <input
                type="date"
                name="enrollment_date"
                value={formData.enrollment_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Course of Study *</label>
            <select
              name="course_of_study"
              value={formData.course_of_study}
              onChange={handleChange}
              required
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Student' : 'Register Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentForm