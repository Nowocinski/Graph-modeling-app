'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface SceneData {
  backgroundColor: string;
  ambientLightIntensity: number;
  pointLightIntensity: number;
  pointLightPosition: {
    x: number;
    y: number;
    z: number;
  };
  onUpdate?: (id: string, data: Partial<SceneData>) => void;
}

const inputStyles = {
  width: '60px',
  padding: '2px 4px',
  fontSize: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginLeft: '8px'
};

const colorInputStyles = {
  width: '80px',
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

const SceneNode = ({ data, id }: NodeProps<SceneData>) => {
  const handleChange = (field: string, value: any) => {
    if (data.onUpdate) {
      if (field === 'pointLightPosition') {
        data.onUpdate(id, {
          pointLightPosition: {
            ...data.pointLightPosition,
            ...value
          }
        });
      } else {
        data.onUpdate(id, { [field]: value });
      }
    }
  };

  return (
    <div className="node-box" style={{
      background: '#fef08a',
      border: '1px solid #facc15',
      padding: '16px',
      borderRadius: '8px',
      minWidth: '300px',
      color: '#333'
    }}>
      <Handle type="target" position={Position.Left} />
      <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>Scene Settings</div>
      <div style={{ fontSize: '12px', color: '#333' }}>
        <div style={{ marginBottom: '8px' }}>
          <label>Background Color:</label>
          <input
            type="color"
            value={data.backgroundColor}
            style={colorInputStyles}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>Ambient Light Intensity:</label>
          <input
            type="number"
            value={data.ambientLightIntensity}
            style={inputStyles}
            step="0.1"
            min="0"
            max="1"
            onChange={(e) => handleChange('ambientLightIntensity', parseFloat(e.target.value))}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>Point Light Intensity:</label>
          <input
            type="number"
            value={data.pointLightIntensity}
            style={inputStyles}
            step="0.1"
            min="0"
            onChange={(e) => handleChange('pointLightIntensity', parseFloat(e.target.value))}
          />
        </div>

        <Vector3Input
          label="Point Light Position"
          values={data.pointLightPosition}
          onChange={(axis, value) => handleChange('pointLightPosition', { [axis]: value })}
        />
      </div>
    </div>
  );
};

export default memo(SceneNode);
