import DownloadLink from '../components/DownloadLink'

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-12">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h2 className="mb-0">Prosjektbeskrivelse</h2>
            </div>
            <div className="card-body">
              <div className="accordion" id="projectAccordion">
                <div className="accordion-item">
                  <h3 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Prosjektinitiativ og Bakgrunn
                    </button>
                  </h3>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                  >
                    <div className="accordion-body">
                      <p>
                        Dokumentet "SNACks - Informasjonsstruktur - Følgeskriv" beskriver et
                        prosjekt initiert av Statens vegvesen våren 2023 for å standardisere
                        BIM-leveranser. Prosjektet startet med en behovsundersøkelse utført av
                        Sweco, og senere samarbeidet Aas-Jakobsen, Cowi og Norconsult for å
                        harmonisere informasjonsstrukturen i modellene.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h3 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      Arbeidsgruppens Mål og Metodikk
                    </button>
                  </h3>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                  >
                    <div className="accordion-body">
                      <p>
                        Arbeidsgruppen, bestående av representanter fra Sweco, Norconsult,
                        Aas-Jakobsen og Cowi, har systematisk arbeidet gjennom de viktigste
                        prinsippene for strukturering av egenskapsinformasjon i modeller for bruer
                        og samferdselskonstruksjoner. Målet er å strømlinjeforme og effektivisere
                        modellproduksjon, redusere usikkerhet i kontrollprosesser, og sikre
                        konsistente resultater.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h3 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      SNACks-Strukturen
                    </button>
                  </h3>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                  >
                    <div className="accordion-body">
                      <p>
                        SNACks-strukturen er et helhetlig system for egenskaper relatert til
                        samferdselskonstruksjoner, basert på prinsipper fra Ifc-skjemaet. Dokumentet
                        beskriver fordelene ved et felles egenskapsoppsett, som økt effektivitet,
                        muligheter for automatisering, og redusert sannsynlighet for feil.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h2 className="mb-0">Nedlastbare Filer</h2>
            </div>
            <div className="card-body">
              <div className="list-group">
                <DownloadLink
                  url="https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/EgenskapsstrukturV09.xlsx"
                  title="Regneark med egenskaper"
                  fileType="xlsx"
                />
                <DownloadLink
                  url="https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/SNACks.pptx"
                  title="Powerpoint-presentasjon av arbeidet"
                  fileType="pptx"
                />
                <DownloadLink
                  url="https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/SNACks - Informasjonsstruktur - Følgeskriv.docx"
                  title="SNACks - Informasjonsstruktur - Følgeskriv"
                  fileType="docx"
                />
                <DownloadLink
                  url="https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/Eksempelmodell_SNACks.ifc"
                  title="Ifc-fil utarbeidet med SNACks-oppsettet"
                  fileType="ifc"
                />
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h2 className="mb-0">Presentasjon BA-Nettverket</h2>
            </div>
            <div className="card-body">
              <div className="ratio ratio-16x9">
                <iframe
                  src="https://www.youtube.com/embed/PLPpRe9ESuQ"
                  title="YouTube video"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
