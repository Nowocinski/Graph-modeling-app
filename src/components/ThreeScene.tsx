'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const sceneStyles = {
  width: '100vw',
  height: '100vh',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  position: 'fixed' as const,
  top: 0,
  left: 0,
  display: 'block'
};

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Initial update
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    
    rendererRef.current = renderer;
    
    // Set initial size
    const updateSize = () => {
      if (!mountRef.current) return;
      
      // Update camera
      camera.aspect = dimensions.width / dimensions.height;
      camera.updateProjectionMatrix();
      
      // Update renderer
      renderer.setSize(dimensions.width, dimensions.height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    // Initialize renderer
    updateSize();
    mountRef.current.appendChild(renderer.domElement);

    // Add a simple cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00ff00,
      shininess: 60,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add lights
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Position camera
    camera.position.z = 5;

    // Animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate cube
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [dimensions]); // Re-run effect when dimensions change

  return <div ref={mountRef} style={sceneStyles} />;
}
