'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface BoxGeometryData {
  width?: number;
  height?: number;
  depth?: number;
}

const BoxGeometryNode = ({ data }: NodeProps<BoxGeometryData>) => {
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
          <div>
            <label>Width: </label>
            <span>{data.width || 1}</span>
          </div>
          <div>
            <label>Height: </label>
            <span>{data.height || 1}</span>
          </div>
          <div>
            <label>Depth: </label>
            <span>{data.depth || 1}</span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(BoxGeometryNode);
