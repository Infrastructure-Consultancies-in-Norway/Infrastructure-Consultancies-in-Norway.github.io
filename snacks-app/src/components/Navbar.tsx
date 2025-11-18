import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const [clickCount, setClickCount] = useState(0)
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (clickCount === 2) {
      alert("You've unlocked an easter egg!")
      navigate('/easter-egg')
      setClickCount(0)
    }
  }, [clickCount, navigate])

  const handleSnacksClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
    }

    setClickCount(prev => prev + 1)

    clickTimeout.current = setTimeout(() => {
      if (clickCount === 0) {
        navigate('/')
      }
      setClickCount(0)
    }, 300)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a 
          className="navbar-brand" 
          href="/" 
          onClick={handleSnacksClick}
        >
          SNACks
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Hjem
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/properties">
                Egenskapssett
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
