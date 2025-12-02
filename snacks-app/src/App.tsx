import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import OnePage from './pages/OnePage'
import Contact from './pages/Contact'
import Properties from './pages/Properties'
import EasterEgg from './pages/EasterEgg'
import GlossaryTerm from './pages/GlossaryTerm'

function App() {
  return (
    <>
      <CookieBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<OnePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/easter-egg" element={<EasterEgg />} />
        <Route path="/begrep/:slug" element={<GlossaryTerm />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
