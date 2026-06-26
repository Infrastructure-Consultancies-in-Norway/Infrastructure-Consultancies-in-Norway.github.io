import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '../contexts/LanguageContext'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <Navbar />
        </LanguageProvider>
      </BrowserRouter>
    )
    
    expect(screen.getByText('SNACKS')).toBeInTheDocument()
    expect(screen.getByText('Egenskapssett')).toBeInTheDocument()
    expect(screen.getByText('Kontakt')).toBeInTheDocument()
  })
})
