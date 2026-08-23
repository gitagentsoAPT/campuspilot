import { useParams, Link } from 'react-router-dom'
import './App.css'
function TicketPage() {
  const { id } = useParams()

  const ticket = {
    ticketId: id,
    issue: 'Projector not working',
    category: 'maintenance',
    department: 'AV Maintenance',
    location: 'AB2-304',
    priority: 'HIGH',
    status: 'OPEN'
  }

  return (
    <div className="page">
      <h1 className="title">🎫 Ticket Details</h1>

      <div className="card">
        <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
        <p><strong>Issue:</strong> {ticket.issue}</p>
        <p><strong>Category:</strong> {ticket.category}</p>
        <p><strong>Department:</strong> {ticket.department}</p>
        <p><strong>Location:</strong> {ticket.location}</p>
        <p><strong>Priority:</strong> <span className="badge badge-high">{ticket.priority}</span></p>
        <p><strong>Status:</strong> <span className="badge badge-open">{ticket.status}</span></p>
      </div>

      <div className="link-row">
        <Link to="/">← Back to Complaint Page</Link>
        {' · '}
        <Link to="/dashboard">Go to Dashboard →</Link>
      </div>
    </div>
  )
}

export default TicketPage