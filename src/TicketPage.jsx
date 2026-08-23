import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTicket } from './api'

function TicketPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTicket()
  }, [id])

  const loadTicket = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getTicket(id)
      setTicket(data)
    } catch (err) {
      setError('Could not load this ticket.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1 className="title">🎫 Ticket Details</h1>

      {loading && <p className="loading-text">Loading ticket...</p>}
      {error && <p className="error-text">{error}</p>}

      {ticket && (
        <div className="card">
          <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
          <p><strong>Issue:</strong> {ticket.issue || ticket.summary}</p>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Department:</strong> {ticket.department}</p>
          <p><strong>Location:</strong> {ticket.location}</p>
          <p><strong>Priority:</strong> <span className={`badge ${ticket.priority === 'HIGH' ? 'badge-high' : 'badge-low'}`}>{ticket.priority}</span></p>
          <p><strong>Status:</strong> <span className={`badge ${ticket.status === 'OPEN' ? 'badge-open' : 'badge-resolved'}`}>{ticket.status}</span></p>
        </div>
      )}

      <div className="link-row">
        <Link to="/">← Back to Complaint Page</Link>
        {' · '}
        <Link to="/dashboard">Go to Dashboard →</Link>
      </div>
    </div>
  )
}

export default TicketPage