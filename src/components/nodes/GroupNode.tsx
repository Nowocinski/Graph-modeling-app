'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface GroupData {
  name: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  onUpdate?: (id: string, data: Partial<GroupData>) => void;
  onDelete?: (id: string) => void;
  nodes?: string[]; // Add nodes array to GroupData
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

const GroupNode = ({ data, id }: NodeProps<GroupData>) => {
  const handleChange = (category: keyof GroupData, axis: keyof Vector3, value: string) => {
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
    <div style={{ 
      padding: '16px', 
      borderRadius: '8px', 
      background: '#FFC107', 
      border: '1px solid #e2e8f0', 
      position: 'relative',
      width: '320px' 
    }}>
      <Handle type="target" position={Position.Left} />
      <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>Group</div>
      
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
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(GroupNode);
