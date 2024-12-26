import { useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import defaultGraph from '../graphs/default.json';

export const useGraphManager = () => {
  const [graphs, setGraphs] = useState<{ [key: string]: { nodes: Node[]; edges: Edge[] } }>({
    default: defaultGraph
  });
  const [currentGraph, setCurrentGraph] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wczytaj grafy przy starcie
  useEffect(() => {
    const fetchGraphs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/graphs');
        if (!response.ok) throw new Error('Failed to fetch graphs');
        const data = await response.json();
        setGraphs(prev => ({ ...prev, ...data }));
      } catch (err) {
        setError(err.message);
        console.error('Error loading graphs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraphs();
  }, []);

  // Zapisz nowy lub nadpisz istniejący graf
  const saveGraph = async (name: string, nodes: Node[], edges: Edge[], overwrite = false) => {
    if (name === 'default') {
      setError('Nie można nadpisać domyślnego grafu');
      return false;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/graphs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          data: { nodes, edges },
          overwrite
        })
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error === 'Graph already exists' && !overwrite) {
          setError('Graf o tej nazwie już istnieje. Czy chcesz go nadpisać?');
          return false;
        }
        throw new Error(data.error || 'Failed to save graph');
      }

      setGraphs(prev => ({
        ...prev,
        [name]: { nodes, edges }
      }));
      
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error saving graph:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
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
  const deleteGraph = async (name: string) => {
    if (name === 'default') return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/graphs?name=${name}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete graph');

      const newGraphs = { ...graphs };
      delete newGraphs[name];
      setGraphs(newGraphs);

      if (currentGraph === name) {
        setCurrentGraph('default');
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting graph:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Lista dostępnych grafów
  const getGraphList = () => Object.keys(graphs);

  return {
    currentGraph,
    saveGraph,
    loadGraph,
    deleteGraph,
    getGraphList,
    isLoading,
    error
  };
};
