import { Handle, Position } from "reactflow";
import { useCallback, useState } from "react";
import NumberInput from "../../inputs/NumberInput";

type Direction = 'x' | 'y' | 'z';

interface LoopNodeData {
  iterations: number;
  spacing: number;
  direction: Direction;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  onUpdate?: (id: string, data: Partial<LoopNodeData>) => void;
  onDelete?: (id: string) => void;
  toggleInputSelection?: (nodeId: string, field: string, type: string) => void;
  selectedInputs?: { nodeId: string; field: string; type: string; }[];
}

interface LoopNodeProps {
  data: LoopNodeData;
  id: string;
}

const nodeStyles = {
  padding: '16px',
  borderRadius: '8px',
  background: '#bfdbfe',
  border: '1px solid #60a5fa',
  position: 'relative' as const,
  width: '380px'
};

const titleStyles = {
  margin: '0 0 16px 0',
  fontSize: '14px',
  fontWeight: '500' as const,
  color: '#1f2937'
};

const selectStyles = {
  padding: '2px 4px',
  fontSize: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginLeft: '6px',
  background: 'white',
  width: '100px',
  color: '#1f2937'
};

export const LoopNode = ({ data, id }: LoopNodeProps) => {
  const [expandedSection, setExpandedSection] = useState<'transform' | 'loop' | null>(null);

  const handleChange = useCallback((field: keyof LoopNodeData, value: any) => {
    if (data.onUpdate) {
      data.onUpdate(id, { [field]: value });
    }
  }, [data.onUpdate, id]);

  const handleDelete = useCallback(() => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  }, [data.onDelete, id]);

  const handlePositionChange = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    handleChange('position', { ...data.position, [axis]: value });
  }, [data.position, handleChange]);

  const handleRotationChange = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    handleChange('rotation', { ...data.rotation, [axis]: value });
  }, [data.rotation, handleChange]);

  const handleScaleChange = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    handleChange('scale', { ...data.scale, [axis]: value });
  }, [data.scale, handleChange]);

  const isInputSelected = (category: string, axis: string) => {
    return data.selectedInputs?.some(input => 
      input.nodeId === id && 
      input.field === `${category}.${axis}`
    ) || false;
  };

  const renderSection = (title: string, values: { x: number; y: number; z: number }, category: string, onChange: (axis: 'x' | 'y' | 'z', value: number) => void) => {
    const isExpanded = expandedSection === (category === 'position' || category === 'rotation' || category === 'scale' ? 'transform' : 'loop');

    return (
      <div style={{
        marginBottom: '8px',
        background: 'rgba(0,0,0,0.03)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div 
          onClick={() => setExpandedSection(isExpanded ? null : (category === 'position' || category === 'rotation' || category === 'scale' ? 'transform' : 'loop'))}
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
            color: '#1f2937'
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
              onChange={(value) => onChange('x', value)}
              nodeId={id}
              field={`${category}.x`}
              onSelect={data.toggleInputSelection}
              isSelected={isInputSelected(category, 'x')}
            />
            <NumberInput
              label="Y"
              value={values.y}
              onChange={(value) => onChange('y', value)}
              nodeId={id}
              field={`${category}.y`}
              onSelect={data.toggleInputSelection}
              isSelected={isInputSelected(category, 'y')}
            />
            <NumberInput
              label="Z"
              value={values.z}
              onChange={(value) => onChange('z', value)}
              nodeId={id}
              field={`${category}.z`}
              onSelect={data.toggleInputSelection}
              isSelected={isInputSelected(category, 'z')}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={nodeStyles}>
      <Handle 
        type="target" 
        position={Position.Left} 
        id="input"
        style={{ background: '#64748b' }}
      />
      
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h4 style={titleStyles}>Loop</h4>
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

      <div style={{ marginBottom: '16px' }}>
        <div style={{
          marginBottom: '8px',
          background: 'rgba(0,0,0,0.03)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div 
            onClick={() => setExpandedSection(expandedSection === 'loop' ? null : 'loop')}
            style={{
              padding: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              borderBottom: expandedSection === 'loop' ? '1px solid rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <span style={{ 
              fontSize: '14px',
              fontWeight: 500,
              color: '#1f2937'
            }}>
              Loop Settings
            </span>
            <span style={{ 
              transform: expandedSection === 'loop' ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s'
            }}>
              ▼
            </span>
          </div>
          
          {expandedSection === 'loop' && (
            <div style={{ padding: '8px' }}>
              <NumberInput
                label="Iterations"
                value={data.iterations}
                onChange={(value) => handleChange('iterations', value)}
                nodeId={id}
                field="iterations"
                onSelect={data.toggleInputSelection}
                isSelected={isInputSelected('', 'iterations')}
              />
              <NumberInput
                label="Spacing"
                value={data.spacing}
                onChange={(value) => handleChange('spacing', value)}
                nodeId={id}
                field="spacing"
                onSelect={data.toggleInputSelection}
                isSelected={isInputSelected('', 'spacing')}
              />
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <label style={{ fontSize: '14px', color: '#1f2937', marginRight: '8px' }}>Direction:</label>
                <select
                  value={data.direction}
                  onChange={(e) => handleChange('direction', e.target.value as Direction)}
                  style={selectStyles}
                >
                  <option value="x">X</option>
                  <option value="y">Y</option>
                  <option value="z">Z</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{
          marginBottom: '8px',
          background: 'rgba(0,0,0,0.03)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div 
            onClick={() => setExpandedSection(expandedSection === 'transform' ? null : 'transform')}
            style={{
              padding: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              borderBottom: expandedSection === 'transform' ? '1px solid rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <span style={{ 
              fontSize: '14px',
              fontWeight: 500,
              color: '#1f2937'
            }}>
              Transform
            </span>
            <span style={{ 
              transform: expandedSection === 'transform' ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s'
            }}>
              ▼
            </span>
          </div>
          
          {expandedSection === 'transform' && (
            <div style={{ padding: '8px' }}>
              {renderSection('Position', data.position, 'position', handlePositionChange)}
              {renderSection('Rotation', data.rotation, 'rotation', handleRotationChange)}
              {renderSection('Scale', data.scale, 'scale', handleScaleChange)}
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default LoopNode;
