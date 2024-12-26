import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import NumberInput from '../../inputs/NumberInput';

interface BulkEditNodeProps {
  id: string;
  data: {
    value: number;
    connectedInputs: Array<{
      nodeId: string;
      field: string;
      nodeName?: string; // Nazwa node'a (np. "Box", "Sphere")
    }>;
    onUpdate: (id: string, data: any) => void;
    onDelete?: () => void;
    onIdChange?: (oldId: string, newId: string) => void;
  };
}

const BulkEditNode: React.FC<BulkEditNodeProps> = ({ id, data }) => {
  const { value, onUpdate, onDelete, connectedInputs, onIdChange } = data;
  const [isExpanded, setIsExpanded] = useState(false);
  const [nodeId, setNodeId] = useState(id);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (newValue: number) => {
    onUpdate(id, { value: newValue });
    
    // Aktualizuj wszystkie połączone inputy
    connectedInputs.forEach(input => {
      const [category, field] = input.field.split('.');
      if (field) {
        // Dla zagnieżdżonych właściwości (np. position.x)
        onUpdate(input.nodeId, {
          [category]: {
            [field]: newValue
          }
        });
      } else {
        // Dla prostych właściwości
        onUpdate(input.nodeId, { [category]: newValue });
      }
    });
  };

  const handleIdChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const newId = e.target.value.trim();
    if (newId && newId !== id && onIdChange) {
      onIdChange(id, newId);
      setNodeId(newId);
    }
    setIsEditing(false);
  };

  // Funkcja pomocnicza do formatowania nazwy pola
  const formatFieldName = (field: string) => {
    return field.charAt(0).toUpperCase() + field.slice(1);
  };

  // Funkcja pomocnicza do formatowania nazwy node'a
  const formatNodeName = (nodeId: string, nodeName?: string) => {
    if (nodeName) return nodeName;
    const type = nodeId.split('-')[0];
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="node-box" style={{
      background: '#fef3c7',
      border: '1px solid #fbbf24',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '200px',
    }}>
      <div style={{ marginBottom: '8px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          {isEditing ? (
            <input
              type="text"
              defaultValue={nodeId}
              onBlur={handleIdChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              autoFocus
              style={{
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '4px',
                color: '#e5e7eb',
                padding: '2px 4px',
                fontSize: '14px',
                width: '120px'
              }}
            />
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              style={{ 
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#1e293b',
                background: '#fef3c7',
                border: '1px solid transparent',
                width: 'fit-content'
              }}
              title="Kliknij aby edytować ID"
            >
              {nodeId}
            </div>
          )}
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none'
          }} onClick={() => setIsExpanded(!isExpanded)}>
            <span>Connected inputs: {connectedInputs.length}</span>
            <span style={{ 
              transform: isExpanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s'
            }}>▼</span>
          </div>
          
          {isExpanded && (
            <div style={{
              marginTop: '8px',
              borderTop: '1px solid rgba(0,0,0,0.1)',
              paddingTop: '8px'
            }}>
              {connectedInputs.map((input, index) => (
                <div key={index} style={{
                  padding: '4px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#6b7280',
                  borderBottom: index < connectedInputs.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                }}>
                  <span style={{ fontWeight: 500 }}>
                    {formatNodeName(input.nodeId, input.nodeName)}
                  </span>
                  <span style={{ 
                    background: '#e5e7eb',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px'
                  }}>
                    {formatFieldName(input.field)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkEditNode;
