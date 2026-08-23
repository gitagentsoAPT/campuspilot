import { useState } from 'react'
import { Link } from 'react-router-dom'

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
    <div style={{ maxWidth: '700px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ lineHeight: '1.3', marginBottom: '20px' }}>📊 CampusPilot Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '15px', margin: '20px 0' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h2>{openCount}</h2>
          <p>OPEN</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h2>{highCount}</h2>
          <p>HIGH PRIORITY</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h2>{resolvedCount}</h2>
          <p>RESOLVED</p>
        </div>
      </div>

      <h3>Tickets</h3>

      {tickets.map(ticket => (
        <div key={ticket.ticketId} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
          <p><strong>{ticket.ticketId}</strong> — {ticket.issue}</p>
          <p>{ticket.location} · {ticket.department}</p>
          <p>
            Priority: {ticket.priority === 'HIGH' ? '🔴' : '🟢'} {ticket.priority} &nbsp;|&nbsp;
            Status: {ticket.status === 'OPEN' ? '🟡' : '🟢'} {ticket.status}
          </p>
          {ticket.status === 'OPEN' && (
            <button onClick={() => handleResolve(ticket.ticketId)} style={{ padding: '8px 15px', cursor: 'pointer' }}>
              Resolve
            </button>
          )}
        </div>
      ))}

      <br />
      <button onClick={handleFollowup} style={{ padding: '10px 15px', cursor: 'pointer' }}>
        Simulate Follow-up
      </button>

      {followupResult && (
        <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '15px', borderRadius: '8px', background: '#f9f9f9' }}>
          <p><strong>🤖 Follow-up Agent</strong></p>
          <p>Ticket {followupResult.ticketId} is still unresolved.</p>
          <p>✓ {followupResult.message}</p>
        </div>
      )}

      <br />
      <Link to="/">← Back to Complaint Page</Link>
    </div>
  )
}

export default Dashboard