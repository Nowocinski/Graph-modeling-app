'use client';

import { useState } from 'react';

interface NodeSelectorProps {
  onSelect: (nodeType: string) => void;
}

const selectorStyles = {
  position: 'absolute' as const,
  top: '20px',
  left: '20px',
  zIndex: 1000,
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  padding: '10px',
};

const buttonStyles = {
  background: '#f0f0f0',
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '8px 12px',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left' as const,
  marginBottom: '5px',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const dropdownStyles = {
  position: 'absolute' as const,
  top: '100%',
  left: '0',
  background: '#fff',
  borderRadius: '4px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  width: '200px',
  padding: '5px',
  marginTop: '5px'
};

const categoryStyles = {
  padding: '8px',
  fontWeight: 'bold' as const,
  borderBottom: '1px solid #eee',
  color: '#666'
};

const nodeButtonStyles = {
  background: 'none',
  border: 'none',
  width: '100%',
  textAlign: 'left' as const,
  padding: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  ':hover': {
    background: '#f5f5f5'
  }
};

const nodes = {
  Geometry: [
    { type: 'boxGeometry', label: 'Box Geometry' },
    { type: 'sphereGeometry', label: 'Sphere Geometry' },
    { type: 'cylinderGeometry', label: 'Cylinder Geometry' },
  ],
  Material: [
    { type: 'meshNormalMaterial', label: 'Normal Material' },
    { type: 'meshBasicMaterial', label: 'Basic Material' },
    { type: 'meshPhongMaterial', label: 'Phong Material' },
  ],
  Objects: [
    { type: 'mesh', label: 'Mesh' },
    { type: 'scene', label: 'Scene' },
  ]
};

export default function NodeSelector({ onSelect }: NodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (nodeType: string) => {
    onSelect(nodeType);
    setIsOpen(false);
  };

  return (
    <div style={selectorStyles}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={buttonStyles}
      >
        Add Node
        <span style={{ marginLeft: '10px' }}>▼</span>
      </button>

      {isOpen && (
        <div style={dropdownStyles}>
          {Object.entries(nodes).map(([category, items]) => (
            <div key={category}>
              <div style={categoryStyles}>{category}</div>
              {items.map((node) => (
                <button
                  key={node.type}
                  onClick={() => handleSelect(node.type)}
                  style={nodeButtonStyles}
                >
                  {node.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
