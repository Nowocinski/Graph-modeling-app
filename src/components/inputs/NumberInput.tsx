import React, { useState } from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  nodeId: string;
  field: string;
  onSelect?: (nodeId: string, field: string, type: string) => void;
  isSelected?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  nodeId,
  field,
  onSelect,
  isSelected = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Lewy przycisk myszy
      setIsDragging(true);
      setStartY(e.clientY);
      setStartValue(value);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaY = startY - e.clientY;
      const newValue = startValue + deltaY * step;
      
      if (typeof min === 'number' && newValue < min) return;
      if (typeof max === 'number' && newValue > max) return;
      
      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(nodeId, field, 'number');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      padding: '4px',
      borderRadius: '4px',
      border: isSelected ? '1px solid #3b82f6' : '1px solid transparent'
    }}>
      <label style={{ 
        minWidth: '80px',
        fontSize: '14px',
        color: '#1e293b'
      }}>
        {label}
      </label>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          cursor: isDragging ? 'ns-resize' : 'pointer',
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={handleRightClick}
      >
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val)) {
              if (typeof min === 'number' && val < min) return;
              if (typeof max === 'number' && val > max) return;
              onChange(val);
            }
          }}
          style={{
            width: '80px',
            padding: '4px 8px',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            color: '#1e293b',
            fontSize: '14px'
          }}
          step={step}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};

export default NumberInput;
