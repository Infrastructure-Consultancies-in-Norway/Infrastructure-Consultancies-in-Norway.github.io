import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Properties from './pages/Properties'
import EasterEgg from './pages/EasterEgg'

function App() {
  return (
    <>
      <CookieBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/easter-egg" element={<EasterEgg />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
