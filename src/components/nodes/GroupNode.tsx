'use client';

import { memo, useState } from 'react';
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

const GroupNode = ({ data, id }: NodeProps<GroupData>) => {
  const [expandedSection, setExpandedSection] = useState<'position' | 'rotation' | 'scale' | null>(null);

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

  const renderSection = (title: string, values: Vector3, category: 'position' | 'rotation' | 'scale') => {
    const isExpanded = expandedSection === category;

    return (
      <div style={{
        marginBottom: '8px',
        background: 'rgba(0,0,0,0.03)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div 
          onClick={() => setExpandedSection(isExpanded ? null : category)}
          style={{
            padding: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            borderBottom: isExpanded ? '1px solid rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <span style={{ 
            fontSize: '14px',
            fontWeight: 500,
            color: '#1e293b'
          }}>
            {title}
          </span>
          <span style={{ 
            transform: isExpanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s'
          }}>
            ▼
          </span>
        </div>
        
        {isExpanded && (
          <div style={{ padding: '8px' }}>
            <NumberInput
              label="X"
              value={values.x}
              onChange={(value) => handleChange(category, 'x', value)}
              nodeId={id}
              field={`${category}.x`}
              onLabelClick={() => data.toggleInputSelection?.(id, `${category}.x`, 'number')}
              selected={isInputSelected(category, 'x')}
            />
            <NumberInput
              label="Y"
              value={values.y}
              onChange={(value) => handleChange(category, 'y', value)}
              nodeId={id}
              field={`${category}.y`}
              onLabelClick={() => data.toggleInputSelection?.(id, `${category}.y`, 'number')}
              selected={isInputSelected(category, 'y')}
            />
            <NumberInput
              label="Z"
              value={values.z}
              onChange={(value) => handleChange(category, 'z', value)}
              nodeId={id}
              field={`${category}.z`}
              onLabelClick={() => data.toggleInputSelection?.(id, `${category}.z`, 'number')}
              selected={isInputSelected(category, 'z')}
            />
          </div>
        )}
      </div>
    );
  };

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
      <div style={{ 
        marginBottom: '12px', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <strong style={{ color: '#1e293b' }}>Group</strong>
        <button 
          onClick={handleDelete} 
          style={{
            background: 'none',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '14px'
          }}
        >
          ×
        </button>
      </div>
      
      {renderSection('Position', data.position, 'position')}
      {renderSection('Rotation', data.rotation, 'rotation')}
      {renderSection('Scale', data.scale, 'scale')}

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(GroupNode);
