'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface TorusKnotGeometryData {
  radius: number;
  tube: number;
  tubularSegments: number;
  radialSegments: number;
  p: number;
  q: number;
  onUpdate?: (id: string, data: Partial<TorusKnotGeometryData>) => void;
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

const TorusKnotGeometryNode = ({ data, id }: NodeProps<TorusKnotGeometryData>) => {
  const handleChange = (field: keyof TorusKnotGeometryData, value: string) => {
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
        <h4 style={{ margin: '0 0 8px 0' }}>TorusKnotGeometry</h4>
        
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
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label>
              Tube:
              <input
                type="number"
                value={data.tube}
                onChange={(e) => handleChange('tube', e.target.value)}
                style={inputStyles}
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
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label>
              P:
              <input
                type="number"
                value={data.p}
                onChange={(e) => handleChange('p', e.target.value)}
                style={inputStyles}
                title="Number of times the geometry winds around its axis of rotational symmetry"
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label>
              Q:
              <input
                type="number"
                value={data.q}
                onChange={(e) => handleChange('q', e.target.value)}
                style={inputStyles}
                title="Number of times the geometry winds around a circle in the interior of the torus"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TorusKnotGeometryNode);
