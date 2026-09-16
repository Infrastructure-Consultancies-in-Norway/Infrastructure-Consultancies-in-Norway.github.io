import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IFC_LITE_URL } from '../constants/links';
import { useLanguage } from '../contexts/LanguageContext';
import { findIfcModel, VISIBLE_IFC_MODELS } from '../data/ifcModels';
import './IfcViewer.css';

const IFC_LITE_WASM_URL = '/wasm/ifc-lite_bg.wasm';

const BACKGROUND_STORAGE_KEY = 'snacks.ifcViewer.background';
const GROUP_MODE_STORAGE_KEY = 'snacks.ifcViewer.groupMode';
const ELEMENT_NAME_PROPERTY = 'BIM.05 - Elementnavn';
const ELEMENT_NAME_RESOLUTION_CHUNK_SIZE = 50;

type BackgroundTheme = 'light' | 'dark';
type GroupMode = 'elementName' | 'entity';

/** Matches `.ifc-viewer-canvas-panel` background colours in IfcViewer.css. */
const CLEAR_COLOR_BY_THEME: Record<BackgroundTheme, [number, number, number, number]> = {
  light: [0.933, 0.949, 0.921, 1],
  dark: [0.055, 0.055, 0.059, 1],
};

const readStoredValue = <T extends string>(key: string, allowedValues: readonly T[], fallback: T): T => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored && (allowedValues as readonly string[]).includes(stored) ? (stored as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStoredValue = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors (private browsing, disabled storage, etc.).
  }
};

type EntitySummary = {
  expressId: number;
  type: string;
  name: string;
  elementName: string;
};

type HierarchyGroup = {
  key: string;
  label: string;
  entities: EntitySummary[];
};

type ViewerMesh = {
  expressId?: number;
  ifcType?: string;
};

type PropertySet = {
  name: string;
  properties?: Array<{
    name: string;
    value: unknown;
    values?: string[];
  }>;
  quantities?: Array<{
    name: string;
    value: number;
  }>;
};

type IfcRuntime = {
  renderer: import('@ifc-lite/renderer').Renderer | null;
  store: import('@ifc-lite/parser').IfcDataStore | null;
  selectedId: number | null;
  animationFrame: number | null;
};

const formatFileSize = (bytes: number) => {
  const megabytes = bytes / 1024 / 1024;
  return `${megabytes.toFixed(1)} MB`;
};

const formatValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.map(formatValue).join(', ');
  }

  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

const getEntityLabel = (store: import('@ifc-lite/parser').IfcDataStore | null, expressId: number, fallbackType = 'IfcObject') => {
  const name = store?.entities.getName(expressId);
  const type = store?.entities.getTypeName(expressId) || fallbackType;
  return name ? `${name} (#${expressId})` : `${type} #${expressId}`;
};

const getEntitySummaries = (
  store: import('@ifc-lite/parser').IfcDataStore | null,
  meshes: ViewerMesh[],
): EntitySummary[] => {
  const entitiesById = new Map<number, EntitySummary>();

  for (const mesh of meshes) {
    const expressId = mesh.expressId;

    if (!expressId || entitiesById.has(expressId)) {
      continue;
    }

    const type = store?.entities.getTypeName(expressId) || mesh.ifcType || 'IfcObject';
    const rawName = store?.entities.getName(expressId);
    const name = rawName || `${type} #${expressId}`;

    entitiesById.set(expressId, {
      expressId,
      type,
      name,
      // Placeholder until resolveElementNames() fills in the real BIM.05 - Elementnavn value.
      elementName: name,
    });
  }

  return Array.from(entitiesById.values()).sort((left, right) => left.type.localeCompare(right.type) || left.expressId - right.expressId);
};

/**
 * Looks up the "BIM.05 - Elementnavn" property for a single entity, falling back to any
 * property ending in "elementnavn" (case-insensitive), then the entity's own name/type.
 */
const resolveElementNameForEntity = (
  store: import('@ifc-lite/parser').IfcDataStore,
  extractPropertiesOnDemand: typeof import('@ifc-lite/parser').extractPropertiesOnDemand,
  entity: EntitySummary,
): string => {
  try {
    const propertySets = extractPropertiesOnDemand(store, entity.expressId);
    let suffixMatch: string | null = null;

    for (const propertySet of propertySets) {
      for (const property of propertySet.properties || []) {
        const value = formatValue(property.value);

        if (!value || value === '-') {
          continue;
        }

        if (property.name === ELEMENT_NAME_PROPERTY) {
          return value;
        }

        if (!suffixMatch && property.name.trim().toLowerCase().endsWith('elementnavn')) {
          suffixMatch = value;
        }
      }
    }

    if (suffixMatch) {
      return suffixMatch;
    }
  } catch {
    // Fall through to the name/type fallback below if property extraction fails.
  }

  return entity.name;
};

/**
 * Resolves Elementnavn values for every entity, yielding to the event loop every
 * ELEMENT_NAME_RESOLUTION_CHUNK_SIZE entities so the UI stays responsive on large models.
 */
const resolveElementNames = async (
  store: import('@ifc-lite/parser').IfcDataStore,
  extractPropertiesOnDemand: typeof import('@ifc-lite/parser').extractPropertiesOnDemand,
  entities: EntitySummary[],
  isCancelled: () => boolean,
  onProgress?: (resolved: number, total: number) => void,
): Promise<Map<number, string>> => {
  const elementNames = new Map<number, string>();

  for (let index = 0; index < entities.length; index += 1) {
    if (isCancelled()) {
      break;
    }

    const entity = entities[index];
    elementNames.set(entity.expressId, resolveElementNameForEntity(store, extractPropertiesOnDemand, entity));

    if ((index + 1) % ELEMENT_NAME_RESOLUTION_CHUNK_SIZE === 0) {
      onProgress?.(index + 1, entities.length);
      await new Promise((resolve) => {
        window.setTimeout(resolve, 0);
      });
    }
  }

  return elementNames;
};

const groupEntities = (entities: EntitySummary[], mode: GroupMode, noNameLabel: string): HierarchyGroup[] => {
  const groups = new Map<string, EntitySummary[]>();

  for (const entity of entities) {
    const rawKey = mode === 'entity' ? entity.type : entity.elementName;
    const key = rawKey && rawKey.trim() ? rawKey.trim() : noNameLabel;
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.push(entity);
    } else {
      groups.set(key, [entity]);
    }
  }

  return Array.from(groups.entries())
    .map(([key, groupEntities]) => ({ key, label: key, entities: groupEntities }))
    .sort((left, right) => left.label.localeCompare(right.label));
};

type IfcViewerProps = {
  modelId: string;
};

const IfcViewer: React.FC<IfcViewerProps> = ({ modelId }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isThumbnailMode = searchParams.get('thumbnail') === '1';
  const shellRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runtimeRef = useRef<IfcRuntime>({ renderer: null, store: null, selectedId: null, animationFrame: null });
  const dragStateRef = useRef<{ button: number; x: number; y: number; moved: boolean } | null>(null);
  const translateRef = useRef(t);
  const backgroundThemeRef = useRef<BackgroundTheme>('light');
  const [status, setStatus] = useState(t('ifcViewer.loadingPlaceholder'));
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [entities, setEntities] = useState<EntitySummary[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<EntitySummary | null>(null);
  const [propertySets, setPropertySets] = useState<PropertySet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set());
  const [viewerHeight, setViewerHeight] = useState(560);
  const [panelSizes, setPanelSizes] = useState({ hierarchy: 260, properties: 300 });
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>(() =>
    readStoredValue<BackgroundTheme>(BACKGROUND_STORAGE_KEY, ['light', 'dark'], 'light'),
  );
  const [groupMode, setGroupMode] = useState<GroupMode>(() =>
    readStoredValue<GroupMode>(GROUP_MODE_STORAGE_KEY, ['elementName', 'entity'], 'elementName'),
  );
  const resizeStateRef = useRef<
    | { kind: 'hierarchy' | 'properties'; startX: number; startSize: number }
    | { kind: 'height'; startY: number; startHeight: number }
    | null
  >(null);

  translateRef.current = t;

  const selectedModel = useMemo(() => findIfcModel(modelId, true) || VISIBLE_IFC_MODELS[0], [modelId]);

  useEffect(() => {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    shell.style.setProperty('--ifc-hierarchy-width', `${panelSizes.hierarchy}px`);
    shell.style.setProperty('--ifc-properties-width', `${panelSizes.properties}px`);
    shell.style.setProperty('--ifc-viewer-height', `${viewerHeight}px`);
  }, [panelSizes, viewerHeight]);

  const renderFrame = useCallback((expressId: number | null) => {
    const { renderer } = runtimeRef.current;

    if (!renderer) {
      return;
    }

    const clearColor = CLEAR_COLOR_BY_THEME[isThumbnailMode ? 'light' : backgroundThemeRef.current];

    if (expressId) {
      renderer.render({ selectedIds: new Set([expressId]), clearColor });
      return;
    }

    renderer.render({ clearColor });
  }, [isThumbnailMode]);

  useEffect(() => {
    backgroundThemeRef.current = backgroundTheme;
    renderFrame(runtimeRef.current.selectedId);
    writeStoredValue(BACKGROUND_STORAGE_KEY, backgroundTheme);
  }, [backgroundTheme, renderFrame]);

  useEffect(() => {
    writeStoredValue(GROUP_MODE_STORAGE_KEY, groupMode);
  }, [groupMode]);

  const entitiesRef = useRef<EntitySummary[]>([]);

  useEffect(() => {
    entitiesRef.current = entities;
  }, [entities]);

  const filteredHierarchy = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const noNameLabel = t('ifcViewer.noElementName');

    if (!normalizedSearch) {
      return groupEntities(entities, groupMode, noNameLabel);
    }

    return groupEntities(
      entities.filter((entity) =>
        `${entity.name} ${entity.elementName} ${entity.type} ${entity.expressId}`.toLowerCase().includes(normalizedSearch),
      ),
      groupMode,
      noNameLabel,
    );
  }, [entities, groupMode, searchTerm, t]);

  const totalVisibleEntities = useMemo(
    () => filteredHierarchy.reduce((count, group) => count + group.entities.length, 0),
    [filteredHierarchy],
  );

  const selectEntity = useCallback(async (expressId: number | null) => {
    const { store } = runtimeRef.current;
    runtimeRef.current.selectedId = expressId;
    renderFrame(expressId);

    if (!expressId) {
      setSelectedEntity(null);
      setPropertySets([]);
      return;
    }

    const knownEntity = entitiesRef.current.find((entity) => entity.expressId === expressId);
    const entityType = knownEntity?.type || store?.entities.getTypeName(expressId) || 'IfcObject';
    const entityName = knownEntity?.name || store?.entities.getName(expressId) || `${entityType} #${expressId}`;
    const elementName = knownEntity?.elementName || entityName;
    setSelectedEntity({ expressId, type: entityType, name: entityName, elementName });

    if (!store) {
      setPropertySets([]);
      return;
    }

    const { extractPropertiesOnDemand, extractQuantitiesOnDemand } = await import('@ifc-lite/parser');
    const properties = extractPropertiesOnDemand(store, expressId);
    const quantities = extractQuantitiesOnDemand(store, expressId).map((quantitySet) => ({
      name: quantitySet.name,
      quantities: quantitySet.quantities,
    }));

    setPropertySets([...properties, ...quantities]);
  }, [renderFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    const handleCanvasWheel = (event: WheelEvent) => {
      if (!canvas) {
        return;
      }

      event.preventDefault();

      const renderer = runtimeRef.current.renderer;

      if (!renderer) {
        return;
      }

      const bounds = canvas.getBoundingClientRect();
      renderer.getCamera().zoom(event.deltaY, false, event.clientX - bounds.left, event.clientY - bounds.top, bounds.width, bounds.height);
      renderFrame(runtimeRef.current.selectedId);
    };

    const resizeRenderer = () => {
      const { renderer } = runtimeRef.current;

      if (!canvas || !renderer) {
        return;
      }

      const { width, height } = canvas.getBoundingClientRect();

      if (width > 0 && height > 0) {
        renderer.resize(Math.floor(width), Math.floor(height));
        renderFrame(runtimeRef.current.selectedId);
      }
    };

    const initializeViewer = async () => {
      if (!canvas) {
        return;
      }

      if (!('gpu' in navigator)) {
        setError(translateRef.current('ifcViewer.webgpuUnsupported'));
        setStatus(translateRef.current('ifcViewer.webgpuUnsupportedHint'));
        return;
      }

      try {
        setError(null);
        setIsReady(false);
        setEntities([]);
        setSelectedEntity(null);
        setPropertySets([]);
        setSearchTerm('');
        setExpandedGroups(new Set());
        setStatus(`${translateRef.current('ifcViewer.fetching')} ${selectedModel.label}`);

        const [{ Renderer }, { GeometryProcessor }, { IfcParser, extractPropertiesOnDemand }] = await Promise.all([
          import('@ifc-lite/renderer'),
          import('@ifc-lite/geometry'),
          import('@ifc-lite/parser'),
        ]);

        if (cancelled) {
          return;
        }

        const renderer = new Renderer(canvas);
        runtimeRef.current.renderer = renderer;
        await renderer.init();
        resizeRenderer();

        const response = await fetch(selectedModel.url);

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        setStatus(`${translateRef.current('ifcViewer.parsing')} ${formatFileSize(bytes.byteLength)}`);

        const parser = new IfcParser();
        const store = await parser.parseColumnar(buffer, {
          onProgress: (progress) => {
            setStatus(`${translateRef.current('ifcViewer.parsing')} ${progress.phase} ${Math.round(progress.percent)}%`);
          },
        });

        if (cancelled) {
          return;
        }

        runtimeRef.current.store = store;
        setStatus(translateRef.current('ifcViewer.processingGeometry'));

        const geometry = new GeometryProcessor({ tessellationQuality: 'low' });
        await geometry.init();

        const meshes: ViewerMesh[] = [];

        for await (const event of geometry.processAdaptive(bytes, {
          batchSize: {
            fileSizeMB: bytes.byteLength / 1024 / 1024,
          },
          wasmUrls: {
            wasm: IFC_LITE_WASM_URL,
          },
        })) {
          if (cancelled) {
            return;
          }

          if (event.type === 'batch') {
            renderer.addMeshes(event.meshes, true);
            meshes.push(...event.meshes);
            setStatus(`${translateRef.current('ifcViewer.loadingGeometry')} ${meshes.length}`);
            renderFrame(null);
          }
        }

        if (!meshes.length) {
          throw new Error(translateRef.current('ifcViewer.noGeometry'));
        }

        renderer.fitToView();
        renderFrame(null);

        if (isThumbnailMode) {
          try {
            const dataUrl = await renderer.captureScreenshot();
            (window as unknown as { __ifcViewerThumbnail?: string | null }).__ifcViewerThumbnail = dataUrl;
          } catch {
            (window as unknown as { __ifcViewerThumbnail?: string | null }).__ifcViewerThumbnail = null;
          }

          setStatus(`${translateRef.current('ifcViewer.ready')} ${meshes.length} ${translateRef.current('ifcViewer.objectsLoaded')}`);
          setIsReady(true);
          return;
        }

        const baseEntities = getEntitySummaries(store, meshes);
        setEntities(baseEntities);
        const readyMessage = `${translateRef.current('ifcViewer.ready')} ${meshes.length} ${translateRef.current('ifcViewer.objectsLoaded')}`;
        setStatus(readyMessage);
        setIsReady(true);

        const elementNames = await resolveElementNames(
          store,
          extractPropertiesOnDemand,
          baseEntities,
          () => cancelled,
          (resolved, total) => setStatus(`${translateRef.current('ifcViewer.resolvingElementNames')} ${resolved}/${total}`),
        );

        if (cancelled) {
          return;
        }

        setEntities((currentEntities) =>
          currentEntities.map((entity) => ({
            ...entity,
            elementName: elementNames.get(entity.expressId) ?? entity.elementName,
          })),
        );
        setStatus(readyMessage);
      } catch (viewerError) {
        if (cancelled) {
          return;
        }

        const message = viewerError instanceof Error ? viewerError.message : String(viewerError);
        setError(message);
        setStatus(translateRef.current('ifcViewer.failed'));
      }
    };

    initializeViewer();

    if (canvas) {
      canvas.addEventListener('wheel', handleCanvasWheel, { passive: false });
      resizeObserver = new ResizeObserver(resizeRenderer);
      resizeObserver.observe(canvas);
    }

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      canvas?.removeEventListener('wheel', handleCanvasWheel);

      if (runtimeRef.current.animationFrame !== null) {
        window.cancelAnimationFrame(runtimeRef.current.animationFrame);
      }

      runtimeRef.current.renderer?.destroy();
      runtimeRef.current = { renderer: null, store: null, selectedId: null, animationFrame: null };
    };
  }, [renderFrame, selectedModel, isThumbnailMode]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = { button: event.button, x: event.clientX, y: event.clientY, moved: false };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    const renderer = runtimeRef.current.renderer;

    if (!dragState || !renderer) {
      return;
    }

    event.preventDefault();

    const deltaX = event.clientX - dragState.x;
    const deltaY = event.clientY - dragState.y;

    if (Math.abs(deltaX) + Math.abs(deltaY) > 2) {
      dragState.moved = true;
    }

    const camera = renderer.getCamera();

    if (event.buttons === 1) {
      camera.orbit(deltaX, deltaY);
    } else if (event.buttons === 2 || event.buttons === 4) {
      camera.pan(deltaX, deltaY);
    }

    dragState.x = event.clientX;
    dragState.y = event.clientY;
    renderFrame(runtimeRef.current.selectedId);
  };

  const handlePointerUp = async (event: React.PointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    const renderer = runtimeRef.current.renderer;
    dragStateRef.current = null;
    event.preventDefault();
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (!renderer || dragState?.moved) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const pick = await renderer.pick(event.clientX - bounds.left, event.clientY - bounds.top);
    await selectEntity(pick?.expressId ?? null);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLCanvasElement>) => {
    dragStateRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const fitModelToView = () => {
    const { renderer } = runtimeRef.current;

    if (!renderer) {
      return;
    }

    renderer.fitToView();
    renderFrame(runtimeRef.current.selectedId);
  };

  const toggleGroup = (key: string) => {
    const groupKey = `${groupMode}::${key}`;

    setExpandedGroups((currentExpandedGroups) => {
      const nextExpandedGroups = new Set(currentExpandedGroups);

      if (nextExpandedGroups.has(groupKey)) {
        nextExpandedGroups.delete(groupKey);
      } else {
        nextExpandedGroups.add(groupKey);
      }

      return nextExpandedGroups;
    });
  };

  const startResize = (event: React.PointerEvent<HTMLButtonElement>, kind: 'hierarchy' | 'properties' | 'height') => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeStateRef.current =
      kind === 'height'
        ? { kind, startY: event.clientY, startHeight: viewerHeight }
        : {
            kind,
            startX: event.clientX,
            startSize: kind === 'hierarchy' ? panelSizes.hierarchy : panelSizes.properties,
          };
  };

  const handleResizeMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const resizeState = resizeStateRef.current;

    if (!resizeState) {
      return;
    }

    if (resizeState.kind === 'height') {
      const nextHeight = Math.min(820, Math.max(380, resizeState.startHeight + event.clientY - resizeState.startY));
      setViewerHeight(nextHeight);
      return;
    }

    const direction = resizeState.kind === 'hierarchy' ? 1 : -1;
    const nextSize = Math.min(420, Math.max(190, resizeState.startSize + (event.clientX - resizeState.startX) * direction));
    setPanelSizes((currentSizes) => ({ ...currentSizes, [resizeState.kind]: nextSize }));
  };

  const stopResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    resizeStateRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
  };

  const handleCanvasMouseButton = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.button === 1 || event.button === 2) {
      event.preventDefault();
    }
  };

  const handleAuxClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
  };

  if (isThumbnailMode) {
    return (
      <div className="ifc-viewer-thumbnail-mode">
        <canvas ref={canvasRef} className="ifc-viewer-canvas" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div id="ifc-viewer" className="slide-component container my-5 pt-5" data-background={backgroundTheme}>
      <Link className="ifc-viewer-back-link" to="/ifc-viewer">
        {'< '}
        {t('ifcViewer.galleryBack')}
      </Link>
      <h2>{t('ifcViewer.title')}</h2>
      <p className="ifc-viewer-disclaimer">{t('ifcViewer.disclaimer')}</p>
      <p className="lead">{t('ifcViewer.intro')}</p>
      <p className="ifc-viewer-credit">
        {t('ifcViewer.creditPrefix')}{' '}
        <a href={IFC_LITE_URL} target="_blank" rel="noreferrer">
          ifcLite
        </a>
        {' | '}
        <a href={selectedModel.githubUrl} target="_blank" rel="noreferrer">
          {t('ifcViewer.modelSource')}
        </a>
      </p>
      <div className="ifc-viewer-model-toolbar">
        <label htmlFor="ifc-viewer-model-select">{t('ifcViewer.model')}</label>
        <select
          id="ifc-viewer-model-select"
          className="ifc-viewer-model-select"
          value={selectedModel.id}
          onChange={(event) => navigate(`/ifc-viewer/${event.target.value}`)}
        >
          {VISIBLE_IFC_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.sizeBytes ? `${model.label} (${formatFileSize(model.sizeBytes)})` : model.label}
            </option>
          ))}
        </select>
        <span>{selectedModel.sizeBytes ? `${selectedModel.fileName} - ${formatFileSize(selectedModel.sizeBytes)}` : selectedModel.fileName}</span>
        <div className="ifc-viewer-segmented-control" role="group" aria-label={t('ifcViewer.background')}>
          <span className="ifc-viewer-segmented-label">{t('ifcViewer.background')}</span>
          <button
            type="button"
            className={`ifc-viewer-segmented-option${backgroundTheme === 'light' ? ' selected' : ''}`}
            aria-pressed={backgroundTheme === 'light'}
            onClick={() => setBackgroundTheme('light')}
          >
            {t('ifcViewer.backgroundLight')}
          </button>
          <button
            type="button"
            className={`ifc-viewer-segmented-option${backgroundTheme === 'dark' ? ' selected' : ''}`}
            aria-pressed={backgroundTheme === 'dark'}
            onClick={() => setBackgroundTheme('dark')}
          >
            {t('ifcViewer.backgroundDark')}
          </button>
        </div>
      </div>
      <div ref={shellRef} className="ifc-viewer-shell" aria-label={t('ifcViewer.title')}>
        <aside className="ifc-viewer-panel ifc-viewer-hierarchy">
          <div className="ifc-viewer-panel-header">
            <h3>{t('ifcViewer.hierarchy')}</h3>
            <span>{entities.length}</span>
          </div>
          <div className="ifc-viewer-segmented-control" role="group" aria-label={t('ifcViewer.groupBy')}>
            <span className="ifc-viewer-segmented-label">{t('ifcViewer.groupBy')}</span>
            <button
              type="button"
              className={`ifc-viewer-segmented-option${groupMode === 'elementName' ? ' selected' : ''}`}
              aria-pressed={groupMode === 'elementName'}
              onClick={() => setGroupMode('elementName')}
            >
              {t('ifcViewer.groupByElementName')}
            </button>
            <button
              type="button"
              className={`ifc-viewer-segmented-option${groupMode === 'entity' ? ' selected' : ''}`}
              aria-pressed={groupMode === 'entity'}
              onClick={() => setGroupMode('entity')}
            >
              {t('ifcViewer.groupByEntity')}
            </button>
          </div>
          <input
            className="ifc-viewer-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t('ifcViewer.searchPlaceholder')}
            aria-label={t('ifcViewer.searchPlaceholder')}
            disabled={!entities.length}
          />
          {entities.length ? (
            <div className="ifc-viewer-entity-list" aria-label={t('ifcViewer.hierarchy')}>
              {filteredHierarchy.map((group) => {
                const isExpanded = searchTerm.trim() ? true : expandedGroups.has(`${groupMode}::${group.key}`);

                return (
                  <section className="ifc-viewer-tree-group" key={group.key}>
                    <button className="ifc-viewer-tree-group-toggle" type="button" onClick={() => toggleGroup(group.key)}>
                      <span aria-hidden="true">{isExpanded ? 'v' : '>'}</span>
                      <strong>{group.label}</strong>
                      <small>{group.entities.length}</small>
                    </button>
                    {isExpanded ? (
                      <div className="ifc-viewer-tree-items">
                        {group.entities.map((entity) => (
                          <button
                            className={`ifc-viewer-entity-item${selectedEntity?.expressId === entity.expressId ? ' selected' : ''}`}
                            key={entity.expressId}
                            type="button"
                            onClick={() => selectEntity(entity.expressId)}
                          >
                            <span>{getEntityLabel(runtimeRef.current.store, entity.expressId, entity.type)}</span>
                            <small>#{entity.expressId}</small>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </section>
                );
              })}
              {!totalVisibleEntities ? <p>{t('ifcViewer.noSearchResults')}</p> : null}
            </div>
          ) : (
            <p>{t('ifcViewer.hierarchyPlaceholder')}</p>
          )}
        </aside>
        <button
          className="ifc-viewer-resize-handle ifc-viewer-resize-handle-vertical"
          type="button"
          aria-label={t('ifcViewer.resizeHierarchy')}
          onPointerDown={(event) => startResize(event, 'hierarchy')}
          onPointerMove={handleResizeMove}
          onPointerUp={stopResize}
          onPointerCancel={stopResize}
        />
        <div className="ifc-viewer-canvas-panel">
          <canvas
            ref={canvasRef}
            className="ifc-viewer-canvas"
            aria-label={t('ifcViewer.canvasLabel')}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onMouseDown={handleCanvasMouseButton}
            onMouseUp={handleCanvasMouseButton}
            onContextMenu={handleContextMenu}
            onAuxClick={handleAuxClick}
          />
          <div className={`ifc-viewer-status${error ? ' error' : ''}${isReady ? ' ready' : ''}`}>{error || status}</div>
          <button
            className="ifc-viewer-resize-handle ifc-viewer-resize-handle-horizontal"
            type="button"
            aria-label={t('ifcViewer.resizeViewer')}
            onPointerDown={(event) => startResize(event, 'height')}
            onPointerMove={handleResizeMove}
            onPointerUp={stopResize}
            onPointerCancel={stopResize}
          />
        </div>
        <button
          className="ifc-viewer-resize-handle ifc-viewer-resize-handle-vertical"
          type="button"
          aria-label={t('ifcViewer.resizeProperties')}
          onPointerDown={(event) => startResize(event, 'properties')}
          onPointerMove={handleResizeMove}
          onPointerUp={stopResize}
          onPointerCancel={stopResize}
        />
        <aside className="ifc-viewer-panel ifc-viewer-properties">
          <div className="ifc-viewer-panel-header">
            <h3>{t('ifcViewer.properties')}</h3>
            {selectedEntity ? (
              <button className="ifc-viewer-frame-button" type="button" onClick={fitModelToView}>
                {t('ifcViewer.fitModel')}
              </button>
            ) : null}
          </div>
          {selectedEntity ? (
            <>
              <div className="ifc-viewer-selected-meta">
                <strong>{selectedEntity.name}</strong>
                <span>{selectedEntity.type}</span>
                <dl className="ifc-viewer-identity-list">
                  <div>
                    <dt>{t('ifcViewer.expressId')}</dt>
                    <dd>#{selectedEntity.expressId}</dd>
                  </div>
                </dl>
              </div>
              {propertySets.length ? (
                <div className="ifc-viewer-property-list">
                  {propertySets.map((propertySet) => (
                    <details key={propertySet.name} className="ifc-viewer-property-set" open>
                      <summary>
                        <span>{propertySet.name}</span>
                        <small>{(propertySet.properties || propertySet.quantities || []).length}</small>
                      </summary>
                      <div className="ifc-viewer-property-set-body">
                        {(propertySet.properties || propertySet.quantities || []).map((property) => (
                          <dl key={property.name} className="ifc-viewer-property-row">
                            <dt>{property.name}</dt>
                            <dd>{formatValue('values' in property && property.values ? property.values : property.value)}</dd>
                          </dl>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <p>{t('ifcViewer.noProperties')}</p>
              )}
            </>
          ) : (
            <p>{t('ifcViewer.propertiesPlaceholder')}</p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default IfcViewer;