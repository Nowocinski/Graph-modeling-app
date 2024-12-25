'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface SubtractNodeData {
  onDelete?: (id: string) => void;
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

const SubtractNode = ({ data, id }: { data: SubtractNodeData; id: string }) => {
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div style={{ 
      padding: '16px', 
      borderRadius: '8px', 
      background: 'white', 
      border: '1px solid #e2e8f0',
      position: 'relative',
      width: '200px'
    }}>
      <Handle 
        type="target" 
        position={Position.Left} 
        id="meshA"
        style={{ top: '40%', background: '#64748b' }}
      />
      <Handle 
        type="target" 
        position={Position.Left}
        id="meshB"
        style={{ top: '60%', background: '#64748b' }}
      />
      <Handle type="source" position={Position.Right} />
      
      <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>Subtract Operation</div>
      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
        Subtracts Mesh B from Mesh A
      </div>
      
      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
        Mesh A (top input)
      </div>
      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
        Mesh B (bottom input)
      </div>

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
    </div>
  );
};

export default memo(SubtractNode);
