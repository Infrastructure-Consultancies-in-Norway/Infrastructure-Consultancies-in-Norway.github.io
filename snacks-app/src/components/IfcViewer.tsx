import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './IfcViewer.css';

// const IFC_MODEL_URL = '/Files/Eksempelmodell_SNACks.ifc';
const IFC_MODEL_URL = '/Files/f_bru_34-0147_Osa_bru.ifc';
const IFC_LITE_WASM_URL = '/wasm/ifc-lite_bg.wasm';

type EntitySummary = {
  expressId: number;
  type: string;
  name: string;
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
  meshes: import('@ifc-lite/geometry/dist/types').MeshData[],
): EntitySummary[] => {
  const entitiesById = new Map<number, EntitySummary>();

  for (const mesh of meshes) {
    const expressId = mesh.expressId;

    if (!expressId || entitiesById.has(expressId)) {
      continue;
    }

    const type = store?.entities.getTypeName(expressId) || mesh.ifcType || 'IfcObject';
    const rawName = store?.entities.getName(expressId);

    entitiesById.set(expressId, {
      expressId,
      type,
      name: rawName || `${type} #${expressId}`,
    });
  }

  return Array.from(entitiesById.values()).sort((left, right) => left.type.localeCompare(right.type) || left.expressId - right.expressId);
};

const IfcViewer: React.FC = () => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runtimeRef = useRef<IfcRuntime>({ renderer: null, store: null, selectedId: null, animationFrame: null });
  const dragStateRef = useRef<{ button: number; x: number; y: number; moved: boolean } | null>(null);
  const translateRef = useRef(t);
  const [status, setStatus] = useState(t('ifcViewer.loadingPlaceholder'));
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [entities, setEntities] = useState<EntitySummary[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<EntitySummary | null>(null);
  const [propertySets, setPropertySets] = useState<PropertySet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  translateRef.current = t;

  const filteredEntities = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return entities.slice(0, 150);
    }

    return entities
      .filter((entity) => `${entity.name} ${entity.type} ${entity.expressId}`.toLowerCase().includes(normalizedSearch))
      .slice(0, 150);
  }, [entities, searchTerm]);

  const renderSelection = useCallback((expressId: number | null) => {
    const { renderer } = runtimeRef.current;

    if (!renderer) {
      return;
    }

    if (expressId) {
      renderer.render({ selectedIds: new Set([expressId]) });
      return;
    }

    renderer.render();
  }, []);

  const selectEntity = useCallback(async (expressId: number | null) => {
    const { store, renderer } = runtimeRef.current;
    runtimeRef.current.selectedId = expressId;
    renderSelection(expressId);

    if (!expressId) {
      setSelectedEntity(null);
      setPropertySets([]);
      return;
    }

    const entityType = store?.entities.getTypeName(expressId) || 'IfcObject';
    const entityName = store?.entities.getName(expressId) || `${entityType} #${expressId}`;
    setSelectedEntity({ expressId, type: entityType, name: entityName });

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

    if (renderer) {
      renderer.fitToView();
    }
  }, [renderSelection]);

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
      renderSelection(runtimeRef.current.selectedId);
    };

    const resizeRenderer = () => {
      const { renderer } = runtimeRef.current;

      if (!canvas || !renderer) {
        return;
      }

      const { width, height } = canvas.getBoundingClientRect();

      if (width > 0 && height > 0) {
        renderer.resize(Math.floor(width), Math.floor(height));
        renderSelection(runtimeRef.current.selectedId);
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
        setStatus(translateRef.current('ifcViewer.fetching'));

        const [{ Renderer }, { GeometryProcessor }, { IfcParser }, { default: initIfcLiteWasm }] = await Promise.all([
          import('@ifc-lite/renderer'),
          import('@ifc-lite/geometry'),
          import('@ifc-lite/parser'),
          import('@ifc-lite/wasm'),
        ]);

        if (cancelled) {
          return;
        }

        const renderer = new Renderer(canvas);
        runtimeRef.current.renderer = renderer;
        await renderer.init();
        await initIfcLiteWasm({ module_or_path: IFC_LITE_WASM_URL });
        resizeRenderer();

        const response = await fetch(IFC_MODEL_URL);

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

        const meshes: import('@ifc-lite/geometry/dist/types').MeshData[] = [];

        for await (const event of geometry.processAdaptive(bytes, {
          batchSize: {
            initialBatchSize: 20,
            maxBatchSize: 150,
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
            renderer.render();
          }
        }

        if (!meshes.length) {
          throw new Error(translateRef.current('ifcViewer.noGeometry'));
        }

        renderer.fitToView();
        renderer.render();
        setEntities(getEntitySummaries(store, meshes));
        setStatus(`${translateRef.current('ifcViewer.ready')} ${meshes.length} ${translateRef.current('ifcViewer.objectsLoaded')}`);
        setIsReady(true);
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
  }, [renderSelection]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = { button: event.button, x: event.clientX, y: event.clientY, moved: false };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    const renderer = runtimeRef.current.renderer;

    if (!dragState || !renderer) {
      return;
    }

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
    renderSelection(runtimeRef.current.selectedId);
  };

  const handlePointerUp = async (event: React.PointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    const renderer = runtimeRef.current.renderer;
    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (!renderer || dragState?.moved) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const pick = await renderer.pick(event.clientX - bounds.left, event.clientY - bounds.top);
    await selectEntity(pick?.expressId ?? null);
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
  };

  return (
    <div id="ifc-viewer" className="slide-component container my-5 pt-5">
      <h2>{t('ifcViewer.title')}</h2>
      <p className="lead">{t('ifcViewer.intro')}</p>
      <div className="ifc-viewer-shell" aria-label={t('ifcViewer.title')}>
        <aside className="ifc-viewer-panel ifc-viewer-hierarchy">
          <h3>{t('ifcViewer.hierarchy')}</h3>
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
              {filteredEntities.map((entity) => (
                <button
                  className={`ifc-viewer-entity-item${selectedEntity?.expressId === entity.expressId ? ' selected' : ''}`}
                  key={entity.expressId}
                  type="button"
                  onClick={() => selectEntity(entity.expressId)}
                >
                  <span>{getEntityLabel(runtimeRef.current.store, entity.expressId, entity.type)}</span>
                  <small>{entity.type}</small>
                </button>
              ))}
            </div>
          ) : (
            <p>{t('ifcViewer.hierarchyPlaceholder')}</p>
          )}
        </aside>
        <div className="ifc-viewer-canvas-panel">
          <canvas
            ref={canvasRef}
            className="ifc-viewer-canvas"
            aria-label={t('ifcViewer.canvasLabel')}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onContextMenu={handleContextMenu}
          />
          <div className={`ifc-viewer-status${error ? ' error' : ''}${isReady ? ' ready' : ''}`}>{error || status}</div>
        </div>
        <aside className="ifc-viewer-panel ifc-viewer-properties">
          <h3>{t('ifcViewer.properties')}</h3>
          {selectedEntity ? (
            <>
              <div className="ifc-viewer-selected-meta">
                <strong>{selectedEntity.name}</strong>
                <span>{selectedEntity.type} #{selectedEntity.expressId}</span>
              </div>
              {propertySets.length ? (
                <div className="ifc-viewer-property-list">
                  {propertySets.map((propertySet) => (
                    <section key={propertySet.name} className="ifc-viewer-property-set">
                      <h4>{propertySet.name}</h4>
                      {(propertySet.properties || propertySet.quantities || []).map((property) => (
                        <dl key={property.name} className="ifc-viewer-property-row">
                          <dt>{property.name}</dt>
                          <dd>{formatValue('values' in property && property.values ? property.values : property.value)}</dd>
                        </dl>
                      ))}
                    </section>
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