export type IfcModelOption = {
  id: string;
  label: string;
  fileName: string;
  url: string;
  githubUrl: string;
  sizeBytes: number;
  /** Thumbnail PNG shown on the gallery card (may be missing for brand-new models). */
  thumbnailUrl: string;
};

const IFC_DETAILS_BRANCH = 'ifc-details';
const IFC_DETAILS_REPOSITORY = 'Infrastructure-Consultancies-in-Norway/3d-details-property-mapper';
const IFC_DETAILS_PATH = 'ifc-files/output';
const IFC_DETAILS_RAW_BASE_URL = `https://raw.githubusercontent.com/${IFC_DETAILS_REPOSITORY}/${IFC_DETAILS_BRANCH}/${IFC_DETAILS_PATH}`;
const IFC_DETAILS_GITHUB_BASE_URL = `https://github.com/${IFC_DETAILS_REPOSITORY}/blob/${IFC_DETAILS_BRANCH}/${IFC_DETAILS_PATH}`;

const MANIFEST_URL = `${IFC_DETAILS_RAW_BASE_URL}/manifest.json`;
const THUMBNAIL_BASE_URL = `${IFC_DETAILS_RAW_BASE_URL}/thumbnails`;

type IfcManifestEntry = { fileName: string; sizeBytes?: number };

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

let modelsPromise: Promise<IfcModelOption[]> | null = null;

/**
 * Loads the model list from `manifest.json` in the IFC details repository, so new models added
 * there show up without changing this app. The result is cached for the lifetime of the page.
 */
export const loadIfcModels = (): Promise<IfcModelOption[]> => {
  if (!modelsPromise) {
    modelsPromise = fetch(MANIFEST_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load ${MANIFEST_URL} (${response.status})`);
        }

        return response.json() as Promise<IfcManifestEntry[]>;
      })
      .then((entries) => entries.map((entry) => createRemoteModel(entry.fileName, entry.sizeBytes ?? 0)))
      .catch((error) => {
        modelsPromise = null;
        throw error;
      });
  }

  return modelsPromise;
};

/** Looks up a model by id. */
export const findIfcModel = (models: IfcModelOption[], id: string | undefined): IfcModelOption | undefined =>
  id ? models.find((model) => model.id === id) : undefined;