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

    // FAKE response for now — we'll replace this with a real API call later
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
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>🏫 CampusPilot</h1>
      <p>Campus Operations Assistant</p>

      <textarea
        rows="4"
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        placeholder="Describe your problem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br /><br />

      <button
        onClick={handleSubmit}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Submit Complaint
      </button>

      {loading && <p>🤖 Analyzing...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {ticket && (
        <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px', borderRadius: '8px' }}>
          <h3>✅ Complaint Submitted</h3>
          <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Department:</strong> {ticket.department}</p>
          <p><strong>Location:</strong> {ticket.location}</p>
          <p><strong>Priority:</strong> 🔴 {ticket.priority}</p>
          <p><strong>Status:</strong> 🟡 {ticket.status}</p>
        </div>
      )}

      <br />
      <Link to="/dashboard">Go to Admin Dashboard →</Link>
    </div>
  )
}

export default ComplaintPage