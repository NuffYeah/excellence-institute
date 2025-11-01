import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Welcome from './components/Welcome'
import Login from './components/Login'
import AdminLogin from './components/AdminLogin'
import Dashboard from './components/Dashboard'
import StudentForm from './components/StudentForm'
import StudentProfile from './components/StudentProfile'
// StudentRegister removed (public self-registration disabled)
import StudentDashboard from './components/StudentDashboard'
import ProfileSummaryReport from './components/ProfileSummaryReport'

import ApiTest from './components/ApiTest'
import Navigation from './components/Navigation'
import './App.css'

function AppContent() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      {isAuthenticated && <Navigation />}
      <main className={isAuthenticated ? "main-content" : ""} >
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/admin" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/admin" />} />
          <Route path="/register" element={isAuthenticated ? <StudentForm /> : <Navigate to="/admin" />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/:id" element={<ProfileSummaryReport />} />
          <Route path="/student/:id/profile" element={<StudentProfile />} />
          <Route path="/student/:id/edit" element={isAuthenticated ? <StudentForm /> : <Navigate to="/admin" />} />

          {/* StudentRegister route removed */}
          <Route path="/api-test" element={<ApiTest />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App