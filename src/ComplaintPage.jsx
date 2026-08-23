import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

function ComplaintPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (message.trim() === '') {
      setError('Please describe your problem before submitting.')
      return
    }

    setError('')
    setLoading(true)
    setTicket(null)

    setTimeout(() => {
      setLoading(false)
      setTicket({
        ticketId: 'CP1024',
        category: 'maintenance',
        department: 'AV Maintenance',
        location: 'AB2-304',
        priority: 'HIGH',
        status: 'OPEN'
      })
    }, 1500)
  }

  return (
    <div className="page">
      <h1 className="title">🏫 CampusPilot</h1>
      <p className="subtitle">Campus Operations Assistant</p>

      <textarea
        rows="4"
        placeholder="Describe your problem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br /><br />

      <button className="btn" onClick={handleSubmit}>
        Submit Complaint
      </button>

      {loading && <p className="loading-text">🤖 Analyzing...</p>}

      {error && <p className="error-text">{error}</p>}

      {ticket && (
        <div className="card">
          <h3>✅ Complaint Submitted</h3>
          <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Department:</strong> {ticket.department}</p>
          <p><strong>Location:</strong> {ticket.location}</p>
          <p><strong>Priority:</strong> <span className="badge badge-high">{ticket.priority}</span></p>
          <p><strong>Status:</strong> <span className="badge badge-open">{ticket.status}</span></p>
        </div>
      )}

      <div className="link-row">
        <Link to="/dashboard">Go to Admin Dashboard →</Link>
      </div>
    </div>
  )
}

export default ComplaintPage