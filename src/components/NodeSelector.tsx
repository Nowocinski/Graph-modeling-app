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
  cursor: 'pointer',
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
  padding: '8px',
  position: 'fixed' as const,
  top: 'calc(20px + 45px)',
  left: '20px',
  right: '20px',
  background: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  padding: '8px',
  border: '1px solid #e1e4e8',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px',
  maxHeight: 'calc(100vh - 100px)',
  overflowY: 'auto' as const
};

const categoryStyles = {
  padding: '12px 16px',
  fontWeight: '600' as const,
  borderBottom: '1px solid #e1e4e8',
  color: '#1f2937',
  fontSize: '14px',
  background: '#f8fafc',
  marginBottom: '8px',
  borderRadius: '6px 6px 0 0'
};

const categoryContainerStyles = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap' as const,
  maxWidth: '100%',
  marginBottom: '16px'
};

const sectionStyles = {
  width: '100%',
  background: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  overflow: 'hidden'
};

const nodeButtonStyles = {
  background: 'none',
  border: 'none',
  width: '220px',
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

const columnStyles = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '2px',
  minWidth: '220px',
  maxWidth: '300px'
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
    { type: 'icosahedronGeometry', label: 'Icosahedron Geometry', icon: '⬡' },
    { type: 'latheGeometry', label: 'Lathe Geometry', icon: '◎' },
    { type: 'octahedronGeometry', label: 'Octahedron Geometry', icon: '◈' },
    { type: 'planeGeometry', label: 'Plane Geometry', icon: '▭' },
    { type: 'ringGeometry', label: 'Ring Geometry', icon: '◍' },
    { type: 'tetrahedronGeometry', label: 'Tetrahedron Geometry', icon: '△' },
    { type: 'torusGeometry', label: 'Torus Geometry', icon: '⊗' },
    { type: 'torusKnotGeometry', label: 'Torus Knot Geometry', icon: '✾' },
    { type: 'tubeGeometry', label: 'Tube Geometry', icon: '⌇' },
  ],
  Material: [
    { type: 'meshNormalMaterial', label: 'Normal Material', icon: '◇' },
    { type: 'meshBasicMaterial', label: 'Basic Material', icon: '◈' },
    { type: 'meshPhongMaterial', label: 'Phong Material', icon: '◆' },
  ],
  Objects: [
    { type: 'mesh', label: 'Mesh', icon: '▣' },
    { type: 'group', label: 'Group', icon: '▢' },
  ],
  'CSG Operations': [
    { type: 'subtract', label: 'Subtract Operation', icon: '⊖' },
  ]
};

export default function NodeSelector({ onSelect }: NodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (nodeType: string) => {
    onSelect(nodeType);
    setIsOpen(false);
  };

  // Funkcja dzieląca elementy na kolumny po 5
  const splitIntoColumns = (items: typeof nodes.Geometry) => {
    const columns: typeof nodes.Geometry[] = [];
    for (let i = 0; i < items.length; i += 5) {
      columns.push(items.slice(i, i + 5));
    }
    return columns;
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
            <div key={category} style={sectionStyles}>
              <div style={categoryStyles}>{category}</div>
              <div style={categoryContainerStyles}>
                {splitIntoColumns(items).map((column, columnIndex) => (
                  <div key={columnIndex} style={columnStyles}>
                    {column.map((node) => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
