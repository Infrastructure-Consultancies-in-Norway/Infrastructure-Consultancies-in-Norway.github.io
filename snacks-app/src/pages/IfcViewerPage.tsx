import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import IfcViewer from '../components/IfcViewer';
import IfcModelGallery from '../components/IfcModelGallery';
import { findIfcModel } from '../data/ifcModels';

const IfcViewerPage: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();

  if (!modelId) {
    return <IfcModelGallery />;
  }

  const model = findIfcModel(modelId);

  if (!model) {
    return <Navigate to="/ifc-viewer" replace />;
  }

  return <IfcViewer modelId={model.id} />;
};

export default IfcViewerPage;