import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import NumberInput from '../inputs/NumberInput';

interface MeshNodeProps {
  id: string;
  data: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    onUpdate: (id: string, data: any) => void;
    onDelete?: () => void;
    toggleInputSelection?: (nodeId: string, field: string, type: string) => void;
    selectedInputs?: { nodeId: string; field: string; type: string; }[];
  };
}

const MeshNode: React.FC<MeshNodeProps> = ({ id, data }) => {
  const { position, rotation, scale, onUpdate, onDelete, toggleInputSelection, selectedInputs = [] } = data;
  const [expandedSection, setExpandedSection] = useState<'position' | 'rotation' | 'scale' | null>(null);

  const handleChange = (category: string, axis: string, value: number) => {
    const updatedData = { ...data };
    updatedData[category] = { ...data[category], [axis]: value };
    onUpdate(id, updatedData);
  };

  const isInputSelected = (category: string, axis: string) => {
    return selectedInputs.some(input => 
      input.nodeId === id && 
      input.field === `${category}.${axis}`
    );
  };

  const renderSection = (title: string, data: { x: number; y: number; z: number }, category: 'position' | 'rotation' | 'scale') => {
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
              value={data.x}
              onChange={(value) => handleChange(category, 'x', value)}
              nodeId={id}
              field={`${category}.x`}
              onSelect={toggleInputSelection}
              isSelected={isInputSelected(category, 'x')}
            />
            <NumberInput
              label="Y"
              value={data.y}
              onChange={(value) => handleChange(category, 'y', value)}
              nodeId={id}
              field={`${category}.y`}
              onSelect={toggleInputSelection}
              isSelected={isInputSelected(category, 'y')}
            />
            <NumberInput
              label="Z"
              value={data.z}
              onChange={(value) => handleChange(category, 'z', value)}
              nodeId={id}
              field={`${category}.z`}
              onSelect={toggleInputSelection}
              isSelected={isInputSelected(category, 'z')}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="node-box" style={{
      background: '#fecaca',
      border: '1px solid #f87171',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '300px',
    }}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div style={{ marginBottom: '8px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <strong style={{ color: '#1e293b' }}>Mesh</strong>
          {onDelete && (
            <button
              onClick={onDelete}
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
          )}
        </div>

        {renderSection('Position', position, 'position')}
        {renderSection('Rotation', rotation, 'rotation')}
        {renderSection('Scale', scale, 'scale')}
      </div>
    </div>
  );
};

export default MeshNode;
