'use client';

import dynamic from 'next/dynamic';

const FlowDiagram = dynamic(
  () => import('./FlowDiagram'),
  { ssr: false }
);

const wrapperStyle = {
  width: '100%',
  height: '100vh',
  position: 'relative' as const
};

export default function DiagramWrapper() {
  return (
    <div style={wrapperStyle}>
      <FlowDiagram />
    </div>
  );
}
