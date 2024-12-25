'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface UnionNodeData {
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

const UnionNode = ({ data, id }: { data: UnionNodeData; id: string }) => {
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
      <Handle 
        type="source" 
        position={Position.Right} 
        id="output"
        style={{ background: '#64748b' }}
      />
      
      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#1e293b' }}>
        Union Operation
      </div>
      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
        First Mesh (A)
      </div>
      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
        Second Mesh (B)
      </div>
      <div style={{ fontSize: '12px', color: '#64748b' }}>
        Result: A ∪ B
      </div>

      <button onClick={handleDelete} style={deleteButtonStyles}>
        ✕
      </button>
    </div>
  );
};

export default memo(UnionNode);
