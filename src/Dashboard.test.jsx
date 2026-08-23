import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './Dashboard'

function renderDashboard() {
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  )
}

describe('Dashboard', () => {
  it('shows the initial ticket list', () => {
    renderDashboard()
    expect(screen.getByText(/CP1024/)).toBeInTheDocument()
    expect(screen.getByText(/CP1025/)).toBeInTheDocument()
  })

  it('resolves a ticket when Resolve is clicked', () => {
    renderDashboard()

    const resolveButton = screen.getByText('Resolve')
    fireEvent.click(resolveButton)

    // After resolving, there should be no "Resolve" button left
    // (since CP1024 was the only OPEN ticket)
    expect(screen.queryByText('Resolve')).not.toBeInTheDocument()
  })

  it('shows a follow-up message when Simulate Follow-up is clicked', () => {
    renderDashboard()

    const followupButton = screen.getByText('Simulate Follow-up')
    fireEvent.click(followupButton)

    expect(screen.getByText(/Follow-up Agent/i)).toBeInTheDocument()
    expect(screen.getByText(/Reminder sent to AV Maintenance/i)).toBeInTheDocument()
  })
})