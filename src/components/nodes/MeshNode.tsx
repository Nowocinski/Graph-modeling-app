'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface MeshData {
  name: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  onUpdate?: (id: string, data: Partial<MeshData>) => void;
  onDelete?: (id: string) => void;
}

const inputStyles = {
  width: '60px',
  padding: '2px 4px',
  fontSize: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginLeft: '8px'
};

const deleteButtonStyles = {
  position: 'absolute' as const,
  top: '8px',
  right: '8px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#666',
  transition: 'all 0.2s ease',
  ':hover': {
    color: '#ef4444',
    background: '#fee2e2'
  }
};

const MeshNode = ({ data, id }: NodeProps<MeshData>) => {
  const handleChange = (category: keyof MeshData, axis: keyof Vector3, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && data.onUpdate) {
      data.onUpdate(id, {
        [category]: {
          ...data[category],
          [axis]: numValue
        }
      });
    }
  };

  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  const Vector3Input = ({ label, value, onChange }: { 
    label: string; 
    value: Vector3; 
    onChange: (axis: keyof Vector3, value: string) => void;
  }) => (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ marginBottom: '4px' }}>{label}:</div>
      <div style={{ display: 'flex', gap: '8px', paddingLeft: '8px' }}>
        <div>
          <label style={{ fontSize: '11px' }}>X:</label>
          <input
            type="number"
            value={value.x}
            style={inputStyles}
            step="0.1"
            onChange={(e) => onChange('x', e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: '11px' }}>Y:</label>
          <input
            type="number"
            value={value.y}
            style={inputStyles}
            step="0.1"
            onChange={(e) => onChange('y', e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: '11px' }}>Z:</label>
          <input
            type="number"
            value={value.z}
            style={inputStyles}
            step="0.1"
            onChange={(e) => onChange('z', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="node-box" style={{
      background: '#fecaca',
      border: '1px solid #f87171',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '300px',
      color: '#333',
      position: 'relative'
    }}>
      <Handle type="target" position={Position.Left} id="geometry" />
      <Handle type="target" position={Position.Left} id="material" style={{ top: '60%' }} />
      <Handle type="source" position={Position.Right} />

      <div style={{ padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Mesh</h4>

        <button
          onClick={handleDelete}
          style={deleteButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.background = '#fee2e2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#666';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          🗑️
        </button>

        <div style={{ fontSize: '12px' }}>
          <Vector3Input
            label="Position"
            value={data.position}
            onChange={(axis, value) => handleChange('position', axis, value)}
          />
          <Vector3Input
            label="Rotation"
            value={data.rotation}
            onChange={(axis, value) => handleChange('rotation', axis, value)}
          />
          <Vector3Input
            label="Scale"
            value={data.scale}
            onChange={(axis, value) => handleChange('scale', axis, value)}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(MeshNode);
