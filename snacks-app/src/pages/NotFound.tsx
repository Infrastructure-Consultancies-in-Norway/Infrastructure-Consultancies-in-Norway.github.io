import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="container my-5 text-center">
    <h1>Fant ikke siden</h1>
    <p className="lead">Beklager, vi finner ikke innholdet du er ute etter.</p>
    <p>Kontroller at adressen er riktig eller gå tilbake til oversikten.</p>
    <div className="d-flex gap-3 justify-content-center mt-4 flex-wrap">
      <Link to="/" className="btn btn-outline-secondary">
        Til forsiden
      </Link>
      <Link to="/#begrepsforklaring" className="btn btn-outline-secondary">
        Se begrepslisten
      </Link>
    </div>
  </div>
)

export default NotFound
