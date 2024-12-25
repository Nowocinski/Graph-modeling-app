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
    const meshNodes = nodes.filter(node => node.type === 'mesh');

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

    // Update meshes
    meshNodes.forEach(meshNode => {
      const geometryConnection = edges.find(edge => edge.target === meshNode.id && edge.targetHandle === 'geometry');
      const materialConnection = edges.find(edge => edge.target === meshNode.id && edge.targetHandle === 'material');

      if (geometryConnection && materialConnection) {
        const geometryNode = nodes.find(node => node.id === geometryConnection.source);
        const materialNode = nodes.find(node => node.id === materialConnection.source);

        if (geometryNode && materialNode) {
          let mesh = objectsRef.current[meshNode.id] as THREE.Mesh;

          if (!mesh) {
            const geometry = new THREE.BoxGeometry(
              geometryNode.data.width,
              geometryNode.data.height,
              geometryNode.data.depth
            );

            const material = new THREE.MeshNormalMaterial({
              wireframe: materialNode.data.wireframe,
              transparent: materialNode.data.transparent,
              opacity: materialNode.data.opacity
            });

            mesh = new THREE.Mesh(geometry, material);
            objectsRef.current[meshNode.id] = mesh;
            scene.add(mesh);
          } else {
            // Update existing mesh
            const geometry = mesh.geometry as THREE.BoxGeometry;
            geometry.dispose();
            mesh.geometry = new THREE.BoxGeometry(
              geometryNode.data.width,
              geometryNode.data.height,
              geometryNode.data.depth
            );

            const material = mesh.material as THREE.MeshNormalMaterial;
            material.wireframe = materialNode.data.wireframe;
            material.transparent = materialNode.data.transparent;
            material.opacity = materialNode.data.opacity;
          }

          // Update transform
          mesh.position.set(
            meshNode.data.position.x,
            meshNode.data.position.y,
            meshNode.data.position.z
          );
          mesh.rotation.set(
            meshNode.data.rotation.x,
            meshNode.data.rotation.y,
            meshNode.data.rotation.z
          );
          mesh.scale.set(
            meshNode.data.scale.x,
            meshNode.data.scale.y,
            meshNode.data.scale.z
          );
        }
      }
    });

    // Animation
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
  }, [nodes, edges]);

  return <div ref={mountRef} style={sceneStyles} />;
}
