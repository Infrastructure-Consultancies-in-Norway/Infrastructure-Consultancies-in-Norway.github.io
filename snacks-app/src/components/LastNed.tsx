import React from 'react';
import './LastNed.css';

type DownloadItem = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  fileUrl?: string;
};

const convertToRawGitHubUrl = (url: string) =>
  url.includes('github.com') && url.includes('/blob/')
    ? url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/')
    : url;

const downloadGitHubFile = async (fileUrl: string) => {
  try {
    const rawUrl = convertToRawGitHubUrl(fileUrl);
    const response = await fetch(rawUrl);

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = rawUrl.split('/').pop() || 'download';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download error:', error);
  }
};

const downloadItems: DownloadItem[] = [
  {
    id: 1,
    title: 'Rapport: Behovsanalyse (PDF)',
    subtitle: 'Del 1: Behovsanalyse',
    image: '/dl1.png'
  },
  {
    id: 2,
    title: 'Rapport: Sluttrapport (PDF)',
    subtitle: 'Del 2: Sluttrapport',
    image: '/dl2.png'
  },
  {
    id: 3,
    title: 'Rapport: XXX (PDF)',
    subtitle: 'Del 3: Egenskaper',
    image: '/dl3.png'
  },
  {
    id: 4,
    title: 'Rapport: XXX (PDF)',
    subtitle: 'Del 4: Egenskapsskjema og verdier',
    image: '/dl4.png'
  },
  {
    id: 5,
    title: 'SNACKS egenskaper (Excel)',
    subtitle: 'Excel-mal',
    image: '/dl5.png',
    fileUrl:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/EgenskapsstrukturV09.xlsx'
  },
  {
    id: 6,
    title: 'Eksempelmodell (IFC)',
    subtitle: 'IFC-eksempel',
    image: '/dl6.png',
    fileUrl:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/Eksempelmodell_SNACks.ifc'
  },
  {
    id: 7,
    title: 'Rapport: XXX (PDF)',
    subtitle: 'Tilgjengelig snart',
    image: '/dl7.png'
  },
  {
    id: 8,
    title: 'Rapport: XXX (PDF)',
    subtitle: 'Tilgjengelig snart',
    image: '/dl8.png'
  }
];

const LastNed: React.FC = () => {
  const handleCardClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: DownloadItem
  ) => {
    if (item.fileUrl) {
      event.preventDefault();
      downloadGitHubFile(item.fileUrl);
      return;
    }

    event.preventDefault();
    window.alert('Denne nedlastingen er ikke tilgjengelig enda, vennligst prøv igjen senere.');
  };

  return (
    <div id="last-ned" className="slide-component container my-5 pt-5">
      <h2>Last ned</h2>
      <div className="download-grid">
        {downloadItems.map(item => (
          <a
            key={item.id}
            href={item.fileUrl ?? '#'}
            className="download-card"
            aria-label={`Last ned ${item.title}`}
            onClick={event => handleCardClick(event, item)}
          >
            <div className="download-card-image-wrapper">
              <img src={item.image} alt={item.title} className="download-card-image" />
            </div>
            <div className="download-card-body">
              <p className="download-card-title mb-1">{item.title}</p>
              <p className="download-card-subtitle mb-0">{item.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
      <div className="download-github-link">
        <a
          href="https://github.com/Infrastructure-Consultancies-in-Norway/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Utforsk organisasjonen på GitHub</span>
          <span aria-hidden="true" className="download-github-link-icon bi bi-arrow-up-right" />
        </a>
      </div>
    </div>
  );
};

export default LastNed;
