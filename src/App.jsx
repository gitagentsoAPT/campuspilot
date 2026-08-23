import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ComplaintPage from './ComplaintPage'
import Dashboard from './Dashboard'
import TicketPage from './TicketPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComplaintPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ticket/:id" element={<TicketPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App