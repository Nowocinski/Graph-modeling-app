'use client';

import { useState, useCallback } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  Background,
  Controls,
  NodeTypes,
  applyNodeChanges,
  NodeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import BoxGeometryNode from './nodes/BoxGeometryNode';
import MeshNormalMaterialNode from './nodes/MeshNormalMaterialNode';

// Definicja typów node'ów
const nodeTypes: NodeTypes = {
  boxGeometry: BoxGeometryNode,
  meshNormalMaterial: MeshNormalMaterialNode,
  input: undefined,
  output: undefined
};

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: 'Node 1' },
    type: 'input'
  },
  {
    id: '2',
    position: { x: 300, y: 100 },
    data: { label: 'Node 2' }
  },
  {
    id: '3',
    position: { x: 500, y: 100 },
    data: { label: 'Node 3' },
    type: 'output'
  },
  {
    id: '4',
    type: 'boxGeometry',
    position: { x: 700, y: 100 },
    data: { 
      width: 2,
      height: 2,
      depth: 2
    }
  },
  {
    id: '5',
    type: 'meshNormalMaterial',
    position: { x: 900, y: 100 },
    data: {
      wireframe: false,
      transparent: false,
      opacity: 1
    }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' }
];

const flowStyles = {
  width: '100%',
  height: '100vh',
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
        fitView
        style={flowStyles}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
