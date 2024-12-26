import { useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import defaultGraph from '../graphs/default.json';

export const useGraphManager = () => {
  const [graphs, setGraphs] = useState<{ [key: string]: { nodes: Node[]; edges: Edge[] } }>({
    default: defaultGraph
  });
  const [currentGraph, setCurrentGraph] = useState('default');

  // Wczytaj grafy z localStorage przy starcie
  useEffect(() => {
    const savedGraphs = localStorage.getItem('savedGraphs');
    if (savedGraphs) {
      try {
        const parsedGraphs = JSON.parse(savedGraphs);
        setGraphs(prev => ({ ...prev, ...parsedGraphs }));
      } catch (e) {
        console.error('Error loading saved graphs:', e);
      }
    }
  }, []);

  // Zapisz graf
  const saveGraph = (name: string, nodes: Node[], edges: Edge[]) => {
    const newGraphs = {
      ...graphs,
      [name]: { nodes, edges }
    };
    setGraphs(newGraphs);
    localStorage.setItem('savedGraphs', JSON.stringify(newGraphs));
  };

  // Wczytaj graf
  const loadGraph = (name: string) => {
    if (graphs[name]) {
      setCurrentGraph(name);
      return graphs[name];
    }
    return null;
  };

  // Usuń graf
  const deleteGraph = (name: string) => {
    if (name === 'default') return; // Nie pozwól usunąć domyślnego grafu
    const newGraphs = { ...graphs };
    delete newGraphs[name];
    setGraphs(newGraphs);
    localStorage.setItem('savedGraphs', JSON.stringify(newGraphs));
    if (currentGraph === name) {
      setCurrentGraph('default');
    }
  };

  // Lista dostępnych grafów
  const getGraphList = () => Object.keys(graphs);

  return {
    currentGraph,
    saveGraph,
    loadGraph,
    deleteGraph,
    getGraphList
  };
};
