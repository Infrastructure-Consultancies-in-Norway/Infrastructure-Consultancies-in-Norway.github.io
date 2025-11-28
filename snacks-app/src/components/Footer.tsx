const Footer = () => {
  return (
    <footer className="footer-snacks text-white text-center p-4 mt-5">
      <div className="container">
        <h5>Et samarbeid mellom:</h5>
        <div className="row justify-content-center">
          <div className="col-6 col-md-2 text-center logo">
            <a href="https://www.sweco.no/en/">
              <img
                src="https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Logos/sweco_logo_sym.png?raw=true"
                alt="Sweco"
                width="40"
              />
              <span>Sweco</span>
            </a>
          </div>
          <div className="col-6 col-md-3 text-center logo">
            <a href="https://norconsult.no/">
              <img
                src="https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Logos/norconsult_logo_sym.png?raw=true"
                alt="Norconsult"
                width="50"
              />
              <span>Norconsult</span>
            </a>
          </div>
          <div className="col-6 col-md-3 text-center logo">
            <a href="https://www.aas-jakobsen.no/">
              <img
                src="https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Logos/aaj_logo_sym.png?raw=true"
                alt="Aas-Jakobsen"
                width="50"
              />
              <span>Aas-Jakobsen</span>
            </a>
          </div>
          <div className="col-6 col-md-3 text-center logo">
            <a href="https://www.cowi.com">
              <img
                src="https://raw.githubusercontent.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/d4fd067d51ec2dbf353c62025f2853410e951f22/Logos/cowi_logo.svg"
                alt="Cowi"
                width="120"
              />
              <span>COWI</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
