import React from 'react';
import { Handle, Position } from 'reactflow';

const CapsuleGeometryNode = ({ data }) => {
  return (
    <div className="capsule-geometry-node">
      <div>Capsule Geometry</div>
      <div>Radius: {data.radius}</div>
      <div>Length: {data.length}</div>
      <div>Cap Segments: {data.capSegments}</div>
      <div>Radial Segments: {data.radialSegments}</div>
      <Handle type="source" position={Position.Right} id="geometry" />
    </div>
  );
};

export default CapsuleGeometryNode;
