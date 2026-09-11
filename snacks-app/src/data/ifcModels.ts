export type IfcModelOption = {
  id: string;
  label: string;
  fileName: string;
  url: string;
  githubUrl: string;
  sizeBytes: number;
};

const IFC_DETAILS_BRANCH = 'ifc-details';
const IFC_DETAILS_REPOSITORY = 'Infrastructure-Consultancies-in-Norway/3d-details-property-mapper';
const IFC_DETAILS_PATH = 'ifc-files/output';
const IFC_DETAILS_RAW_BASE_URL = `https://raw.githubusercontent.com/${IFC_DETAILS_REPOSITORY}/${IFC_DETAILS_BRANCH}/${IFC_DETAILS_PATH}`;
const IFC_DETAILS_GITHUB_BASE_URL = `https://github.com/${IFC_DETAILS_REPOSITORY}/blob/${IFC_DETAILS_BRANCH}/${IFC_DETAILS_PATH}`;

const createRemoteModel = (fileName: string, sizeBytes: number): IfcModelOption => {
  const label = fileName.replace(/^SNACKS_Detalj_/, '').replace(/\.ifc$/i, '').replace(/_/g, ' ');

  return {
    id: fileName.replace(/\.ifc$/i, '').toLowerCase(),
    label,
    fileName,
    url: `${IFC_DETAILS_RAW_BASE_URL}/${fileName}`,
    githubUrl: `${IFC_DETAILS_GITHUB_BASE_URL}/${fileName}`,
    sizeBytes,
  };
};

export const IFC_MODELS: IfcModelOption[] = [
  createRemoteModel('SNACKS_Detalj_Bolter.ifc', 492262),
  createRemoteModel('SNACKS_Detalj_Jordingsbolt.ifc', 89825),
  createRemoteModel('SNACKS_Detalj_Lager.ifc', 209145),
  createRemoteModel('SNACKS_Detalj_Nivelleringsbolt.ifc', 32229),
  createRemoteModel('SNACKS_Detalj_Overgangsplate.ifc', 103423),
  createRemoteModel('SNACKS_Detalj_Pel.ifc', 117160),
  createRemoteModel('SNACKS_Detalj_Sluk.ifc', 146093),
  createRemoteModel('SNACKS_Detalj_Tilslutning_Kantbjelke.ifc', 43172),
  {
    id: 'snacks-sample-model',
    label: 'Eksempelmodell SNACks',
    fileName: 'Eksempelmodell_SNACks.ifc',
    url: '/Files/Eksempelmodell_SNACks.ifc',
    githubUrl: 'https://github.com/Infrastructure-Consultancies-in-Norway/Infrastructure-Consultancies-in-Norway.github.io/blob/master/Files/Eksempelmodell_SNACks.ifc',
    sizeBytes: 0,
  },
];

export const DEFAULT_IFC_MODEL_ID = IFC_MODELS[0].id;