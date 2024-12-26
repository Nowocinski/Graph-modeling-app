'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CapsuleGeometryData {
  radius: number;
  length: number;
  capSegments: number;
  radialSegments: number;
  onUpdate?: (id: string, data: Partial<CapsuleGeometryData>) => void;
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

const CapsuleGeometryNode = ({ data, id }: NodeProps<CapsuleGeometryData>) => {
  const handleChange = (field: keyof CapsuleGeometryData, value: string | boolean) => {
    if (data.onUpdate) {
      if (typeof value === 'string') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          data.onUpdate(id, { [field]: numValue });
        }
      } else {
        data.onUpdate(id, { [field]: value });
      }
    }
  };

  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div className="node-box" style={{
      background: '#bbf7d0',
      border: '1px solid #4ade80',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '200px',
      color: '#333',
      position: 'relative'
    }}>
      <Handle type="source" position={Position.Right} />
      
      <div style={{ padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>CapsuleGeometry</h4>
        
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
          <div style={{ marginBottom: '4px' }}>
            <label>Radius:</label>
            <input
              type="number"
              value={data.radius}
              style={inputStyles}
              step="0.1"
              onChange={(e) => handleChange('radius', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <label>Length:</label>
            <input
              type="number"
              value={data.length}
              style={inputStyles}
              step="0.1"
              onChange={(e) => handleChange('length', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <label>Cap Segments:</label>
            <input
              type="number"
              value={data.capSegments}
              style={inputStyles}
              step="1"
              min="1"
              onChange={(e) => handleChange('capSegments', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <label>Radial Segments:</label>
            <input
              type="number"
              value={data.radialSegments}
              style={inputStyles}
              step="1"
              min="3"
              onChange={(e) => handleChange('radialSegments', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CapsuleGeometryNode);
