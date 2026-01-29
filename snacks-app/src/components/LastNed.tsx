import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LastNed.css';

type DownloadItem = {
  id: number;
  titleKey: string;
  subtitleKey: string;
  image: string;
  fileUrl?: string;
  fileUrlEn?: string;
  availableIn: ('no' | 'en')[];
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
    image: '/dl1.png',
    fileUrl:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/Norsk/Standardisering%20av%20modellbaserte%20leveranser%20(BIM)%20-%20Behovsanalyse.pdf',
    fileUrlEn:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/English/Standardization%20of%20Model-Based%20Deliveries%20in%20Norwegian%20Infrastructure%20Projects%20-%20Needs%20Analysis.pdf',
    availableIn: ['no', 'en']
  },
  {
    id: 2,
    titleKey: 'download.item2.title',
    subtitleKey: 'download.item2.subtitle',
    image: '/dl2.png',
    fileUrl:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/Norsk/Standardisering%20av%20modellbaserte%20leveranser%20(BIM)%20-%20Sluttrapport.pdf',
    fileUrlEn:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/English/Standardization%20of%20Model-Based%20Deliveries%20in%20Norwegian%20Infrastructure%20Projects%20-%20Final%20report.pdf',
    availableIn: ['no', 'en']
  },
  {
    id: 3,
    titleKey: 'download.item3.title',
    subtitleKey: 'download.item3.subtitle',
    image: '/dl3.png',
    fileUrl:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/Norsk/Standardisering%20av%20modellbaserte%20leveranser%20(BIM)%20-%20Del3%20-%20%20Egenskaper.pdf',
    availableIn: ['no']
  },
  {
    id: 4,
    titleKey: 'download.item4.title',
    subtitleKey: 'download.item4.subtitle',
    image: '/dl4.png',
    fileUrl:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/Norsk/Standardisering%20av%20modellbaserte%20leveranser%20(BIM)%20-%20Del4%20-%20Sluttrapport.pdf',
    availableIn: ['no']
  },
  {
    id: 5,
    titleKey: 'download.item5.title',
    subtitleKey: 'download.item5.subtitle',
    image: '/dl5.png',
    fileUrl:
      'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/Egenskapsstruktur.xlsx',
    availableIn: ['no', 'en']
  }
];

const LastNed: React.FC = () => {
  const { t, language } = useLanguage();
  
  const availableItems = downloadItems.filter(item => item.availableIn.includes(language));
  
  const handleCardClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: DownloadItem
  ) => {
    const fileUrl = language === 'en' && item.fileUrlEn ? item.fileUrlEn : item.fileUrl;
    
    if (fileUrl) {
      event.preventDefault();
      downloadGitHubFile(fileUrl);
      return;
    }

    event.preventDefault();
    window.alert(t('download.alert'));
  };

  return (
    <div id="last-ned" className="slide-component container my-5 pt-5">
      <h2>{t('download.title')}</h2>
      <div className="download-grid">
        {availableItems.map(item => {
          const fileUrl = language === 'en' && item.fileUrlEn ? item.fileUrlEn : item.fileUrl;
          
          return (
            <a
              key={item.id}
              href={fileUrl ?? '#'}
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
          );
        })}
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
