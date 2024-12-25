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
  Edge as FlowEdge
} from 'reactflow';
import 'reactflow/dist/style.css';
import BoxGeometryNode from './nodes/BoxGeometryNode';
import SphereGeometryNode from './nodes/SphereGeometryNode';
import MeshNormalMaterialNode from './nodes/MeshNormalMaterialNode';
import MeshNode from './nodes/MeshNode';
import SceneNode from './nodes/SceneNode';
import NodeSelector from './NodeSelector';
import { useScene } from '../context/SceneContext';

// Definicja typów node'ów
const nodeTypes: NodeTypes = {
  boxGeometry: BoxGeometryNode,
  sphereGeometry: SphereGeometryNode,
  meshNormalMaterial: MeshNormalMaterialNode,
  mesh: MeshNode,
  scene: SceneNode
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
  meshNormalMaterial: {
    wireframe: false,
    transparent: false,
    opacity: 1
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
  }
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'boxGeometry',
    position: { x: 100, y: 100 },
    data: defaultNodeData.boxGeometry
  },
  {
    id: '2',
    type: 'meshNormalMaterial',
    position: { x: 100, y: 250 },
    data: defaultNodeData.meshNormalMaterial
  },
  {
    id: '3',
    type: 'mesh',
    position: { x: 400, y: 175 },
    data: defaultNodeData.mesh
  },
  {
    id: '4',
    type: 'scene',
    position: { x: 700, y: 175 },
    data: defaultNodeData.scene
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-3', source: '1', target: '3', targetHandle: 'geometry' },
  { id: 'e2-3', source: '2', target: '3', targetHandle: 'material' },
  { id: 'e3-4', source: '3', target: '4' }
];

const flowStyles = {
  width: '100%',
  height: '100%'
};

// Style do ukrycia linku reactflow.dev
const customStyles = `
  .react-flow__attribution {
    display: none !important;
  }
`;

export default function FlowDiagram() {
  const { updateNodes, updateEdges } = useScene();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

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
    (changes: NodeChange[]) => setEdges((eds) => applyNodeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

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
    const newNode: Node = {
      id: `${type}_${Date.now()}`,
      type,
      position: { x: 100, y: 100 },
      data: defaultNodeData[type as keyof typeof defaultNodeData] || {}
    };

    setNodes((nds) => [...nds, newNode]);
  }, []);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  }, []);

  return (
    <div style={flowStyles}>
      <style>{customStyles}</style>
      <NodeSelector onSelect={handleAddNode} />
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
        fitView
        style={flowStyles}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
