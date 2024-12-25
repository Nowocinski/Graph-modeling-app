'use client';

import dynamic from 'next/dynamic';

const FlowDiagram = dynamic(
  () => import('./FlowDiagram'),
  { ssr: false }
);

export default function DiagramWrapper() {
  return (
    <div style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
      <FlowDiagram />
    </div>
  );
}
