'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls.js';
import { useScene } from '../context/SceneContext';

const sceneStyles = {
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  position: 'relative' as const,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const createGeometry = (geometryNode: any): THREE.BufferGeometry => {
  const nodeType = geometryNode.type.toLowerCase();
  console.log('Creating geometry for node:', { type: nodeType, data: geometryNode.data });

  if (nodeType.includes('box')) {
    return new THREE.BoxGeometry(
      geometryNode.data.width,
      geometryNode.data.height,
      geometryNode.data.depth
    );
  } 
  
  if (nodeType.includes('sphere')) {
    console.log('Creating sphere geometry with:', geometryNode.data);
    return new THREE.SphereGeometry(
      geometryNode.data.radius,
      geometryNode.data.widthSegments,
      geometryNode.data.heightSegments
    );
  }
  
  if (nodeType.includes('cylinder')) {
    return new THREE.CylinderGeometry(
      geometryNode.data.radiusTop,
      geometryNode.data.radiusBottom,
      geometryNode.data.height,
      geometryNode.data.radialSegments,
      geometryNode.data.heightSegments,
      geometryNode.data.openEnded
    );
  }

  if (nodeType.includes('capsule')) {
    return new THREE.CapsuleGeometry(
      geometryNode.data.radius,
      geometryNode.data.length,
      geometryNode.data.capSegments,
      geometryNode.data.radialSegments
    );
  }

  if (nodeType.includes('circle')) {
    return new THREE.CircleGeometry(
      geometryNode.data.radius,
      geometryNode.data.segments
    );
  }

  console.warn('Unknown geometry type:', geometryNode.type);
  return new THREE.BoxGeometry(1, 1, 1);
};

const createMaterial = (materialNode: any): THREE.Material => {
  switch (materialNode.type) {
    case 'meshNormalMaterial':
      return new THREE.MeshNormalMaterial({
        wireframe: materialNode.data.wireframe,
        transparent: materialNode.data.transparent,
        opacity: materialNode.data.opacity
      });
    case 'meshBasicMaterial':
      return new THREE.MeshBasicMaterial({
        color: materialNode.data.color,
        wireframe: materialNode.data.wireframe,
        transparent: materialNode.data.transparent,
        opacity: materialNode.data.opacity,
        visible: materialNode.data.visible,
        side: materialNode.data.side === 'front' 
          ? THREE.FrontSide 
          : materialNode.data.side === 'back' 
            ? THREE.BackSide 
            : THREE.DoubleSide
      });
    case 'meshPhongMaterial':
      return new THREE.MeshPhongMaterial({
        color: materialNode.data.color,
        emissive: materialNode.data.emissive,
        specular: materialNode.data.specular,
        shininess: materialNode.data.shininess,
        wireframe: materialNode.data.wireframe,
        transparent: materialNode.data.transparent,
        opacity: materialNode.data.opacity,
        visible: materialNode.data.visible,
        side: materialNode.data.side === 'front' 
          ? THREE.FrontSide 
          : materialNode.data.side === 'back' 
            ? THREE.BackSide 
            : THREE.DoubleSide,
        flatShading: materialNode.data.flatShading
      });
    default:
      console.warn('Unknown material type:', materialNode.type);
      return new THREE.MeshNormalMaterial();
  }
};

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const objectsRef = useRef<{ [key: string]: THREE.Object3D }>({});
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const { nodes, edges } = useScene();

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    rendererRef.current = renderer;
    
    const controls = new OrbitControlsImpl(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controlsRef.current = controls;

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    mountRef.current.appendChild(renderer.domElement);

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Handle resize
  useEffect(() => {
    if (!rendererRef.current || !cameraRef.current) return;

    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    camera.aspect = dimensions.width / dimensions.height;
    camera.updateProjectionMatrix();

    renderer.setSize(dimensions.width, dimensions.height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [dimensions]);

  // Update scene based on nodes
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const sceneNode = nodes.find(node => node.type === 'scene');
    
    // Funkcja sprawdzająca, czy node jest połączony ze sceną
    const isConnectedToScene = (nodeId: string, visited = new Set<string>()): boolean => {
      if (visited.has(nodeId)) return false;
      visited.add(nodeId);

      // Znajdź wszystkie krawędzie wychodzące z tego node'a
      const nodeEdges = edges.filter(edge => edge.source === nodeId);
      
      for (const edge of nodeEdges) {
        const targetNode = nodes.find(node => node.id === edge.target);
        if (targetNode?.type === 'scene') {
          return true;
        }
        if (isConnectedToScene(edge.target, visited)) {
          return true;
        }
      }
      
      return false;
    };

    // Update scene settings
    if (sceneNode) {
      scene.background = new THREE.Color(sceneNode.data.backgroundColor);
      
      // Update lights
      scene.children
        .filter(child => child.type.includes('Light'))
        .forEach(child => scene.remove(child));

      const ambientLight = new THREE.AmbientLight(0xffffff, sceneNode.data.ambientLightIntensity);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, sceneNode.data.pointLightIntensity);
      const { x, y, z } = sceneNode.data.pointLightPosition;
      pointLight.position.set(x, y, z);
      scene.add(pointLight);
    }

    // Clean up removed or disconnected meshes
    Object.entries(objectsRef.current).forEach(([id, object]) => {
      const node = nodes.find(node => node.id === id);
      if (!node || !isConnectedToScene(id)) {
        scene.remove(object);
        delete objectsRef.current[id];
      }
    });

    // Update or create meshes
    const meshNodes = nodes.filter(node => node.type === 'mesh');
    meshNodes.forEach(meshNode => {
      // Sprawdź czy mesh jest połączony ze sceną
      if (!isConnectedToScene(meshNode.id)) {
        // Jeśli nie jest połączony, usuń go ze sceny
        if (objectsRef.current[meshNode.id]) {
          scene.remove(objectsRef.current[meshNode.id]);
          delete objectsRef.current[meshNode.id];
        }
        return;
      }

      // Znajdź połączone geometry i material nodes
      const geometryEdge = edges.find(edge => edge.target === meshNode.id && edge.targetHandle === 'geometry');
      const materialEdge = edges.find(edge => edge.target === meshNode.id && edge.targetHandle === 'material');

      const geometryNode = nodes.find(node => node.id === geometryEdge?.source);
      const materialNode = nodes.find(node => node.id === materialEdge?.source);

      if (geometryNode && materialNode) {
        let mesh = objectsRef.current[meshNode.id] as THREE.Mesh;

        // Sprawdź czy mesh istnieje
        if (!mesh) {
          const geometry = createGeometry(geometryNode);
          const material = createMaterial(materialNode);
          mesh = new THREE.Mesh(geometry, material);
          objectsRef.current[meshNode.id] = mesh;
          scene.add(mesh);
        } else {
          // Aktualizuj geometrię i materiał
          const newGeometry = createGeometry(geometryNode);
          const newMaterial = createMaterial(materialNode);

          // Usuń starą geometrię i materiał
          mesh.geometry.dispose();
          if (mesh.material instanceof THREE.Material) {
            mesh.material.dispose();
          }

          // Przypisz nową geometrię i materiał
          mesh.geometry = newGeometry;
          mesh.material = newMaterial;
        }

        // Update position
        mesh.position.set(
          meshNode.data.position.x,
          meshNode.data.position.y,
          meshNode.data.position.z
        );

        // Update rotation
        mesh.rotation.set(
          meshNode.data.rotation.x,
          meshNode.data.rotation.y,
          meshNode.data.rotation.z
        );

        // Update scale
        mesh.scale.set(
          meshNode.data.scale.x,
          meshNode.data.scale.y,
          meshNode.data.scale.z
        );
      }
    });
  }, [nodes, edges]);

  // Animation
  useEffect(() => {
    const animate = () => {
      const animationFrameId = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    };

    animate();
  }, []);

  return <div ref={mountRef} style={sceneStyles} />;
}
