'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import NumberInput from '../../inputs/NumberInput';

interface BoxGeometryData {
  width: number;
  height: number;
  depth: number;
  onUpdate?: (id: string, data: Partial<BoxGeometryData>) => void;
  onDelete?: (id: string) => void;
  toggleInputSelection?: (nodeId: string, field: string, type: string) => void;
  selectedInputs?: { nodeId: string; field: string; type: string; }[];
}

interface BoxGeometryNodeProps {
  id: string;
  data: BoxGeometryData;
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

const BoxGeometryNode: React.FC<BoxGeometryNodeProps> = ({ id, data }) => {
  const { width, height, depth, onUpdate, onDelete, toggleInputSelection, selectedInputs = [] } = data;

  const handleChange = (field: keyof BoxGeometryData, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && onUpdate) {
      onUpdate(id, { [field]: numValue });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const isInputSelected = (field: string) => {
    return selectedInputs.some(input => input.nodeId === id && input.field === field);
  };

  return (
    <div className="node-box" style={{
      background: '#bbf7d0',
      border: '1px solid #4ade80',
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
          <NumberInput
            label="Width"
            value={width}
            onChange={(value) => handleChange('width', value.toString())}
            nodeId={id}
            field="width"
            onSelect={toggleInputSelection}
            isSelected={isInputSelected('width')}
          />
          <NumberInput
            label="Height"
            value={height}
            onChange={(value) => handleChange('height', value.toString())}
            nodeId={id}
            field="height"
            onSelect={toggleInputSelection}
            isSelected={isInputSelected('height')}
          />
          <NumberInput
            label="Depth"
            value={depth}
            onChange={(value) => handleChange('depth', value.toString())}
            nodeId={id}
            field="depth"
            onSelect={toggleInputSelection}
            isSelected={isInputSelected('depth')}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(BoxGeometryNode);
