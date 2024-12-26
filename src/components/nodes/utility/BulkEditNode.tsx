import React from 'react';
import { Handle, Position } from 'reactflow';
import NumberInput from '../../inputs/NumberInput';

interface BulkEditNodeProps {
  id: string;
  data: {
    value: number;
    connectedInputs: Array<{
      nodeId: string;
      field: string;
    }>;
    onUpdate: (id: string, data: any) => void;
    onDelete?: () => void;
  };
}

const BulkEditNode: React.FC<BulkEditNodeProps> = ({ id, data }) => {
  const { value, onUpdate, onDelete, connectedInputs } = data;

  const handleChange = (newValue: number) => {
    onUpdate(id, { value: newValue });
    
    // Aktualizuj wszystkie połączone inputy
    connectedInputs.forEach(input => {
      onUpdate(input.nodeId, { [input.field]: newValue });
    });
  };

  return (
    <div className="node-box" style={{
      background: '#fef3c7',
      border: '1px solid #fbbf24',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '200px',
    }}>
      <Handle type="source" position={Position.Right} />
      
      <div style={{ marginBottom: '8px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <strong style={{ color: '#1e293b' }}>Bulk Edit Node</strong>
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

        <NumberInput
          label="Value"
          value={value}
          onChange={handleChange}
          nodeId={id}
          field="value"
        />

        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: 'rgba(0,0,0,0.05)',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#4b5563'
        }}>
          Connected inputs: {connectedInputs.length}
        </div>
      </div>
    </div>
  );
};

export default BulkEditNode;
