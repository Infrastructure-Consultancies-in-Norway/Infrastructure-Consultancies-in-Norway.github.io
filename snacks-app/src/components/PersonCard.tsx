interface PersonCardProps {
  name: string
  title: string
  email: string
  imageSrc: string
  offsetTop?: boolean
}

const PersonCard = ({ name, title, email, imageSrc, offsetTop = false }: PersonCardProps) => {
  return (
    <div className="col-md-6 mb-5">
      <div className="person" style={offsetTop ? { marginTop: '50px' } : {}}>
        <img src={imageSrc} alt={name} />
        <div className="info">
          <h2>{name}</h2>
          <h5>{title}</h5>
          <div className="email">
            <i className="bi bi-envelope-fill email-icon"></i>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonCard
