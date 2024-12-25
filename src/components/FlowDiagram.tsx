'use client';

import ReactFlow, { 
  Node, 
  Edge, 
  Background,
  Controls
} from 'reactflow';
import 'reactflow/dist/style.css';

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
  return (
    <div style={flowStyles}>
      <style>{customStyles}</style>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
        style={flowStyles}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
