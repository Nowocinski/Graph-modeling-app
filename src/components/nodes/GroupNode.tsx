'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import NumberInput from '../inputs/NumberInput';

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface GroupData {
  name: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  onUpdate?: (id: string, data: Partial<GroupData>) => void;
  onDelete?: (id: string) => void;
  nodes?: string[]; // Add nodes array to GroupData
  toggleInputSelection?: (nodeId: string, field: string, type: string) => void;
  selectedInputs?: { nodeId: string; field: string; type: string; }[];
}

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

const GroupNode = ({ data, id }: NodeProps<GroupData>) => {
  const handleChange = (category: keyof GroupData, axis: keyof Vector3, value: number) => {
    if (data.onUpdate) {
      data.onUpdate(id, {
        [category]: {
          ...data[category],
          [axis]: value
        }
      });
    }
  };

  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  const isInputSelected = (category: string, axis: string) => {
    return data.selectedInputs?.some(input => 
      input.nodeId === id && 
      input.field === `${category}.${axis}`
    ) || false;
  };

  const Vector3Input = ({ label, value, onChange, category }: { 
    label: string; 
    value: Vector3; 
    onChange: (axis: keyof Vector3, value: number) => void;
    category: string;
  }) => (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ marginBottom: '4px' }}>{label}:</div>
      <div style={{ display: 'flex', gap: '8px', paddingLeft: '8px' }}>
        <div>
          <NumberInput
            label="X"
            value={value.x}
            onChange={(val) => onChange('x', val)}
            nodeId={id}
            field={`${category}.x`}
            onLabelClick={() => data.toggleInputSelection?.(id, `${category}.x`, 'number')}
            selected={isInputSelected(category, 'x')}
          />
        </div>
        <div>
          <NumberInput
            label="Y"
            value={value.y}
            onChange={(val) => onChange('y', val)}
            nodeId={id}
            field={`${category}.y`}
            onLabelClick={() => data.toggleInputSelection?.(id, `${category}.y`, 'number')}
            selected={isInputSelected(category, 'y')}
          />
        </div>
        <div>
          <NumberInput
            label="Z"
            value={value.z}
            onChange={(val) => onChange('z', val)}
            nodeId={id}
            field={`${category}.z`}
            onLabelClick={() => data.toggleInputSelection?.(id, `${category}.z`, 'number')}
            selected={isInputSelected(category, 'z')}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      padding: '16px', 
      borderRadius: '8px', 
      background: '#FFC107', 
      border: '1px solid #e2e8f0', 
      position: 'relative',
      width: '320px' 
    }}>
      <Handle type="target" position={Position.Left} />
      <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>Group</div>
      
      <Vector3Input
        label="Position"
        value={data.position}
        onChange={(axis, value) => handleChange('position', axis, value)}
        category="position"
      />
      <Vector3Input
        label="Rotation"
        value={data.rotation}
        onChange={(axis, value) => handleChange('rotation', axis, value)}
        category="rotation"
      />
      <Vector3Input
        label="Scale"
        value={data.scale}
        onChange={(axis, value) => handleChange('scale', axis, value)}
        category="scale"
      />

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
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(GroupNode);
