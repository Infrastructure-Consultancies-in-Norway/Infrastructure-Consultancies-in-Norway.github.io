const downloadFileGitHub = (fileUrl: string) => {
  let url = fileUrl
  if (url.includes('github.com') && url.includes('/blob/')) {
    url = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/')
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      const fileName = url.split('/').pop() || 'download'
      a.href = downloadUrl
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(downloadUrl)
    })
    .catch((error) => console.error('Download error:', error))
}

interface DownloadLinkProps {
  url: string
  title: string
  fileType: string
}

const DownloadLink = ({ url, title, fileType }: DownloadLinkProps) => {
  return (
    <a
      href="#"
      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
      onClick={(e) => {
        e.preventDefault()
        downloadFileGitHub(url)
      }}
    >
      {title}
      <span className="badge bg-secondary">{fileType}</span>
    </a>
  )
}

export default DownloadLink
