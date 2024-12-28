'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface MeshStandardMaterialData {
  color: string;
  roughness: number;
  metalness: number;
  wireframe: boolean;
  transparent: boolean;
  opacity: number;
  visible: boolean;
  side: 'front' | 'back' | 'double';
  onUpdate?: (id: string, data: Partial<MeshStandardMaterialData>) => void;
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

const colorInputStyles = {
  ...inputStyles,
  padding: '0',
  width: '40px',
  height: '24px'
};

const checkboxStyles = {
  marginLeft: '8px'
};

const selectStyles = {
  ...inputStyles,
  width: '80px'
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

const MeshStandardMaterialNode = ({ data, id }: NodeProps<MeshStandardMaterialData>) => {
  const handleChange = (field: keyof MeshStandardMaterialData, value: string | boolean | number) => {
    if (data.onUpdate) {
      data.onUpdate(id, { [field]: value });
    }
  };

  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div className="node-box" style={{
      background: '#ddd6fe',
      border: '1px solid #a78bfa',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '200px',
      color: '#333',
      position: 'relative'
    }}>
      <Handle type="source" position={Position.Right} />
      
      <div style={{ padding: '5px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>MeshStandardMaterial</h4>
        
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
          ×
        </button>

        <div style={{ marginBottom: '8px' }}>
          <label>
            Color:
            <input
              type="color"
              value={data.color || '#ffffff'}
              onChange={(e) => handleChange('color', e.target.value)}
              style={colorInputStyles}
            />
          </label>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>
            Roughness:
            <input
              type="number"
              value={data.roughness || 0.5}
              onChange={(e) => handleChange('roughness', parseFloat(e.target.value))}
              min="0"
              max="1"
              step="0.1"
              style={inputStyles}
            />
          </label>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>
            Metalness:
            <input
              type="number"
              value={data.metalness || 0.5}
              onChange={(e) => handleChange('metalness', parseFloat(e.target.value))}
              min="0"
              max="1"
              step="0.1"
              style={inputStyles}
            />
          </label>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>
            Wireframe:
            <input
              type="checkbox"
              checked={data.wireframe || false}
              onChange={(e) => handleChange('wireframe', e.target.checked)}
              style={checkboxStyles}
            />
          </label>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>
            Transparent:
            <input
              type="checkbox"
              checked={data.transparent || false}
              onChange={(e) => handleChange('transparent', e.target.checked)}
              style={checkboxStyles}
            />
          </label>
        </div>

        {data.transparent && (
          <div style={{ marginBottom: '8px' }}>
            <label>
              Opacity:
              <input
                type="number"
                value={data.opacity || 1}
                onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
                min="0"
                max="1"
                step="0.1"
                style={inputStyles}
              />
            </label>
          </div>
        )}

        <div style={{ marginBottom: '8px' }}>
          <label>
            Visible:
            <input
              type="checkbox"
              checked={data.visible !== false}
              onChange={(e) => handleChange('visible', e.target.checked)}
              style={checkboxStyles}
            />
          </label>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label>
            Side:
            <select
              value={data.side || 'front'}
              onChange={(e) => handleChange('side', e.target.value)}
              style={selectStyles}
            >
              <option value="front">Front</option>
              <option value="back">Back</option>
              <option value="double">Double</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default memo(MeshStandardMaterialNode);
