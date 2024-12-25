'use client';

import { createContext, useContext, useState } from 'react';
import { Node, Edge } from 'reactflow';

interface SceneContextType {
  nodes: Node[];
  edges: Edge[];
  updateNodes: (nodes: Node[]) => void;
  updateEdges: (edges: Edge[]) => void;
  updateSceneState: (nodes: Node[], edges: Edge[]) => void;
}

const SceneContext = createContext<SceneContextType | undefined>(undefined);

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const updateNodes = (newNodes: Node[]) => {
    setNodes(newNodes);
  };

  const updateEdges = (newEdges: Edge[]) => {
    setEdges(newEdges);
  };

  const updateSceneState = (newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <SceneContext.Provider value={{ 
      nodes, 
      edges, 
      updateNodes, 
      updateEdges,
      updateSceneState 
    }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);
  if (context === undefined) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return context;
}
