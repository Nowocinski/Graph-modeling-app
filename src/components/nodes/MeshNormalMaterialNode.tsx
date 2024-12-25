'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface MeshNormalMaterialData {
  wireframe: boolean;
  transparent: boolean;
  opacity: number;
  onUpdate?: (id: string, data: Partial<MeshNormalMaterialData>) => void;
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

const MeshNormalMaterialNode = ({ data, id }: NodeProps<MeshNormalMaterialData>) => {
  const handleChange = (field: keyof MeshNormalMaterialData, value: any) => {
    if (data.onUpdate) {
      if (field === 'opacity') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          data.onUpdate(id, { [field]: numValue });
        }
      } else {
        data.onUpdate(id, { [field]: value });
      }
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
        <h4 style={{ margin: '0 0 8px 0' }}>MeshNormalMaterial</h4>
        
        <div style={{ fontSize: '12px' }}>
          <div style={{ marginBottom: '4px' }}>
            <label>Wireframe:</label>
            <input
              type="checkbox"
              checked={data.wireframe}
              style={checkboxStyles}
              onChange={(e) => handleChange('wireframe', e.target.checked)}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <label>Transparent:</label>
            <input
              type="checkbox"
              checked={data.transparent}
              style={checkboxStyles}
              onChange={(e) => handleChange('transparent', e.target.checked)}
            />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <label>Opacity:</label>
            <input
              type="number"
              value={data.opacity}
              style={inputStyles}
              step="0.1"
              min="0"
              max="1"
              onChange={(e) => handleChange('opacity', e.target.value)}
              disabled={!data.transparent}
            />
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(MeshNormalMaterialNode);
