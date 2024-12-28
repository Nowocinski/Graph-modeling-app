'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  Background,
  Controls,
  NodeTypes,
  applyNodeChanges,
  NodeChange,
  addEdge,
  Connection,
  applyEdgeChanges,
  EdgeChange,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import BoxGeometryNode from './nodes/geometry/BoxGeometryNode';
import SphereGeometryNode from './nodes/geometry/SphereGeometryNode';
import CylinderGeometryNode from './nodes/geometry/CylinderGeometryNode';
import CapsuleGeometryNode from './nodes/geometry/CapsuleGeometryNode';
import CircleGeometryNode from './nodes/geometry/CircleGeometryNode';
import ConeGeometryNode from './nodes/geometry/ConeGeometryNode';
import DodecahedronGeometryNode from './nodes/geometry/DodecahedronGeometryNode';
import ExtrudeGeometryNode from './nodes/geometry/ExtrudeGeometryNode';
import IcosahedronGeometryNode from './nodes/geometry/IcosahedronGeometryNode';
import LatheGeometryNode from './nodes/geometry/LatheGeometryNode';
import OctahedronGeometryNode from './nodes/geometry/OctahedronGeometryNode';
import PlaneGeometryNode from './nodes/geometry/PlaneGeometryNode';
import RingGeometryNode from './nodes/geometry/RingGeometryNode';
import TetrahedronGeometryNode from './nodes/geometry/TetrahedronGeometryNode';
import TorusGeometryNode from './nodes/geometry/TorusGeometryNode';
import TorusKnotGeometryNode from './nodes/geometry/TorusKnotGeometryNode';
import TubeGeometryNode from './nodes/geometry/TubeGeometryNode';
import MeshNormalMaterialNode from './nodes/material/MeshNormalMaterialNode';
import MeshBasicMaterialNode from './nodes/material/MeshBasicMaterialNode';
import MeshPhongMaterialNode from './nodes/material/MeshPhongMaterialNode';
import MeshStandardMaterialNode from './nodes/material/MeshStandardMaterialNode';
import MeshNode from './nodes/MeshNode';
import SceneNode from './nodes/SceneNode';
import GroupNode from './nodes/GroupNode';
import SubtractNode from './nodes/operation/SubtractNode';
import IntersectNode from './nodes/operation/IntersectNode';
import UnionNode from './nodes/operation/UnionNode';
import LoopNode from './nodes/utility/LoopNode';
import BulkEditNode from './nodes/utility/BulkEditNode';
import NodeSelector from './NodeSelector';
import { useScene } from '../context/SceneContext';
import { useGraphManager } from '../hooks/useGraphManager';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import * as THREE from 'three';

// Definicja typów node'ów
const nodeTypes: NodeTypes = {
  boxGeometry: BoxGeometryNode,
  sphereGeometry: SphereGeometryNode,
  cylinderGeometry: CylinderGeometryNode,
  capsuleGeometry: CapsuleGeometryNode,
  circleGeometry: CircleGeometryNode,
  coneGeometry: ConeGeometryNode,
  dodecahedronGeometry: DodecahedronGeometryNode,
  extrudeGeometry: ExtrudeGeometryNode,
  icosahedronGeometry: IcosahedronGeometryNode,
  latheGeometry: LatheGeometryNode,
  octahedronGeometry: OctahedronGeometryNode,
  planeGeometry: PlaneGeometryNode,
  ringGeometry: RingGeometryNode,
  tetrahedronGeometry: TetrahedronGeometryNode,
  torusGeometry: TorusGeometryNode,
  torusKnotGeometry: TorusKnotGeometryNode,
  tubeGeometry: TubeGeometryNode,
  meshNormalMaterial: MeshNormalMaterialNode,
  meshBasicMaterial: MeshBasicMaterialNode,
  meshPhongMaterial: MeshPhongMaterialNode,
  meshStandardMaterial: MeshStandardMaterialNode,
  mesh: MeshNode,
  scene: SceneNode,
  group: GroupNode,
  subtract: SubtractNode,
  intersect: IntersectNode,
  union: UnionNode,
  loop: LoopNode,
  bulkEdit: BulkEditNode
};

// Domyślne wartości dla nowych node'ów
const defaultNodeData = {
  boxGeometry: {
    width: 1,
    height: 1,
    depth: 1
  },
  scene: {
    backgroundColor: '#ffffff',
    showAxesHelper: false,
    showGridHelper: false
  },
  sphereGeometry: {
    radius: 1,
    widthSegments: 32,
    heightSegments: 16
  },
  cylinderGeometry: {
    radiusTop: 1,
    radiusBottom: 1,
    height: 1,
    radialSegments: 32,
    heightSegments: 1,
    openEnded: false
  },
  capsuleGeometry: {
    radius: 1,
    length: 2,
    capSegments: 4,
    radialSegments: 8
  },
  circleGeometry: {
    radius: 1,
    segments: 32
  },
  coneGeometry: {
    radius: 1,
    height: 2,
    radialSegments: 32,
    heightSegments: 1,
    openEnded: false
  },
  dodecahedronGeometry: {
    radius: 1,
    detail: 0
  },
  extrudeGeometry: {
    depth: 1,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.1,
    bevelSegments: 3,
    steps: 1
  },
  icosahedronGeometry: {
    radius: 1,
    detail: 0
  },
  latheGeometry: {
    segments: 32,
    phiStart: 0,
    phiLength: Math.PI * 2
  },
  octahedronGeometry: {
    radius: 1,
    detail: 0
  },
  planeGeometry: {
    width: 1,
    height: 1,
    widthSegments: 1,
    heightSegments: 1
  },
  ringGeometry: {
    innerRadius: 0.5,
    outerRadius: 1,
    thetaSegments: 32,
    phiSegments: 1,
    thetaStart: 0,
    thetaLength: Math.PI * 2
  },
  tetrahedronGeometry: {
    radius: 1,
    detail: 0
  },
  torusGeometry: {
    radius: 1,
    tube: 0.4,
    radialSegments: 8,
    tubularSegments: 24,
    arc: Math.PI * 2
  },
  torusKnotGeometry: {
    radius: 1,
    tube: 0.4,
    tubularSegments: 64,
    radialSegments: 8,
    p: 2,
    q: 3
  },
  tubeGeometry: {
    radius: 1,
    tubeRadius: 0.2,
    radialSegments: 8,
    tubularSegments: 64,
    closed: false
  },
  meshNormalMaterial: {
    wireframe: false,
    transparent: false,
    opacity: 1,
    side: 'front'
  },
  meshBasicMaterial: {
    color: '#ffffff',
    wireframe: false,
    transparent: false,
    opacity: 1,
    visible: true,
    side: 'front'
  },
  meshPhongMaterial: {
    color: '#ffffff',
    emissive: '#000000',
    specular: '#111111',
    shininess: 30,
    wireframe: false,
    transparent: false,
    opacity: 1,
    visible: true,
    side: 'front',
    flatShading: false
  },
  meshStandardMaterial: {
    color: '#ffffff',
    roughness: 0.5,
    metalness: 0.5,
    wireframe: false,
    transparent: false,
    opacity: 1,
    visible: true,
    side: 'front'
  },
  mesh: {
    name: 'Mesh',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  },
  group: {
    name: 'Group',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  },
  subtract: {},
  intersect: {},
  union: {},
  loop: {
    iterations: 1,
    spacing: 1,
    direction: 'x',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  },
  bulkEdit: {
    value: 0,
    connectedInputs: []
  }
};

const defaultSceneNode: Node = {
  id: 'scene',
  type: 'scene',
  position: { x: 900, y: 200 },
  data: {
    backgroundColor: '#f0f0f0',
    showAxesHelper: false,
    showGridHelper: false
  }
};

const initialNodes: Node[] = [
  defaultSceneNode, // Scene node w prawej części
  {
    id: 'boxGeometry_1',
    type: 'boxGeometry',
    position: { x: 100, y: 200 }, // Przesunięty w lewo
    data: defaultNodeData.boxGeometry
  },
  {
    id: 'meshNormalMaterial_1',
    type: 'meshNormalMaterial',
    position: { x: 100, y: 600 }, // Przesunięty w dół
    data: defaultNodeData.meshNormalMaterial
  },
  {
    id: 'mesh_1',
    type: 'mesh',
    position: { x: 500, y: 400 }, // Przesunięty na środek
    data: {
      ...defaultNodeData.mesh,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-3', source: 'boxGeometry_1', target: 'mesh_1', targetHandle: 'geometry' },
  { id: 'e2-3', source: 'meshNormalMaterial_1', target: 'mesh_1', targetHandle: 'material' },
  { id: 'e3-4', source: 'mesh_1', target: 'scene' }
];

const FlowDiagramInner = () => {
  const { updateNodes, updateEdges, updateSceneState } = useScene();
  const { currentGraph, saveGraph, loadGraph, deleteGraph, getGraphList, isLoading, error } = useGraphManager();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [graphName, setGraphName] = useState('');
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalGraph, setOriginalGraph] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedGraphToImport, setSelectedGraphToImport] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [importSearchFilter, setImportSearchFilter] = useState('');
  const [exportFormat, setExportFormat] = useState('gltf');
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Load domyślny graf przy starcie
  useEffect(() => {
    const defaultGraph = loadGraph('default');
    if (defaultGraph) {
      setNodes(defaultGraph.nodes);
      setEdges(defaultGraph.edges);
      setOriginalGraph(defaultGraph);
    }
  }, []);

  // Sprawdź czy są niezapisane zmiany
  useEffect(() => {
    if (!originalGraph) return;

    const nodesChanged = JSON.stringify(nodes) !== JSON.stringify(originalGraph.nodes);
    const edgesChanged = JSON.stringify(edges) !== JSON.stringify(originalGraph.edges);
    
    setHasUnsavedChanges(nodesChanged || edgesChanged);
  }, [nodes, edges, originalGraph]);

  // Ustaw nazwę grafu gdy modal jest otwierany
  useEffect(() => {
    if (isGraphModalOpen && currentGraph !== 'default') {
      setGraphName(currentGraph);
    } else {
      setGraphName('');
    }
  }, [isGraphModalOpen, currentGraph]);

  const handleSaveGraph = async (overwrite = false) => {
    if (graphName.trim()) {
      if (!overwrite && getGraphList().includes(graphName.trim())) {
        setShowOverwriteConfirm(true);
        return;
      }
      
      const success = await saveGraph(graphName.trim(), nodes, edges, overwrite);
      if (success) {
        setGraphName('');
        setShowOverwriteConfirm(false);
        setIsGraphModalOpen(false);
        setOriginalGraph({ nodes, edges });
      }
    }
  };

  const handleLoadGraph = (name: string) => {
    const graph = loadGraph(name);
    if (graph) {
      setNodes(graph.nodes);
      setEdges(graph.edges);
      setOriginalGraph(graph);
      setIsGraphModalOpen(false);
      setShowOverwriteConfirm(false);
    }
  };

  const { project, getViewport } = useReactFlow();

  // Zapisz stan do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem('flowNodes', JSON.stringify(nodes));
    localStorage.setItem('flowEdges', JSON.stringify(edges));
  }, [nodes, edges]);

  // Aktualizuj kontekst przy każdej zmianie nodes lub edges
  useEffect(() => {
    updateNodes(nodes);
    updateEdges(edges);
  }, [nodes, edges, updateNodes, updateEdges]);

  const handleNodeUpdate = useCallback((id: string, newData: any) => {
    setNodes(nds => nds.map(node => {
      if (node.id === id) {
        // Dla zagnieżdżonych właściwości (np. position.x)
        const updatedData = { ...node.data };
        Object.entries(newData).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            updatedData[key] = { ...updatedData[key], ...value };
          } else {
            updatedData[key] = value;
          }
        });
        
        return {
          ...node,
          data: updatedData
        };
      }
      return node;
    }));
  }, []);

  const handleNodeIdChange = useCallback((oldId: string, newId: string) => {
    // Aktualizuj node
    setNodes(nds => nds.map(node => 
      node.id === oldId ? { ...node, id: newId } : node
    ));

    // Aktualizuj krawędzie
    setEdges(eds => eds.map(edge => ({
      ...edge,
      source: edge.source === oldId ? newId : edge.source,
      target: edge.target === oldId ? newId : edge.target
    })));
  }, []);

  const onConnect = useCallback((params: Connection) => {
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);

    if (sourceNode && targetNode) {
      // Najpierw usuń istniejące połączenia dla danego handleType
      if (params.targetHandle === 'geometry' && sourceNode.type.includes('Geometry')) {
        // Usuń istniejące połączenie geometry
        setEdges(eds => eds.filter(edge => 
          !(edge.target === params.target && edge.targetHandle === 'geometry')
        ));
        
        // Aktualizuj target node
        const targetData = { ...targetNode.data };
        targetData.geometry = sourceNode.data;
        handleNodeUpdate(targetNode.id, targetData);
      } else if (params.targetHandle === 'material' && sourceNode.type.includes('Material')) {
        // Usuń istniejące połączenie material
        setEdges(eds => eds.filter(edge => 
          !(edge.target === params.target && edge.targetHandle === 'material')
        ));
        
        // Aktualizuj target node
        const targetData = { ...targetNode.data };
        targetData.material = sourceNode.data;
        handleNodeUpdate(targetNode.id, targetData);
      }

      // Dodaj nowe połączenie
      setEdges((eds) => addEdge(params, eds));
    }
  }, [nodes, handleNodeUpdate]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleAddNode = useCallback((type: string) => {
    const { x: viewX, y: viewY } = getViewport();
    
    // Pobierz środek widoku
    const centerX = window.innerWidth / 4;
    const centerY = window.innerHeight / 2;
    
    // Przekonwertuj pozycję ekranu na pozycję flow
    const position = project({ x: centerX, y: centerY });

    const newNode: Node = {
      id: `${type}_${Date.now()}`,
      type,
      position: position,
      data: defaultNodeData[type as keyof typeof defaultNodeData] || {}
    };

    setNodes(prev => [...prev, newNode]);
  }, [project]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes(nds => nds.filter(node => node.id !== nodeId));
    setEdges(eds => eds.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setEdges(eds => eds.filter(e => e.id !== edge.id));
  }, []);

  const handleExportGraph = useCallback(() => {
    const graphData = {
      nodes: nodes.map(node => ({ id: node.id, type: node.type, position: node.position, data: node.data })),
      edges: edges.map(edge => ({ id: edge.id, source: edge.source, target: edge.target, targetHandle: edge.targetHandle }))
    };

    const json = JSON.stringify(graphData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'graph.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleExportScene = useCallback(() => {
    const scene = (window as any).__threeScene;
    if (!scene) {
      console.error('Three.js scene is not available');
      return;
    }

    // Create a clone of the scene for export
    const exportScene = scene.clone();
    
    // Replace MeshNormalMaterial with MeshStandardMaterial
    exportScene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.material instanceof THREE.MeshNormalMaterial) {
          object.material = new THREE.MeshStandardMaterial({
            color: 0x808080,  // szary kolor
            roughness: 0.5,
            metalness: 0.5
          });
        }
      }
    });

    let exporter;
    let extension;
    
    switch (exportFormat) {
      case 'gltf':
        exporter = new GLTFExporter();
        extension = 'gltf';
        break;
      case 'obj':
        exporter = new OBJExporter();
        extension = 'obj';
        break;
      case 'stl':
        exporter = new STLExporter();
        extension = 'stl';
        break;
      default:
        return;
    }

    if (exportFormat === 'gltf') {
      exporter.parse(
        exportScene,
        (result) => {
          const output = JSON.stringify(result);
          const blob = new Blob([output], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `scene.${extension}`;
          link.click();
          URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('An error occurred while exporting:', error);
        }
      );
    } else {
      const result = exporter.parse(exportScene);
      const blob = new Blob([result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scene.${extension}`;
      link.click();
      URL.revokeObjectURL(url);
    }

    // Clean up
    exportScene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.material) {
          object.material.dispose();
        }
        if (object.geometry) {
          object.geometry.dispose();
        }
      }
    });
  }, [exportFormat]);

  const handleResetScene = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  const [selectedInputs, setSelectedInputs] = useState<{
    nodeId: string;
    field: string;
    type: string;
  }[]>([]);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkEditValue, setBulkEditValue] = useState('');

  const applyBulkEdit = () => {
    const value = parseFloat(bulkEditValue);
    if (!isNaN(value)) {
      selectedInputs.forEach(input => {
        const [category, field] = input.field.split('.');
        if (field) {
          handleNodeUpdate(input.nodeId, {
            [category]: {
              [field]: value
            }
          });
        } else {
          handleNodeUpdate(input.nodeId, {
            [category]: value
          });
        }
      });
    }
    setBulkEditMode(false);
    setBulkEditValue('');
  };

  const cancelBulkEdit = () => {
    setBulkEditMode(false);
    setBulkEditValue('');
  };

  const createBulkEditNode = () => {
    const { x: viewX, y: viewY } = getViewport();
    
    // Pobierz środek widoku
    const centerX = window.innerWidth / 4;
    const centerY = window.innerHeight / 2;
    
    // Przekonwertuj pozycję ekranu na pozycję flow
    const position = project({ x: centerX, y: centerY });

    const newNode: Node = {
      id: `bulkEdit_${Date.now()}`,
      type: 'bulkEdit',
      position: position,
      data: {
        onUpdate: handleNodeUpdate,
        onIdChange: handleNodeIdChange,
        connectedInputs: selectedInputs
      }
    };

    setNodes(nds => [...nds, newNode]);
    setSelectedInputs([]);
  };

  // Funkcja do dodawania/usuwania inputu z selekcji
  const toggleInputSelection = (nodeId: string, field: string, type: string) => {
    setSelectedInputs(prev => {
      const exists = prev.some(item => item.nodeId === nodeId && item.field === field);
      if (exists) {
        return prev.filter(item => !(item.nodeId === nodeId && item.field === field));
      } else {
        return [...prev, { nodeId, field, type }];
      }
    });
  };

  const handleImportGraph = () => {
    if (selectedGraphToImport) {
      const graphToImport = loadGraph(selectedGraphToImport);
      if (graphToImport) {
        // Calculate boundaries of existing nodes
        const existingBounds = nodes.reduce((bounds, node) => {
          bounds.minX = Math.min(bounds.minX, node.position.x);
          bounds.maxX = Math.max(bounds.maxX, node.position.x);
          bounds.minY = Math.min(bounds.minY, node.position.y);
          bounds.maxY = Math.max(bounds.maxY, node.position.y);
          return bounds;
        }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });

        // If there are no existing nodes, use default position
        if (existingBounds.minX === Infinity) {
          existingBounds.minX = 0;
          existingBounds.maxX = 0;
          existingBounds.minY = 0;
          existingBounds.maxY = 0;
        }

        // Calculate boundaries of imported nodes (excluding scene nodes)
        const NODE_WIDTH = 250; // Approximate width of nodes
        const importBounds = graphToImport.nodes
          .filter(node => node.type !== 'scene')
          .reduce((bounds, node) => {
            bounds.minX = Math.min(bounds.minX, node.position.x);
            bounds.maxX = Math.max(bounds.maxX, node.position.x + NODE_WIDTH); // Add node width
            bounds.minY = Math.min(bounds.minY, node.position.y);
            bounds.maxY = Math.max(bounds.maxY, node.position.y + 100); // Add approximate node height
            return bounds;
          }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });

        // Calculate offset to place imported nodes next to existing ones
        // Add padding between existing and imported nodes
        const PADDING = 300;
        const viewport = getViewport();
        
        // Determine if there's more space on the right or bottom
        const rightSpace = viewport.width - (existingBounds.maxX - existingBounds.minX);
        const bottomSpace = viewport.height - (existingBounds.maxY - existingBounds.minY);
        
        let offsetX = 0;
        let offsetY = 0;
        
        if (rightSpace > bottomSpace) {
          // Place nodes to the right
          offsetX = existingBounds.maxX + PADDING - importBounds.minX;
          offsetY = existingBounds.minY - importBounds.minY;
        } else {
          // Place nodes below
          offsetX = existingBounds.minX - importBounds.minX;
          offsetY = existingBounds.maxY + PADDING - importBounds.minY;
        }

        // Filter out scene nodes and get their IDs
        const sceneNodeIds = new Set(
          graphToImport.nodes
            .filter(node => node.type === 'scene')
            .map(node => node.id)
        );

        // Generate new IDs for imported nodes and edges to avoid conflicts
        const oldToNewIds = new Map<string, string>();
        const newNodes = graphToImport.nodes
          .filter(node => node.type !== 'scene') // Exclude scene nodes
          .map(node => {
            const newId = `${node.id}_imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            oldToNewIds.set(node.id, newId);
            return {
              ...node,
              id: newId,
              position: {
                x: node.position.x + offsetX,
                y: node.position.y + offsetY
              }
            };
          });

        // Create a border node to visually group imported nodes
        const BORDER_PADDING = 50;
        const EXTRA_RIGHT_PADDING = 100; // Additional padding for the right side
        const borderNode = {
          id: `import_border_${Date.now()}`,
          type: 'default', // Using default type as it's just a visual element
          position: {
            x: importBounds.minX + offsetX - BORDER_PADDING,
            y: importBounds.minY + offsetY - BORDER_PADDING
          },
          style: {
            width: importBounds.maxX - importBounds.minX + (BORDER_PADDING * 2) + EXTRA_RIGHT_PADDING,
            height: importBounds.maxY - importBounds.minY + (BORDER_PADDING * 2),
            backgroundColor: 'transparent',
            border: '2px dashed #666',
            borderRadius: '8px',
            padding: '10px',
            pointerEvents: 'none' as const, // Make the border non-interactive
            zIndex: -1, // Place behind other nodes
            color: '#fff',
            fontSize: '30px'
          },
          data: {
            label: `Imported from: ${selectedGraphToImport}`,
            importedAt: new Date().toLocaleString()
          }
        };

        // Update edge references to use new node IDs, excluding edges connected to scene nodes
        const newEdges = graphToImport.edges
          .filter(edge => !sceneNodeIds.has(edge.source) && !sceneNodeIds.has(edge.target)) // Exclude edges connected to scene nodes
          .map(edge => ({
            ...edge,
            id: `${edge.id}_imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            source: oldToNewIds.get(edge.source) || edge.source,
            target: oldToNewIds.get(edge.target) || edge.target
          }));

        // Add imported nodes, border and edges to current graph
        setNodes(currentNodes => [...currentNodes, borderNode, ...newNodes]);
        setEdges(currentEdges => [...currentEdges, ...newEdges]);
        setIsImportModalOpen(false);
        setSelectedGraphToImport('');
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Dialog eksportu */}
      {showExportDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1e293b',
            borderRadius: '12px',
            padding: '24px',
            width: '400px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ 
                margin: 0,
                color: '#e2e8f0',
                fontSize: '1.25rem',
                fontWeight: 600
              }}>
                Export Options
              </h3>
              <button
                onClick={() => setShowExportDialog(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  ':hover': {
                    color: '#e2e8f0'
                  }
                }}
              >
                ✕
              </button>
            </div>

            {/* Sekcja eksportu grafu */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ 
                margin: '0 0 12px',
                color: '#e2e8f0',
                fontSize: '1rem',
                fontWeight: 500
              }}>
                Graph Export
              </h4>
              <button
                onClick={handleExportGraph}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Export Graph as JSON
              </button>
            </div>

            {/* Sekcja eksportu sceny Three.js */}
            <div>
              <h4 style={{ 
                margin: '0 0 12px',
                color: '#e2e8f0',
                fontSize: '1rem',
                fontWeight: 500
              }}>
                3D Scene Export
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <select 
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  style={{
                    background: '#334155',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #475569',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="gltf">GLTF</option>
                  <option value="obj">OBJ</option>
                  <option value="stl">STL</option>
                </select>
                <button
                  onClick={handleExportScene}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  Export 3D Scene
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute',
        left: '15px',
        top: '60px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Nazwa aktualnego grafu */}
        <div style={{
          padding: '8px',
          color: '#e2e8f0',
          fontSize: '14px',
          fontWeight: 500
        }}>
          Graf: {currentGraph || 'default'}
        </div>
      </div>

      {isGraphModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1e293b',
            padding: '24px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ 
                margin: '0',
                color: '#e2e8f0',
                fontSize: '1.25rem',
                fontWeight: 600
              }}>
                Manage Graphs
              </h3>
              <button
                onClick={() => {
                  setIsGraphModalOpen(false);
                  setShowOverwriteConfirm(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '8px',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s',
                  ':hover': {
                    color: '#e2e8f0'
                  }
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <input
                type="text"
                value={graphName}
                onChange={(e) => setGraphName(e.target.value)}
                placeholder="The name of the graph..."
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#334155',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              {showOverwriteConfirm ? (
                <div style={{
                  padding: '12px',
                  background: '#854d0e',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <p style={{ 
                    margin: '0 0 12px',
                    color: '#fef3c7',
                    fontSize: '0.875rem'
                  }}>
                    A graph with this name already exists. Do you want to overwrite it?
                  </p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleSaveGraph(true)}
                      disabled={isLoading}
                      style={{
                        padding: '6px 12px',
                        background: !isLoading ? '#b45309' : '#475569',
                        color: '#fef3c7',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: !isLoading ? 'pointer' : 'not-allowed',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      Overwrite
                    </button>
                    <button
                      onClick={() => setShowOverwriteConfirm(false)}
                      disabled={isLoading}
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        color: '#fef3c7',
                        border: '1px solid #fef3c7',
                        borderRadius: '6px',
                        cursor: !isLoading ? 'pointer' : 'not-allowed',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleSaveGraph(false)}
                  disabled={!graphName.trim() || isLoading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: graphName.trim() && !isLoading ? '#3b82f6' : '#475569',
                    color: '#e2e8f0',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: graphName.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  {isLoading && <span style={{ width: '16px', height: '16px' }} className="spinner" />}
                  Save as a new graph
                </button>
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ 
                margin: '0 0 12px',
                color: '#e2e8f0',
                fontSize: '1rem',
                fontWeight: 500
              }}>
                Saved Graphs:
              </h4>
              <div style={{
                marginBottom: '12px'
              }}>
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Look for a graph..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#334155',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    color: '#e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ 
                border: '1px solid #475569',
                borderRadius: '8px',
                overflow: 'auto',
                maxHeight: '300px'
              }}>
                {getGraphList()
                  .filter(name => name.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((name, index, filteredList) => (
                  <div
                    key={name}
                    style={{
                      padding: '12px',
                      borderBottom: index < filteredList.length - 1 ? '1px solid #475569' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#334155',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <span style={{ 
                      color: '#e2e8f0',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}>
                      {name}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleLoadGraph(name)}
                        disabled={isLoading}
                        style={{
                          padding: '6px 12px',
                          background: !isLoading ? '#3b82f6' : '#475569',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: !isLoading ? 'pointer' : 'not-allowed',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        Load
                      </button>
                      {name !== 'default' && (
                        <button
                          onClick={() => deleteGraph(name)}
                          disabled={isLoading}
                          style={{
                            padding: '6px 12px',
                            background: !isLoading ? '#ef4444' : '#475569',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: !isLoading ? 'pointer' : 'not-allowed',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isImportModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1e293b',
            padding: '24px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ 
                margin: '0',
                color: '#e2e8f0',
                fontSize: '1.25rem',
                fontWeight: 600
              }}>
                Import Graph
              </h3>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setSelectedGraphToImport('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '8px',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s',
                  ':hover': {
                    color: '#e2e8f0'
                  }
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ 
                margin: '0 0 12px',
                color: '#e2e8f0',
                fontSize: '1rem',
                fontWeight: 500
              }}>
                Select a graph to import:
              </h4>
              <div style={{
                marginBottom: '12px'
              }}>
                <input
                  type="text"
                  value={importSearchFilter}
                  onChange={(e) => setImportSearchFilter(e.target.value)}
                  placeholder="Search graph..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#334155',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    color: '#e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ 
                border: '1px solid #475569',
                borderRadius: '8px',
                overflow: 'auto',
                maxHeight: '300px'
              }}>
                {getGraphList()
                  .filter(name => name !== currentGraph)
                  .filter(name => name.toLowerCase().includes(importSearchFilter.toLowerCase()))
                  .map((name, index, filteredList) => (
                    <div
                      key={name}
                      onClick={() => setSelectedGraphToImport(name)}
                      style={{
                        padding: '12px',
                        borderBottom: index < filteredList.length - 1 ? '1px solid #475569' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: selectedGraphToImport === name ? '#475569' : '#334155',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <span style={{ 
                        color: '#e2e8f0',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}>
                        {name}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setSelectedGraphToImport('');
                }}
                style={{
                  padding: '10px 20px',
                  background: '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#e2e8f0',
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleImportGraph}
                disabled={!selectedGraphToImport}
                style={{
                  padding: '10px 20px',
                  background: selectedGraphToImport ? '#3b82f6' : '#475569',
                  color: selectedGraphToImport ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: selectedGraphToImport ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 4,
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={() => setIsGraphModalOpen(true)}
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>💾</span> Save/Load
        </button>
        <button
          onClick={() => setIsImportModalOpen(true)}
          style={{
            padding: '8px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>📦</span> Import
        </button>
        <button
          onClick={() => setShowExportDialog(true)}
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>📤</span> Export
        </button>
        <button
          onClick={handleResetScene}
          style={{
            padding: '8px 16px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🔄</span> Reset
        </button>
      </div>

      {/* Panel kontrolny dla zbiorowej edycji */}
      {selectedInputs.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1e293b',
          padding: '12px',
          borderRadius: '8px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          zIndex: 1000,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }}>
          <span style={{ color: 'white', fontSize: '14px' }}>
            Wybrano {selectedInputs.length} {selectedInputs.length === 1 ? 'input' : 'inputów'}
          </span>
          {!bulkEditMode ? (
            <button
              onClick={() => setBulkEditMode(true)}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Zmień wartości
            </button>
          ) : (
            <>
              <input
                type="number"
                value={bulkEditValue}
                onChange={(e) => setBulkEditValue(e.target.value)}
                style={{
                  width: '80px',
                  padding: '6px',
                  borderRadius: '4px',
                  border: '1px solid #4b5563',
                  background: '#374151',
                  color: 'white'
                }}
                placeholder="Wartość"
              />
              <button
                onClick={applyBulkEdit}
                style={{
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Zastosuj
              </button>
              <button
                onClick={cancelBulkEdit}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </>
          )}
          <button
            onClick={createBulkEditNode}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Stwórz node kontrolny
          </button>
        </div>
      )}

      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onUpdate: handleNodeUpdate,
            onDelete: node.type !== 'scene' ? handleDeleteNode : undefined,
            onIdChange: handleNodeIdChange,
            toggleInputSelection: toggleInputSelection,
            selectedInputs: selectedInputs
          }
        }))}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        minZoom={0.1}
        maxZoom={4}
        fitView
      >
        <Background />
        <Controls />
        <NodeSelector onSelect={handleAddNode} />
      </ReactFlow>

      {currentGraph !== 'default' && hasUnsavedChanges && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '12px 16px',
          background: '#854d0e',
          border: '1px solid #a16207',
          borderRadius: '8px',
          color: '#fef3c7',
          fontSize: '0.875rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          Unsaved changes
        </div>
      )}
    </div>
  );
};

export default function FlowDiagram() {
  return (
    <ReactFlowProvider>
      <FlowDiagramInner />
    </ReactFlowProvider>
  );
}
