import { useParams, Link } from 'react-router-dom'

function TicketPage() {
  const { id } = useParams()

  // FAKE data for now — later this will fetch the real ticket from the backend using `id`
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
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>🎫 Ticket Details</h1>

      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
        <p><strong>Issue:</strong> {ticket.issue}</p>
        <p><strong>Category:</strong> {ticket.category}</p>
        <p><strong>Department:</strong> {ticket.department}</p>
        <p><strong>Location:</strong> {ticket.location}</p>
        <p><strong>Priority:</strong> 🔴 {ticket.priority}</p>
        <p><strong>Status:</strong> 🟡 {ticket.status}</p>
      </div>

      <br />
      <Link to="/">← Back to Complaint Page</Link>
      {' | '}
      <Link to="/dashboard">Go to Dashboard →</Link>
    </div>
  )
}

export default TicketPage