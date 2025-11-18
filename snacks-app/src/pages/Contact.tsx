import PersonCard from '../components/PersonCard'

const Contact = () => {
  const people = [
    {
      name: 'Christoffer Nergaard Mikalsen',
      title: 'Sivilingeniør OsloMet 2024',
      email: 'christoffer.mikalsen@sweco.no',
      imageSrc: '/Images/christoffer.jpg',
      offsetTop: false,
    },
    {
      name: 'Torhild Bjørkevoll Ersland',
      title: 'Ingeniør UiS',
      email: 'torhild.ersland@sweco.no',
      imageSrc: '/Images/torhild.jpg',
      offsetTop: true,
    },
    {
      name: 'Vegard Gavel-Solberg',
      title: 'Sivilingeniør NTNU 2014',
      email: 'vegard.gavel-solberg@norconsult.com',
      imageSrc: '/Images/vegard.jpg',
      offsetTop: false,
    },
    {
      name: 'Thomas Østgulen',
      title: 'Sivilingeniør NTNU 2010',
      email: 'thomas.ostgulen@norconsult.com',
      imageSrc: '/Images/thomas.jpg',
      offsetTop: true,
    },
    {
      name: 'Simon Sòlbjørg',
      title: 'Ingeniør HiO 2010',
      email: 'sso@aaj.no',
      imageSrc: '/Images/simon.jpg',
      offsetTop: false,
    },
    {
      name: 'Olav Fiksdal Haukvik',
      title: 'Sivilingeniør NTNU 2011',
      email: 'oha@aaj.no',
      imageSrc: '/Images/olav.jpg',
      offsetTop: true,
    },
    {
      name: 'Petter Kay Steinbo',
      title: 'Sivilingeniør NTNU 2020',
      email: 'pest@cowi.com',
      imageSrc: '/Images/petter.png',
      offsetTop: false,
    },
    {
      name: 'Fredrik Sommer-Jacobsen',
      title: 'MSc UiO 2012',
      email: 'fkjn@cowi.com',
      imageSrc: '/Images/fredrik.png',
      offsetTop: true,
    },
  ]

  return (
    <div className="container mt-5">
      {[0, 2, 4, 6].map((startIndex) => (
        <div className="row" key={startIndex}>
          {people.slice(startIndex, startIndex + 2).map((person) => (
            <PersonCard
              key={person.email}
              name={person.name}
              title={person.title}
              email={person.email}
              imageSrc={person.imageSrc}
              offsetTop={person.offsetTop}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Contact
