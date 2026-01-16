import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LastNed.css';

type DownloadItem = {
  id: number;
  titleKey: string;
  subtitleKey: string;
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
    titleKey: 'download.item1.title',
    subtitleKey: 'download.item1.subtitle',
    image: '/dl1.png'
  },
  {
    id: 2,
    titleKey: 'download.item2.title',
    subtitleKey: 'download.item2.subtitle',
    image: '/dl2.png'
  },
  {
    id: 3,
    titleKey: 'download.item3.title',
    subtitleKey: 'download.item3.subtitle',
    image: '/dl3.png'
  },
  {
    id: 4,
    titleKey: 'download.item4.title',
    subtitleKey: 'download.item4.subtitle',
    image: '/dl4.png'
  },
  {
    id: 5,
    titleKey: 'download.item5.title',
    subtitleKey: 'download.item5.subtitle',
    image: '/dl5.png',
    fileUrl:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Egenskapssett-BRU/blob/main/Egenskapssett%20-%20Alle%20egenskapssett.xlsx'
  },
  {
    id: 6,
    titleKey: 'download.item6.title',
    subtitleKey: 'download.item6.subtitle',
    image: '/dl6.png',
    fileUrl:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Element-og-Materialnavn/blob/main/Element-og-materialnavn-tabeller.pdf'
  },
  {
    id: 7,
    titleKey: 'download.item7.title',
    subtitleKey: 'download.item7.subtitle',
    image: '/dl7.png'
  },
  {
    id: 8,
    titleKey: 'download.item8.title',
    subtitleKey: 'download.item8.subtitle',
    image: '/dl8.png'
  }
];

const LastNed: React.FC = () => {
  const { t } = useLanguage();
  
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
    window.alert(t('download.alert'));
  };

  return (
    <div id="last-ned" className="slide-component container my-5 pt-5">
      <h2>{t('download.title')}</h2>
      <div className="download-grid">
        {downloadItems.map(item => (
          <a
            key={item.id}
            href={item.fileUrl ?? '#'}
            className="download-card"
            aria-label={`${t('download.title')} ${t(item.titleKey)}`}
            onClick={event => handleCardClick(event, item)}
          >
            <div className="download-card-image-wrapper">
              <img src={item.image} alt={t(item.titleKey)} className="download-card-image" />
            </div>
            <div className="download-card-body">
              <p className="download-card-title mb-1">{t(item.titleKey)}</p>
              {/* <p className="download-card-subtitle mb-0">{t(item.subtitleKey)}</p> */}
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
          <span>{t('download.github')}</span>
          <span aria-hidden="true" className="download-github-link-icon bi bi-arrow-up-right" />
        </a>
      </div>
    </div>
  );
};

export default LastNed;
