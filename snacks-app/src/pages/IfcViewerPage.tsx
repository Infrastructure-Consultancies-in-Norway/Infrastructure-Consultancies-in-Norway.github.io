import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import IfcViewer from '../components/IfcViewer';
import IfcModelGallery from '../components/IfcModelGallery';
import { useLanguage } from '../contexts/LanguageContext';
import { findIfcModel, IfcModelOption, loadIfcModels } from '../data/ifcModels';

const IfcViewerPage: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const { t } = useLanguage();
  const [models, setModels] = useState<IfcModelOption[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadIfcModels()
      .then((loaded) => {
        if (!cancelled) {
          setModels(loaded);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (failed || !models) {
    return (
      <div className="container my-5 pt-5">
        <p role={failed ? 'alert' : 'status'}>{t(failed ? 'ifcViewer.modelsLoadFailed' : 'ifcViewer.modelsLoading')}</p>
      </div>
    );
  }

  if (!modelId) {
    return <IfcModelGallery models={models} />;
  }

  const model = findIfcModel(models, modelId);

  if (!model) {
    return <Navigate to="/ifc-viewer" replace />;
  }

  return <IfcViewer model={model} models={models} />;
};

export default IfcViewerPage;
