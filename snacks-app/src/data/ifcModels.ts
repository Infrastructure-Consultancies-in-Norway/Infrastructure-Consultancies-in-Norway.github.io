export type IfcModelOption = {
  id: string;
  label: string;
  fileName: string;
  url: string;
  githubUrl: string;
  sizeBytes: number;
  /** Excluded from the gallery and the model dropdown when true. */
  hidden?: boolean;
  /** Pre-generated thumbnail PNG shown on the gallery card. */
  thumbnailUrl: string;
};

const IFC_DETAILS_BRANCH = 'ifc-details';
const IFC_DETAILS_REPOSITORY = 'Infrastructure-Consultancies-in-Norway/3d-details-property-mapper';
const IFC_DETAILS_PATH = 'ifc-files/output';
const IFC_DETAILS_RAW_BASE_URL = `https://raw.githubusercontent.com/${IFC_DETAILS_REPOSITORY}/${IFC_DETAILS_BRANCH}/${IFC_DETAILS_PATH}`;
const IFC_DETAILS_GITHUB_BASE_URL = `https://github.com/${IFC_DETAILS_REPOSITORY}/blob/${IFC_DETAILS_BRANCH}/${IFC_DETAILS_PATH}`;

const THUMBNAIL_BASE_URL = `${import.meta.env.BASE_URL}thumbnails`;

const createRemoteModel = (fileName: string, sizeBytes: number): IfcModelOption => {
  const label = fileName.replace(/^SNACKS_Detalj_/, '').replace(/\.ifc$/i, '').replace(/_/g, ' ');
  const id = fileName.replace(/\.ifc$/i, '').toLowerCase();

  return {
    id,
    label,
    fileName,
    url: `${IFC_DETAILS_RAW_BASE_URL}/${fileName}`,
    githubUrl: `${IFC_DETAILS_GITHUB_BASE_URL}/${fileName}`,
    sizeBytes,
    thumbnailUrl: `${THUMBNAIL_BASE_URL}/${id}.png`,
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
    // Kept in the data set but not shown in the gallery or the model dropdown for now.
    hidden: true,
    thumbnailUrl: `${THUMBNAIL_BASE_URL}/snacks-sample-model.png`,
  },
];

/** Models shown in the gallery and the viewer's model dropdown. */
export const VISIBLE_IFC_MODELS: IfcModelOption[] = IFC_MODELS.filter((model) => !model.hidden);

export const DEFAULT_IFC_MODEL_ID = VISIBLE_IFC_MODELS[0].id;

/** Looks up a model by id, ignoring hidden models unless explicitly requested. */
export const findIfcModel = (id: string | undefined, includeHidden = false): IfcModelOption | undefined => {
  if (!id) {
    return undefined;
  }

  const models = includeHidden ? IFC_MODELS : VISIBLE_IFC_MODELS;
  return models.find((model) => model.id === id);
};