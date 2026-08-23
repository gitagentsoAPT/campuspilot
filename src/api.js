import axios from 'axios'

const API_BASE = 'http://localhost:4000'

export async function submitComplaint(studentId, message) {
  const res = await axios.post(`${API_BASE}/api/complaints`, {
    studentId,
    message
  })
  return res.data
}

export async function getTickets() {
  const res = await axios.get(`${API_BASE}/api/tickets`)
  return res.data
}

export async function getTicket(id) {
  const res = await axios.get(`${API_BASE}/api/tickets/${id}`)
  return res.data
}

export async function resolveTicket(id) {
  const res = await axios.put(`${API_BASE}/api/tickets/${id}`, {
    status: 'RESOLVED'
  })
  return res.data
}

export async function simulateFollowup(ticketId) {
  const res = await axios.post(`${API_BASE}/api/followup`, {
    ticketId
  })
  return res.data
}