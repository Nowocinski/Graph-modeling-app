'use client';

import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false });

const wrapperStyles = {
  width: '100%',
  height: '100%',
  position: 'relative' as const,
  overflow: 'hidden'
};

export default function ThreeWrapper() {
  return (
    <div style={wrapperStyles}>
      <ThreeScene />
    </div>
  );
}
