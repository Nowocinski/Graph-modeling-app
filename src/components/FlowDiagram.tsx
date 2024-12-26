'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
  Edge as FlowEdge,
  applyEdgeChanges,
  EdgeChange,
  ReactFlowProvider,
  ReactFlowInstance,
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
  mesh: {
    name: 'Mesh',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  },
  scene: {
    backgroundColor: '#e0e0e0',
    ambientLightIntensity: 0.5,
    pointLightIntensity: 1.0,
    pointLightPosition: { x: 5, y: 5, z: 5 }
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
    ambientLightIntensity: 0.5,
    pointLightIntensity: 0.8,
    pointLightPosition: { x: 10, y: 10, z: 10 }
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

const flowStyles = {
  width: '100%',
  height: '100vh'
};

// Style do ukrycia linku reactflow.dev
const customStyles = `
  .react-flow__node {
    width: fit-content;
  }
`;

const FlowDiagramInner = () => {
  const { updateNodes, updateEdges, updateSceneState } = useScene();
  const { currentGraph, saveGraph, loadGraph, deleteGraph, getGraphList, isLoading, error } = useGraphManager();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [graphName, setGraphName] = useState('');
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

  // Wczytaj domyślny graf przy starcie
  useEffect(() => {
    const defaultGraph = loadGraph('default');
    if (defaultGraph) {
      setNodes(defaultGraph.nodes);
      setEdges(defaultGraph.edges);
    }
  }, []);

  const handleSaveGraph = () => {
    if (graphName.trim()) {
      saveGraph(graphName.trim(), nodes, edges);
      setGraphName('');
      setIsGraphModalOpen(false);
    }
  };

  const handleLoadGraph = (name: string) => {
    const graph = loadGraph(name);
    if (graph) {
      setNodes(graph.nodes);
      setEdges(graph.edges);
      setIsGraphModalOpen(false);
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
      // Aktualizuj target node z danymi ze source node
      const sourceData = sourceNode.data;
      const targetData = { ...targetNode.data };

      if (params.targetHandle === 'geometry' && sourceNode.type.includes('Geometry')) {
        targetData.geometry = sourceData;
      } else if (params.targetHandle === 'material' && sourceNode.type.includes('Material')) {
        targetData.material = sourceData;
      }

      handleNodeUpdate(targetNode.id, targetData);
    }

    setEdges((eds) => addEdge(params, eds));
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
    const { x: viewX, y: viewY, zoom } = getViewport();
    
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
      nodes: nodes.map(({ id, type, position, data }) => ({
        id,
        type,
        position,
        data
      })),
      edges
    };

    const dataStr = JSON.stringify(graphData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'flow-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges]);

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
    const newNode: Node = {
      id: `bulkEdit_${Date.now()}`,
      type: 'bulkEdit',
      position: { 
        x: -viewX + window.innerWidth/2 - 100,
        y: -viewY + window.innerHeight/2 - 100
      },
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

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
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
          <span>💾</span> Zapisz/Wczytaj
        </button>
        <button
          onClick={handleExportGraph}
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

      {isGraphModalOpen && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          zIndex: 1000,
          minWidth: '300px'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Zarządzaj Grafami</h3>
          
          {error && (
            <div style={{
              padding: '8px',
              marginBottom: '16px',
              background: '#fee2e2',
              border: '1px solid #ef4444',
              borderRadius: '4px',
              color: '#b91c1c'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={graphName}
              onChange={(e) => setGraphName(e.target.value)}
              placeholder="Nazwa nowego grafu"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                marginBottom: '8px'
              }}
            />
            <button
              onClick={handleSaveGraph}
              disabled={!graphName.trim() || isLoading}
              style={{
                width: '100%',
                padding: '8px',
                background: graphName.trim() && !isLoading ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: graphName.trim() && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isLoading && <span style={{ width: '16px', height: '16px' }} className="spinner" />}
              Zapisz jako nowy graf
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '8px' }}>Zapisane grafy:</h4>
            <div style={{ 
              maxHeight: '200px', 
              overflowY: 'auto',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}>
              {getGraphList().map(name => (
                <div
                  key={name}
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid #d1d5db',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{name}</span>
                  <div>
                    <button
                      onClick={() => handleLoadGraph(name)}
                      disabled={isLoading}
                      style={{
                        padding: '4px 8px',
                        background: !isLoading ? '#3b82f6' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        marginRight: '4px',
                        cursor: !isLoading ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Wczytaj
                    </button>
                    {name !== 'default' && (
                      <button
                        onClick={() => deleteGraph(name)}
                        disabled={isLoading}
                        style={{
                          padding: '4px 8px',
                          background: !isLoading ? '#ef4444' : '#9ca3af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: !isLoading ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Usuń
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsGraphModalOpen(false)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '8px',
              background: !isLoading ? '#6b7280' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !isLoading ? 'pointer' : 'not-allowed'
            }}
          >
            Zamknij
          </button>
        </div>
      )}

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
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
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
                Anuluj
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
        fitView
      >
        <Background />
        <Controls />
        <NodeSelector onSelect={handleAddNode} />
      </ReactFlow>
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
