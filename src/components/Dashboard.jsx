import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ChangePassword from './ChangePassword'

const Dashboard = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [courses, setCourses] = useState([])
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const { API_BASE } = useAuth()

  useEffect(() => {
    fetchStudents()
    fetchCourses()
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [search, courseFilter])

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (courseFilter) params.append('course', courseFilter)
      
      const response = await fetch(`${API_BASE}/students.php?${params}`)
      const data = await response.json()
      setStudents(data.students || [])
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE}/courses.php`)
      const data = await response.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const handleDelete = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      return
    }

    try {
      const response = await fetch(`${API_BASE}/student.php?id=${studentId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        setStudents(students.filter(s => s.id !== studentId))
      } else {
        alert('Failed to delete student')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete student')
    }
  }

  if (loading) {
    return <div className="loading">Loading students...</div>
  }

  return (
    <div className="dashboard">
      <div className="card">
        <h2>Student Management Dashboard</h2>
        
        <div className="dashboard-controls">
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
          
          <div className="dashboard-actions">
            <Link to="/register" className="btn-primary">
              Add New Student
            </Link>
            <button 
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="btn-secondary"
            >
              Change Password
            </button>
          </div>
        </div>

        {showPasswordChange && (
          <div className="password-change-section">
            <ChangePassword />
          </div>
        )}

        {students.length === 0 ? (
          <div className="no-students">
            <p>No students found.</p>
            <Link to="/register" className="btn-primary">Register First Student</Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.student_id}</td>
                  <td>{student.full_name}</td>
                  <td>{student.email}</td>
                  <td>{student.course_of_study}</td>
                  <td>
                    <span className={`status status-${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="actions">
                    <Link 
                      to={`/student/${student.id}`} 
                      className="btn-secondary"
                    >
                      View
                    </Link>
                    <Link 
                      to={`/student/${student.id}/edit`} 
                      className="btn-secondary"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(student.id, student.full_name)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Dashboard