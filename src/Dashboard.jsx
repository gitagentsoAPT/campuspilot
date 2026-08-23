import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTickets, resolveTicket, simulateFollowup } from './api'
import './App.css'

function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [followupResult, setFollowupResult] = useState(null)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getTickets()
      setTickets(data)
    } catch (err) {
      setError('Could not load tickets. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const openCount = tickets.filter(t => t.status === 'OPEN').length
  const highCount = tickets.filter(t => t.priority === 'HIGH').length
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length

  const handleResolve = async (id) => {
    try {
      await resolveTicket(id)
      setTickets(tickets.map(t =>
        t.ticketId === id ? { ...t, status: 'RESOLVED' } : t
      ))
    } catch (err) {
      setError('Could not resolve ticket.')
    }
  }

  const handleFollowup = async () => {
    const openTicket = tickets.find(t => t.status === 'OPEN')
    if (!openTicket) return

    try {
      const result = await simulateFollowup(openTicket.ticketId)
      setFollowupResult(result)
    } catch (err) {
      setError('Could not run follow-up.')
    }
  }

  return (
    <div className="page-wide">
      <h1 className="title" style={{ lineHeight: '1.3' }}>📊 CampusPilot Admin Dashboard</h1>

      {loading && <p className="loading-text">Loading tickets...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <div className="stats-row">
            <div className="stat-card">
              <p className="stat-number">{openCount}</p>
              <p className="stat-label">OPEN</p>
            </div>
            <div className="stat-card">
              <p className="stat-number">{highCount}</p>
              <p className="stat-label">HIGH PRIORITY</p>
            </div>
            <div className="stat-card">
              <p className="stat-number">{resolvedCount}</p>
              <p className="stat-label">RESOLVED</p>
            </div>
          </div>

          <h3>Tickets</h3>

          {tickets.map(ticket => (
            <div key={ticket.ticketId} className="ticket-card">
              <p className="ticket-id">{ticket.ticketId} — {ticket.issue || ticket.summary}</p>
              <p className="ticket-meta">{ticket.location} · {ticket.department}</p>
              <p>
                <span className={`badge ${ticket.priority === 'HIGH' ? 'badge-high' : 'badge-low'}`}>
                  {ticket.priority}
                </span>
                {' '}
                <span className={`badge ${ticket.status === 'OPEN' ? 'badge-open' : 'badge-resolved'}`}>
                  {ticket.status}
                </span>
              </p>
              {ticket.status === 'OPEN' && (
                <button className="btn btn-secondary" onClick={() => handleResolve(ticket.ticketId)}>
                  Resolve
                </button>
              )}
            </div>
          ))}

          <br />
          <button className="btn" onClick={handleFollowup}>
            Simulate Follow-up
          </button>

          {followupResult && (
            <div className="followup-card">
              <p><strong>🤖 Follow-up Agent</strong></p>
              <p>Ticket {followupResult.ticketId} is still unresolved.</p>
              <p>✓ {followupResult.message}</p>
            </div>
          )}
        </>
      )}

      <div className="link-row">
        <Link to="/">← Back to Complaint Page</Link>
      </div>
    </div>
  )
}

export default Dashboard