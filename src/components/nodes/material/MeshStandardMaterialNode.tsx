import { Handle, Position } from 'reactflow';
import { NodeProps } from '../../../types/NodeProps';
import { useCallback } from 'react';
import { MeshStandardMaterial } from 'three';

const MeshStandardMaterialNode = ({ data, id }: NodeProps) => {
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = evt.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    data.onChange(id, name, parsedValue);
  }, [data, id]);

  return (
    <div className="node-container">
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-title">MeshStandard Material</div>
        <label>
          Color:
          <input
            type="color"
            name="color"
            value={data.color || '#ffffff'}
            onChange={onChange}
          />
        </label>
        <label>
          Roughness:
          <input
            type="number"
            name="roughness"
            min="0"
            max="1"
            step="0.1"
            value={data.roughness || 0.5}
            onChange={onChange}
          />
        </label>
        <label>
          Metalness:
          <input
            type="number"
            name="metalness"
            min="0"
            max="1"
            step="0.1"
            value={data.metalness || 0.5}
            onChange={onChange}
          />
        </label>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default MeshStandardMaterialNode;
