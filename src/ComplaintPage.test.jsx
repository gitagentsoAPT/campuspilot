import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ComplaintPage from './ComplaintPage'

// Helper to render the page wrapped in a Router (needed because of the <Link>)
function renderComplaintPage() {
  render(
    <BrowserRouter>
      <ComplaintPage />
    </BrowserRouter>
  )
}

describe('ComplaintPage', () => {
  it('shows an error when submitting an empty complaint', () => {
    renderComplaintPage()

    const submitButton = screen.getByText('Submit Complaint')
    fireEvent.click(submitButton)

    expect(screen.getByText(/please describe your problem/i)).toBeInTheDocument()
  })

  it('shows the ticket after submitting a valid complaint', async () => {
    renderComplaintPage()

    const textarea = screen.getByPlaceholderText('Describe your problem...')
    fireEvent.change(textarea, { target: { value: 'Projector is broken' } })

    const submitButton = screen.getByText('Submit Complaint')
    fireEvent.click(submitButton)

    // Wait for the fake 1.5s delay to finish and the ticket to appear
    const ticketId = await screen.findByText('CP1024', {}, { timeout: 3000 })
    expect(ticketId).toBeInTheDocument()
  })
})