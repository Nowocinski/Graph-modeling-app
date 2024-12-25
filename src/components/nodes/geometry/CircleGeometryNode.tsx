'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface BoxGeometryData {
  width: number;
  height: number;
  depth: number;
  onUpdate?: (id: string, data: Partial<BoxGeometryData>) => void;
  onDelete?: (id: string) => void;
}

interface CircleGeometryData {
  radius: number;
  segments: number;
  onUpdate?: (id: string, data: Partial<CircleGeometryData>) => void;
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

const BoxGeometryNode = ({ data, id }: NodeProps<BoxGeometryData>) => {
  const handleChange = (field: keyof BoxGeometryData, value: string) => {
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
      <Handle type="target" position={Position.Left} />
      
      <div style={{ padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>BoxGeometry</h4>
        
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
            <label>Width:</label>
            <input
              type="number"
              value={data.width}
              style={inputStyles}
              step="0.1"
              onChange={(e) => handleChange('width', e.target.value)}
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
            <label>Depth:</label>
            <input
              type="number"
              value={data.depth}
              style={inputStyles}
              step="0.1"
              onChange={(e) => handleChange('depth', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const CircleGeometryNode = ({ data, id }: NodeProps<CircleGeometryData>) => {
  const handleChange = (field: keyof CircleGeometryData, value: string) => {
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
      <Handle type="target" position={Position.Left} />
      
      <div style={{ padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>CircleGeometry</h4>
        
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
            <label>Segments:</label>
            <input
              type="number"
              value={data.segments}
              style={inputStyles}
              step="1"
              min="3"
              onChange={(e) => handleChange('segments', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(CircleGeometryNode);