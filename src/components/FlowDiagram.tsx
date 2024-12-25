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
import NodeSelector from './NodeSelector';
import { useScene } from '../context/SceneContext';

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
  subtract: SubtractNode
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
  subtract: {}
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
    data: defaultNodeData.mesh
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
  const [nodes, setNodes] = useState<Node[]>(() => {
    // Próba pobrania zapisanego stanu z localStorage
    const savedNodes = localStorage.getItem('flowNodes');
    if (savedNodes) {
      try {
        const parsedNodes = JSON.parse(savedNodes);
        // Jeśli jest tylko node sceny, dodaj domyślne node'y
        if (parsedNodes.length === 1 && parsedNodes[0].type === 'scene') {
          return initialNodes;
        }
        return parsedNodes;
      } catch (e) {
        console.error('Error parsing saved nodes:', e);
        return initialNodes;
      }
    }
    return initialNodes;
  });

  const [edges, setEdges] = useState<Edge[]>(() => {
    // Próba pobrania zapisanego stanu z localStorage
    const savedEdges = localStorage.getItem('flowEdges');
    if (savedEdges) {
      try {
        const parsedEdges = JSON.parse(savedEdges);
        // Jeśli nie ma krawędzi, dodaj domyślne krawędzie
        if (parsedEdges.length === 0) {
          return initialEdges;
        }
        return parsedEdges;
      } catch (e) {
        console.error('Error parsing saved edges:', e);
        return initialEdges;
      }
    }
    return initialEdges;
  });

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

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((params: Connection) => {
    // Sprawdź typ node'a źródłowego i docelowego
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);

    // Sprawdź czy połączenie jest dozwolone
    const isValidConnection = () => {
      // Scene może przyjmować połączenia od Mesh, Group i Subtract
      if (targetNode?.type === 'scene') {
        return sourceNode?.type === 'mesh' || 
               sourceNode?.type === 'group' || 
               sourceNode?.type === 'subtract';
      }
      
      // Mesh może przyjmować połączenia od geometry i material
      if (targetNode?.type === 'mesh') {
        const isGeometry = sourceNode?.type?.toLowerCase().includes('geometry');
        const isMaterial = sourceNode?.type?.toLowerCase().includes('material');
        return isGeometry || isMaterial;
      }

      // Group może przyjmować połączenia od Mesh, Group i Subtract
      if (targetNode?.type === 'group') {
        return sourceNode?.type === 'mesh' || 
               sourceNode?.type === 'group' || 
               sourceNode?.type === 'subtract';
      }

      // Subtract może przyjmować połączenia tylko od Mesh
      if (targetNode?.type === 'subtract') {
        return sourceNode?.type === 'mesh';
      }

      return false;
    };

    // Sprawdź czy nie tworzymy cyklu w grafie
    const wouldCreateCycle = (sourceId: string, targetId: string, visited = new Set<string>()): boolean => {
      if (sourceId === targetId) return true;
      if (visited.has(targetId)) return false;
      
      visited.add(targetId);
      
      const outgoingEdges = edges.filter(edge => edge.source === targetId);
      return outgoingEdges.some(edge => wouldCreateCycle(sourceId, edge.target, visited));
    };

    if (isValidConnection() && params.source && params.target) {
      // Sprawdź czy nie tworzymy cyklu
      if (sourceNode?.type === 'group' && targetNode?.type === 'group') {
        if (wouldCreateCycle(params.source, params.target)) {
          console.warn('Cannot create cyclic group dependencies');
          return;
        }
      }

      let updatedEdges = [...edges];
      
      // Usuń stare połączenie tylko dla Mesh (nie dla Scene i Group)
      if (targetNode?.type === 'mesh') {
        updatedEdges = edges.filter(edge => 
          !(edge.target === params.target && edge.targetHandle === params.targetHandle)
        );
      }
      
      // Dodaj nowe połączenie
      const newEdges = addEdge(params, updatedEdges);
      setEdges(newEdges);
      
      // Aktualizuj kontekst sceny
      updateSceneState(nodes, newEdges);

      // Dodaj node do GroupNode
      if (targetNode?.type === 'group') {
        const targetGroupNode = nodes.find(node => node.id === params.target);
        if (targetGroupNode) {
          const updatedNodes = nodes.map(node => {
            if (node.id === targetGroupNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  nodes: [...(node.data.nodes || []), params.source]
                }
              };
            }
            return node;
          });
          setNodes(updatedNodes);
        }
      }
    }
  }, [edges, nodes, updateSceneState]);

  const handleNodeUpdate = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, []);

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

    setNodes((nds) => [...nds, newNode]);
  }, [project]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, []);

  return (
    <div style={flowStyles}>
      <style>{customStyles}</style>
      <NodeSelector onSelect={handleAddNode} />
      <button
        onClick={() => {
          localStorage.removeItem('flowNodes');
          localStorage.removeItem('flowEdges');
          setNodes(initialNodes);
          setEdges(initialEdges);
        }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '8px 16px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '14px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#dc2626';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ef4444';
        }}
      >
        Reset Graph
      </button>
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onUpdate: handleNodeUpdate,
            onDelete: node.type !== 'scene' ? handleDeleteNode : undefined
          }
        }))}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        fitView
        style={flowStyles}
      >
        <Background />
        <Controls />
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
