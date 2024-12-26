import { Handle, Position } from "reactflow";
import { useCallback } from "react";

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
}

interface LoopNodeProps {
  data: LoopNodeData;
  id: string;
}

const inputStyles = {
  width: '60px',
  padding: '2px 4px',
  fontSize: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginLeft: '8px'
};

const selectStyles = {
  padding: '2px 4px',
  fontSize: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginLeft: '8px',
  background: 'white'
};

const labelStyles = {
  fontSize: '12px',
  color: '#666'
};

const rowStyles = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px'
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

export const LoopNode = ({ data, id }: LoopNodeProps) => {
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

  const handlePositionChange = useCallback((axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0;
    handleChange('position', { ...data.position, [axis]: numValue });
  }, [data.position, handleChange]);

  const handleRotationChange = useCallback((axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0;
    handleChange('rotation', { ...data.rotation, [axis]: numValue });
  }, [data.rotation, handleChange]);

  const handleScaleChange = useCallback((axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 1;
    handleChange('scale', { ...data.scale, [axis]: numValue });
  }, [data.scale, handleChange]);

  return (
    <div className="node-container">
      <Handle 
        type="target" 
        position={Position.Left} 
        id="input"
        style={{ background: '#64748b' }}
      />
      
      <div style={{ padding: '12px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Loop</h4>
        
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

        <div style={rowStyles}>
          <label style={labelStyles}>Iterations:</label>
          <input
            type="number"
            style={inputStyles}
            value={data.iterations}
            onChange={(e) => handleChange('iterations', Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
          />
        </div>
        
        <div style={rowStyles}>
          <label style={labelStyles}>Spacing:</label>
          <input
            type="number"
            style={inputStyles}
            value={data.spacing}
            onChange={(e) => handleChange('spacing', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div style={rowStyles}>
          <label style={labelStyles}>Direction:</label>
          <select
            style={selectStyles}
            value={data.direction}
            onChange={(e) => handleChange('direction', e.target.value as Direction)}
          >
            <option value="x">X Axis</option>
            <option value="y">Y Axis</option>
            <option value="z">Z Axis</option>
          </select>
        </div>

        <div style={{ marginTop: '12px' }}>
          <div style={rowStyles}>
            <label style={labelStyles}>Position:</label>
            <input
              type="number"
              style={inputStyles}
              value={data.position.x}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              placeholder="X"
            />
            <input
              type="number"
              style={inputStyles}
              value={data.position.y}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              placeholder="Y"
            />
            <input
              type="number"
              style={inputStyles}
              value={data.position.z}
              onChange={(e) => handlePositionChange('z', e.target.value)}
              placeholder="Z"
            />
          </div>

          <div style={rowStyles}>
            <label style={labelStyles}>Rotation:</label>
            <input
              type="number"
              style={inputStyles}
              value={data.rotation.x}
              onChange={(e) => handleRotationChange('x', e.target.value)}
              placeholder="X"
            />
            <input
              type="number"
              style={inputStyles}
              value={data.rotation.y}
              onChange={(e) => handleRotationChange('y', e.target.value)}
              placeholder="Y"
            />
            <input
              type="number"
              style={inputStyles}
              value={data.rotation.z}
              onChange={(e) => handleRotationChange('z', e.target.value)}
              placeholder="Z"
            />
          </div>

          <div style={rowStyles}>
            <label style={labelStyles}>Scale:</label>
            <input
              type="number"
              style={inputStyles}
              value={data.scale.x}
              onChange={(e) => handleScaleChange('x', e.target.value)}
              placeholder="X"
            />
            <input
              type="number"
              style={inputStyles}
              value={data.scale.y}
              onChange={(e) => handleScaleChange('y', e.target.value)}
              placeholder="Y"
            />
            <input
              type="number"
              style={inputStyles}
              value={data.scale.z}
              onChange={(e) => handleScaleChange('z', e.target.value)}
              placeholder="Z"
            />
          </div>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        id="output"
        style={{ background: '#64748b' }}
      />
    </div>
  );
};

export default LoopNode;
