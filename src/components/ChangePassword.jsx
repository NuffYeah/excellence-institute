import React, { useState } from 'react';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.new_password !== formData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    if (formData.new_password.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/change_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: formData.current_password,
          new_password: formData.new_password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password updated successfully');
        setFormData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h3>Change Password</h3>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="change-password-form">
        <div className="form-group">
          <label>Current Password:</label>
          <input
            type="password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        
        <div className="form-group">
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;