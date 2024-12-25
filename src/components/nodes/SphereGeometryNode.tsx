'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface SphereGeometryData {
  radius: number;
  widthSegments: number;
  heightSegments: number;
  onUpdate?: (id: string, data: Partial<SphereGeometryData>) => void;
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

const SphereGeometryNode = ({ data, id }: NodeProps<SphereGeometryData>) => {
  const handleChange = (field: keyof SphereGeometryData, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && data.onUpdate) {
      data.onUpdate(id, { [field]: numValue });
    }
  };

  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div className="node-box" style={{
      background: '#fff',
      border: '1px solid #777',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '150px',
      color: '#333',
      position: 'relative'
    }}>
      <Handle type="source" position={Position.Right} />
      
      <div style={{ padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>SphereGeometry</h4>
        
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
            <label>Width Segments:</label>
            <input
              type="number"
              value={data.widthSegments}
              style={inputStyles}
              step="1"
              min="3"
              onChange={(e) => handleChange('widthSegments', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <label>Height Segments:</label>
            <input
              type="number"
              value={data.heightSegments}
              style={inputStyles}
              step="1"
              min="2"
              onChange={(e) => handleChange('heightSegments', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SphereGeometryNode);
