'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface PlaneGeometryData {
  width: number;
  height: number;
  widthSegments: number;
  heightSegments: number;
  onUpdate?: (id: string, data: Partial<PlaneGeometryData>) => void;
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

const PlaneGeometryNode = ({ data, id }: NodeProps<PlaneGeometryData>) => {
  const handleChange = (field: keyof PlaneGeometryData, value: string) => {
    if (data.onUpdate) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        data.onUpdate(id, { [field]: numValue });
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
      background: '#fff',
      border: '1px solid #777',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '200px',
      color: '#333',
      position: 'relative'
    }}>
      <Handle type="source" position={Position.Right} />
      
      <div style={{ padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>PlaneGeometry</h4>
        
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
            <label>
              Width:
              <input
                type="number"
                value={data.width}
                onChange={(e) => handleChange('width', e.target.value)}
                style={inputStyles}
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label>
              Height:
              <input
                type="number"
                value={data.height}
                onChange={(e) => handleChange('height', e.target.value)}
                style={inputStyles}
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label>
              Width Segments:
              <input
                type="number"
                value={data.widthSegments}
                onChange={(e) => handleChange('widthSegments', e.target.value)}
                style={inputStyles}
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label>
              Height Segments:
              <input
                type="number"
                value={data.heightSegments}
                onChange={(e) => handleChange('heightSegments', e.target.value)}
                style={inputStyles}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PlaneGeometryNode);
