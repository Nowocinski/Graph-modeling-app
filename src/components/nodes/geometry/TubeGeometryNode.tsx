'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface TubeGeometryData {
  radius: number;
  tubeRadius: number;
  radialSegments: number;
  tubularSegments: number;
  closed: boolean;
  onUpdate?: (id: string, data: Partial<TubeGeometryData>) => void;
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

const TubeGeometryNode = ({ data, id }: NodeProps<TubeGeometryData>) => {
  const handleChange = (field: keyof TubeGeometryData, value: string | boolean) => {
    if (data.onUpdate) {
      if (typeof value === 'boolean') {
        data.onUpdate(id, { [field]: value });
      } else {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          data.onUpdate(id, { [field]: numValue });
        }
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
        <h4 style={{ margin: '0 0 8px 0' }}>TubeGeometry</h4>
        
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
              Radius:
              <input
                type="number"
                value={data.radius}
                onChange={(e) => handleChange('radius', e.target.value)}
                style={inputStyles}
                title="Radius of the helix path"
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label>
              Tube Radius:
              <input
                type="number"
                value={data.tubeRadius}
                onChange={(e) => handleChange('tubeRadius', e.target.value)}
                style={inputStyles}
                title="Radius of the tube"
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label>
              Radial Segments:
              <input
                type="number"
                value={data.radialSegments}
                onChange={(e) => handleChange('radialSegments', e.target.value)}
                style={inputStyles}
                title="Number of segments around tube circumference"
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label>
              Tubular Segments:
              <input
                type="number"
                value={data.tubularSegments}
                onChange={(e) => handleChange('tubularSegments', e.target.value)}
                style={inputStyles}
                title="Number of segments along the tube length"
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              Closed:
              <input
                type="checkbox"
                checked={data.closed}
                onChange={(e) => handleChange('closed', e.target.checked)}
                style={{ marginLeft: '8px' }}
                title="Whether the tube is closed (forms a complete loop)"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TubeGeometryNode);
