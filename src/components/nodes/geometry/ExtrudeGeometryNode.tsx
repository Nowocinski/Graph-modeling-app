'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ExtrudeGeometryData {
  depth: number;
  bevelEnabled: boolean;
  bevelThickness: number;
  bevelSize: number;
  bevelSegments: number;
  steps: number;
  onUpdate?: (id: string, data: Partial<ExtrudeGeometryData>) => void;
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

const ExtrudeGeometryNode = ({ data, id }: NodeProps<ExtrudeGeometryData>) => {
  const handleChange = (field: keyof ExtrudeGeometryData, value: string | boolean) => {
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
        <h4 style={{ margin: '0 0 8px 0' }}>ExtrudeGeometry</h4>
        
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
              Depth:
              <input
                type="number"
                value={data.depth}
                onChange={(e) => handleChange('depth', e.target.value)}
                style={inputStyles}
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label>
              Steps:
              <input
                type="number"
                value={data.steps}
                onChange={(e) => handleChange('steps', e.target.value)}
                style={inputStyles}
              />
            </label>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label>
              Bevel Enabled:
              <input
                type="checkbox"
                checked={data.bevelEnabled}
                onChange={(e) => handleChange('bevelEnabled', e.target.checked)}
                style={checkboxStyles}
              />
            </label>
          </div>

          {data.bevelEnabled && (
            <>
              <div style={{ marginBottom: '4px' }}>
                <label>
                  Bevel Thickness:
                  <input
                    type="number"
                    value={data.bevelThickness}
                    onChange={(e) => handleChange('bevelThickness', e.target.value)}
                    style={inputStyles}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '4px' }}>
                <label>
                  Bevel Size:
                  <input
                    type="number"
                    value={data.bevelSize}
                    onChange={(e) => handleChange('bevelSize', e.target.value)}
                    style={inputStyles}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '4px' }}>
                <label>
                  Bevel Segments:
                  <input
                    type="number"
                    value={data.bevelSegments}
                    onChange={(e) => handleChange('bevelSegments', e.target.value)}
                    style={inputStyles}
                  />
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ExtrudeGeometryNode);
