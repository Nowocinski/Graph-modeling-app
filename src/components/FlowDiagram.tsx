'use client';

import { useState, useCallback } from 'react';
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
import MeshNormalMaterialNode from './nodes/MeshNormalMaterialNode';
import MeshNode from './nodes/MeshNode';

// Definicja typów node'ów
const nodeTypes: NodeTypes = {
  boxGeometry: BoxGeometryNode,
  meshNormalMaterial: MeshNormalMaterialNode,
  mesh: MeshNode
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'boxGeometry',
    position: { x: 100, y: 100 },
    data: { 
      width: 2,
      height: 2,
      depth: 2
    }
  },
  {
    id: '2',
    type: 'meshNormalMaterial',
    position: { x: 100, y: 250 },
    data: {
      wireframe: false,
      transparent: false,
      opacity: 1
    }
  },
  {
    id: '3',
    type: 'mesh',
    position: { x: 400, y: 175 },
    data: {
      name: 'Mesh',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-3', source: '1', target: '3', targetHandle: 'geometry' },
  { id: 'e2-3', source: '2', target: '3', targetHandle: 'material' }
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
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

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

  return (
    <div style={flowStyles}>
      <style>{customStyles}</style>
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onUpdate: handleNodeUpdate
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
