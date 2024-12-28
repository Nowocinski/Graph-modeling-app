'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface SceneData {
  backgroundColor: string;
  ambientLightIntensity: number;
  showAxesHelper: boolean;
  showGridHelper: boolean;
  onUpdate?: (id: string, data: Partial<SceneData>) => void;
}

const defaultValues = {
  backgroundColor: '#ffffff',
  ambientLightIntensity: 0.5,
  showAxesHelper: false,
  showGridHelper: false
};

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

const SceneNode = ({ data, id }: NodeProps<SceneData>) => {
  const {
    backgroundColor = defaultValues.backgroundColor,
    ambientLightIntensity = defaultValues.ambientLightIntensity,
    showAxesHelper = defaultValues.showAxesHelper,
    showGridHelper = defaultValues.showGridHelper,
    onUpdate
  } = data;

  const handleChange = (field: string, value: any) => {
    if (onUpdate) {
      onUpdate(id, { [field]: value });
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
            value={backgroundColor}
            style={colorInputStyles}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>Ambient Light Intensity:</label>
          <input
            type="number"
            value={ambientLightIntensity}
            style={inputStyles}
            step="0.1"
            min="0"
            max="1"
            onChange={(e) => handleChange('ambientLightIntensity', parseFloat(e.target.value))}
          />
        </div>

        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="axesHelper"
            checked={showAxesHelper}
            onChange={(e) => handleChange('showAxesHelper', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <label htmlFor="axesHelper" style={{ cursor: 'pointer' }}>Show Axes Helper</label>
        </div>

        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="gridHelper"
            checked={showGridHelper}
            onChange={(e) => handleChange('showGridHelper', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <label htmlFor="gridHelper" style={{ cursor: 'pointer' }}>Show Grid Helper</label>
        </div>
      </div>
    </div>
  );
};

export default SceneNode;
