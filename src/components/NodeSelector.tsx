'use client';

import { useState, useRef, useEffect } from 'react';

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
  padding: '8px 12px',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#1f2937',
  display: 'flex',
  alignItems: 'center',
  width: 'calc(50% - 4px)',
  ':hover': {
    backgroundColor: '#f3f4f6'
  }
};

const iconStyles = {
  marginRight: '8px',
  fontSize: '16px',
  color: '#6b7280',
  background: '#f3f4f6',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px'
};

const dropdownStyles = {
  position: 'fixed' as const,
  top: 'calc(20px + 45px)',
  left: '20px',
  right: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  width: '480px',
  maxHeight: '400px',
  overflowY: 'auto' as const
};

const categoryContainerStyles = {
  display: 'flex',
  flexDirection: 'row' as const,
  flexWrap: 'wrap' as const,
  gap: '8px',
  padding: '0 8px'
};

const sectionStyles = {
  padding: '8px 0',
  borderBottom: '1px solid #e5e7eb'
};

const categoryStyles = {
  padding: '4px 12px',
  fontSize: '12px',
  fontWeight: '500',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  width: '100%'
};

const nodes = {
  Geometry: [
    { type: 'boxGeometry', label: 'Box', icon: '□' },
    { type: 'sphereGeometry', label: 'Sphere', icon: '○' },
    { type: 'cylinderGeometry', label: 'Cylinder', icon: '⬤' },
    { type: 'capsuleGeometry', label: 'Capsule', icon: '⧫' },
    { type: 'circleGeometry', label: 'Circle', icon: '◯' },
    { type: 'coneGeometry', label: 'Cone', icon: '▼' },
    { type: 'dodecahedronGeometry', label: 'Dodecahedron', icon: '⬢' },
    { type: 'extrudeGeometry', label: 'Extrude', icon: '⬗' },
    { type: 'icosahedronGeometry', label: 'Icosahedron', icon: '⬡' },
    { type: 'latheGeometry', label: 'Lathe', icon: '◎' },
    { type: 'octahedronGeometry', label: 'Octahedron', icon: '◈' },
    { type: 'planeGeometry', label: 'Plane', icon: '▭' },
    { type: 'ringGeometry', label: 'Ring', icon: '◍' },
    { type: 'tetrahedronGeometry', label: 'Tetrahedron', icon: '△' },
    { type: 'torusGeometry', label: 'Torus', icon: '⊗' },
    { type: 'torusKnotGeometry', label: 'Torus Knot', icon: '✾' },
    { type: 'tubeGeometry', label: 'Tube', icon: '⌇' },
  ],
  Material: [
    { type: 'meshNormalMaterial', label: 'Normal', icon: '◇' },
    { type: 'meshBasicMaterial', label: 'Basic', icon: '◈' },
    { type: 'meshPhongMaterial', label: 'Phong', icon: '◆' }
  ],
  Objects: [
    { type: 'mesh', label: 'Mesh', icon: '▣' },
    { type: 'group', label: 'Group', icon: '▢' },
  ],
  Utilities: [
    { type: 'loop', label: 'Loop', icon: '↻' },
  ],
  'CSG Operations': [
    { type: 'subtract', label: 'Subtract', icon: '⊖' },
    { type: 'intersect', label: 'Intersect', icon: '⊗' },
    { type: 'union', label: 'Union', icon: '⊕' }
  ]
};

const NodeSelector = ({ onSelect }: NodeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSelect = (nodeType: string) => {
    onSelect(nodeType);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={selectorStyles}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 16px',
          border: 'none',
          background: '#2563eb',
          color: 'white',
          borderRadius: '8px',
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
        }}
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
        <div
          ref={menuRef}
          style={dropdownStyles}
        >
          {Object.entries(nodes).map(([category, items]) => (
            <div key={category} style={sectionStyles}>
              <div style={categoryStyles}>{category}</div>
              <div style={categoryContainerStyles}>
                {items.map((node) => (
                  <button
                    key={node.type}
                    onClick={() => handleSelect(node.type)}
                    style={{
                      ...buttonStyles,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span style={iconStyles}>{node.icon}</span>
                    {node.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NodeSelector;
