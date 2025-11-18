import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    
    expect(screen.getByText('SNACks')).toBeInTheDocument()
    expect(screen.getByText('Hjem')).toBeInTheDocument()
    expect(screen.getByText('Egenskapssett')).toBeInTheDocument()
    expect(screen.getByText('Kontakt')).toBeInTheDocument()
  })
})
