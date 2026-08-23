import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ComplaintPage from './ComplaintPage'
import Dashboard from './Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComplaintPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App