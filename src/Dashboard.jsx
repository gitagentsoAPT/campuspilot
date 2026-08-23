import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

function Dashboard() {
  const [tickets, setTickets] = useState([
    {
      ticketId: 'CP1024',
      issue: 'Projector not working',
      location: 'AB2-304',
      department: 'AV Maintenance',
      priority: 'HIGH',
      status: 'OPEN'
    },
    {
      ticketId: 'CP1025',
      issue: 'Broken chair in library',
      location: 'Library-2F',
      department: 'General Maintenance',
      priority: 'LOW',
      status: 'RESOLVED'
    }
  ])

  const [followupResult, setFollowupResult] = useState(null)

  const openCount = tickets.filter(t => t.status === 'OPEN').length
  const highCount = tickets.filter(t => t.priority === 'HIGH').length
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length

  const handleResolve = (id) => {
    setTickets(tickets.map(t =>
      t.ticketId === id ? { ...t, status: 'RESOLVED' } : t
    ))
  }

  const handleFollowup = () => {
    setFollowupResult({
      ticketId: 'CP1024',
      message: 'Reminder sent to AV Maintenance. Student notified.'
    })
  }

  return (
    <div className="page-wide">
      <h1 className="title" style={{ lineHeight: '1.3' }}>📊 CampusPilot Admin Dashboard</h1>

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
          <p className="ticket-id">{ticket.ticketId} — {ticket.issue}</p>
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

      <div className="link-row">
        <Link to="/">← Back to Complaint Page</Link>
      </div>
    </div>
  )
}

export default Dashboard