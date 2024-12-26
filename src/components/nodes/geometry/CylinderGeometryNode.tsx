'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CylinderGeometryData {
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments: number;
  heightSegments: number;
  openEnded: boolean;
  onUpdate?: (id: string, data: Partial<CylinderGeometryData>) => void;
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

const checkboxStyles = {
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

const CylinderGeometryNode = ({ data, id }: NodeProps<CylinderGeometryData>) => {
  const handleChange = (field: keyof CylinderGeometryData, value: string | boolean) => {
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
        <h4 style={{ margin: '0 0 8px 0' }}>CylinderGeometry</h4>
        
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
            <label>Top Radius:</label>
            <input
              type="number"
              value={data.radiusTop}
              style={inputStyles}
              step="0.1"
              onChange={(e) => handleChange('radiusTop', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <label>Bottom Radius:</label>
            <input
              type="number"
              value={data.radiusBottom}
              style={inputStyles}
              step="0.1"
              onChange={(e) => handleChange('radiusBottom', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <label>Height:</label>
            <input
              type="number"
              value={data.height}
              style={inputStyles}
              step="0.1"
              onChange={(e) => handleChange('height', e.target.value)}
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
          <div style={{ marginBottom: '4px' }}>
            <label>Height Segments:</label>
            <input
              type="number"
              value={data.heightSegments}
              style={inputStyles}
              step="1"
              min="1"
              onChange={(e) => handleChange('heightSegments', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <label>
              Open Ended:
              <input
                type="checkbox"
                checked={data.openEnded}
                style={checkboxStyles}
                onChange={(e) => handleChange('openEnded', e.target.checked)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CylinderGeometryNode);
