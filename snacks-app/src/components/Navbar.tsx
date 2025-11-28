import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sectionNavItems } from './SideNavigation'

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

  const closeNavbar = () => {
    const navbarElement = document.getElementById('navbarNav')
    if (navbarElement?.classList.contains('show')) {
      navbarElement.classList.remove('show')
    }
  }

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

  const handleSectionNavigate = (id: string) => {
    navigate('/', { state: { scrollTarget: id } })
    closeNavbar()
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-snacks">
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
            {/* <li className="nav-item">
              <Link className="nav-link" to="/">
                Hjem
              </Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link" to="/properties">
                Egenskapssett
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Kontakt
              </Link>
            </li> */}
            {sectionNavItems.map(item => (
              <li className="nav-item d-lg-none" key={`mobile-${item.id}`}>
                <button
                  type="button"
                  className="nav-link text-start text-white bg-transparent border-0 w-100"
                  onClick={() => handleSectionNavigate(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
