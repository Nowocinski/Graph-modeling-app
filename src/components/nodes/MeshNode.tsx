'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface MeshData {
  name: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
  onUpdate?: (id: string, data: Partial<MeshData>) => void;
}

const inputStyles = {
  width: '60px',
  padding: '2px 4px',
  fontSize: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginLeft: '8px'
};

const Vector3Input = ({ 
  label, 
  values, 
  onChange 
}: { 
  label: string; 
  values: { x: number; y: number; z: number }; 
  onChange: (axis: 'x' | 'y' | 'z', value: number) => void;
}) => (
  <div style={{ marginBottom: '8px' }}>
    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{label}:</div>
    <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
      <div>
        <label style={{ fontSize: '11px' }}>X:</label>
        <input
          type="number"
          value={values.x}
          style={inputStyles}
          step="0.1"
          onChange={(e) => onChange('x', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div>
        <label style={{ fontSize: '11px' }}>Y:</label>
        <input
          type="number"
          value={values.y}
          style={inputStyles}
          step="0.1"
          onChange={(e) => onChange('y', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div>
        <label style={{ fontSize: '11px' }}>Z:</label>
        <input
          type="number"
          value={values.z}
          style={inputStyles}
          step="0.1"
          onChange={(e) => onChange('z', parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  </div>
);

const MeshNode = ({ data, id }: NodeProps<MeshData>) => {
  const handleVectorChange = (
    property: 'position' | 'rotation' | 'scale',
    axis: 'x' | 'y' | 'z',
    value: number
  ) => {
    if (data.onUpdate) {
      data.onUpdate(id, {
        [property]: {
          ...data[property],
          [axis]: value
        }
      });
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
    }}>
      <Handle type="target" position={Position.Left} id="geometry" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="material" style={{ top: '70%' }} />
      
      <div style={{ padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Mesh</h4>
        
        <div style={{ fontSize: '12px' }}>
          <Vector3Input
            label="Position"
            values={data.position}
            onChange={(axis, value) => handleVectorChange('position', axis, value)}
          />
          <Vector3Input
            label="Rotation"
            values={data.rotation}
            onChange={(axis, value) => handleVectorChange('rotation', axis, value)}
          />
          <Vector3Input
            label="Scale"
            values={data.scale}
            onChange={(axis, value) => handleVectorChange('scale', axis, value)}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(MeshNode);
