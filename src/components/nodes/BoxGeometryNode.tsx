'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface BoxGeometryData {
  width: number;
  height: number;
  depth: number;
  onUpdate?: (id: string, data: Partial<BoxGeometryData>) => void;
}

const inputStyles = {
  width: '60px',
  padding: '2px 4px',
  fontSize: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginLeft: '8px'
};

const BoxGeometryNode = ({ data, id }: NodeProps<BoxGeometryData>) => {
  const handleChange = (field: keyof BoxGeometryData, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && data.onUpdate) {
      data.onUpdate(id, { [field]: numValue });
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
    }}>
      <Handle type="target" position={Position.Left} />
      
      <div style={{ padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>BoxGeometry</h4>
        
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

export default memo(BoxGeometryNode);
