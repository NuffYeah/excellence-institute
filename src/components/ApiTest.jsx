import React, { useState } from 'react'

function ApiTest() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/student.php?id=STU001')
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error.message}`)
    }
    setLoading(false)
  }

  const testDirect = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost/excellence-institute/api/student.php?id=STU001')
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>API Test</h2>
      <button onClick={testApi} disabled={loading}>
        Test Proxy API
      </button>
      <button onClick={testDirect} disabled={loading} style={{ marginLeft: '10px' }}>
        Test Direct API
      </button>
      
      {loading && <p>Loading...</p>}
      
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '10px', 
        marginTop: '20px',
        whiteSpace: 'pre-wrap'
      }}>
        {result}
      </pre>
    </div>
  )
}

export default ApiTest