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
  background: 'transparent',
  padding: '0',
  minWidth: '220px',
};

const buttonStyles = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 16px',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left' as const,
  marginBottom: '5px',
  fontSize: '14px',
  fontWeight: '500' as const,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'background-color 0.2s ease',
  ':hover': {
    background: '#1d4ed8'
  }
};

const dropdownStyles = {
  position: 'absolute' as const,
  top: 'calc(100% + 4px)',
  left: '0',
  background: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  width: '100%',
  padding: '8px',
  border: '1px solid #e1e4e8'
};

const categoryStyles = {
  padding: '12px 16px',
  fontWeight: '600' as const,
  borderBottom: '1px solid #e1e4e8',
  color: '#1f2937',
  fontSize: '14px',
  background: '#f8fafc'
};

const nodeButtonStyles = {
  background: 'none',
  border: 'none',
  width: '100%',
  textAlign: 'left' as const,
  padding: '10px 16px',
  cursor: 'pointer',
  fontSize: '13px',
  color: '#374151',
  borderRadius: '6px',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const nodeIconStyles = {
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#e5e7eb',
  borderRadius: '4px',
  marginRight: '8px'
};

const nodes = {
  Geometry: [
    { type: 'boxGeometry', label: 'Box Geometry', icon: '□' },
    { type: 'sphereGeometry', label: 'Sphere Geometry', icon: '○' },
    { type: 'cylinderGeometry', label: 'Cylinder Geometry', icon: '⬤' },
    { type: 'capsuleGeometry', label: 'Capsule Geometry', icon: '⧫' },
    { type: 'circleGeometry', label: 'Circle Geometry', icon: '◯' },
    { type: 'coneGeometry', label: 'Cone Geometry', icon: '▼' },
    { type: 'dodecahedronGeometry', label: 'Dodecahedron Geometry', icon: '⬢' },
    { type: 'extrudeGeometry', label: 'Extrude Geometry', icon: '⬗' },
  ],
  Material: [
    { type: 'meshNormalMaterial', label: 'Normal Material', icon: '◇' },
    { type: 'meshBasicMaterial', label: 'Basic Material', icon: '◈' },
    { type: 'meshPhongMaterial', label: 'Phong Material', icon: '◆' },
  ],
  Objects: [
    { type: 'mesh', label: 'Mesh', icon: '▣' },
    { type: 'group', label: 'Group', icon: '▢' },
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
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1d4ed8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
        }}
      >
        Add Node
        <span style={{ 
          marginLeft: '10px',
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s ease'
        }}>▼</span>
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={nodeIconStyles}>{node.icon}</span>
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
