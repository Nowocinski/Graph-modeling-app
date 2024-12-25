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
  const nodeType = geometryNode.type;
  console.log('Creating geometry for node type:', nodeType);
  console.log('Node data:', geometryNode.data);

  if (!geometryNode.data) {
    console.warn('No data for geometry node:', nodeType);
    return new THREE.BoxGeometry(1, 1, 1);
  }

  if (nodeType === 'boxGeometry') {
    console.log('Creating BoxGeometry with params:', {
      width: geometryNode.data.width,
      height: geometryNode.data.height,
      depth: geometryNode.data.depth
    });
    return new THREE.BoxGeometry(
      geometryNode.data.width,
      geometryNode.data.height,
      geometryNode.data.depth
    );
  } 
  
  if (nodeType === 'sphereGeometry') {
    console.log('Creating SphereGeometry with params:', {
      radius: geometryNode.data.radius,
      widthSegments: geometryNode.data.widthSegments,
      heightSegments: geometryNode.data.heightSegments
    });
    return new THREE.SphereGeometry(
      geometryNode.data.radius,
      geometryNode.data.widthSegments,
      geometryNode.data.heightSegments
    );
  }
  
  if (nodeType === 'cylinderGeometry') {
    console.log('Creating CylinderGeometry with params:', {
      radiusTop: geometryNode.data.radiusTop,
      radiusBottom: geometryNode.data.radiusBottom,
      height: geometryNode.data.height,
      radialSegments: geometryNode.data.radialSegments,
      heightSegments: geometryNode.data.heightSegments,
      openEnded: geometryNode.data.openEnded
    });
    return new THREE.CylinderGeometry(
      geometryNode.data.radiusTop,
      geometryNode.data.radiusBottom,
      geometryNode.data.height,
      geometryNode.data.radialSegments,
      geometryNode.data.heightSegments,
      geometryNode.data.openEnded
    );
  }

  if (nodeType === 'capsuleGeometry') {
    console.log('Creating CapsuleGeometry with params:', {
      radius: geometryNode.data.radius,
      length: geometryNode.data.length,
      capSegments: geometryNode.data.capSegments,
      radialSegments: geometryNode.data.radialSegments
    });
    return new THREE.CapsuleGeometry(
      geometryNode.data.radius,
      geometryNode.data.length,
      geometryNode.data.capSegments,
      geometryNode.data.radialSegments
    );
  }

  if (nodeType === 'circleGeometry') {
    console.log('Creating CircleGeometry with params:', {
      radius: geometryNode.data.radius,
      segments: geometryNode.data.segments
    });
    return new THREE.CircleGeometry(
      geometryNode.data.radius,
      geometryNode.data.segments
    );
  }

  if (nodeType === 'coneGeometry') {
    console.log('Creating ConeGeometry with params:', {
      radius: geometryNode.data.radius,
      height: geometryNode.data.height,
      radialSegments: geometryNode.data.radialSegments,
      heightSegments: geometryNode.data.heightSegments,
      openEnded: geometryNode.data.openEnded
    });
    return new THREE.ConeGeometry(
      geometryNode.data.radius,
      geometryNode.data.height,
      geometryNode.data.radialSegments,
      geometryNode.data.heightSegments,
      geometryNode.data.openEnded
    );
  }

  if (nodeType === 'dodecahedronGeometry') {
    console.log('Creating DodecahedronGeometry with params:', {
      radius: geometryNode.data.radius,
      detail: geometryNode.data.detail
    });
    return new THREE.DodecahedronGeometry(
      geometryNode.data.radius,
      geometryNode.data.detail
    );
  }

  if (nodeType === 'icosahedronGeometry') {
    console.log('Creating IcosahedronGeometry with params:', {
      radius: geometryNode.data.radius,
      detail: geometryNode.data.detail
    });
    return new THREE.IcosahedronGeometry(
      geometryNode.data.radius,
      geometryNode.data.detail
    );
  }

  if (nodeType === 'octahedronGeometry') {
    console.log('Creating OctahedronGeometry with params:', {
      radius: geometryNode.data.radius,
      detail: geometryNode.data.detail
    });
    return new THREE.OctahedronGeometry(
      geometryNode.data.radius,
      geometryNode.data.detail
    );
  }

  if (nodeType === 'planeGeometry') {
    console.log('Creating PlaneGeometry with params:', {
      width: geometryNode.data.width,
      height: geometryNode.data.height,
      widthSegments: geometryNode.data.widthSegments,
      heightSegments: geometryNode.data.heightSegments
    });
    return new THREE.PlaneGeometry(
      geometryNode.data.width,
      geometryNode.data.height,
      geometryNode.data.widthSegments,
      geometryNode.data.heightSegments
    );
  }

  if (nodeType === 'ringGeometry') {
    console.log('Creating RingGeometry with params:', {
      innerRadius: geometryNode.data.innerRadius,
      outerRadius: geometryNode.data.outerRadius,
      thetaSegments: geometryNode.data.thetaSegments,
      phiSegments: geometryNode.data.phiSegments,
      thetaStart: geometryNode.data.thetaStart,
      thetaLength: geometryNode.data.thetaLength
    });
    return new THREE.RingGeometry(
      geometryNode.data.innerRadius,
      geometryNode.data.outerRadius,
      geometryNode.data.thetaSegments,
      geometryNode.data.phiSegments,
      geometryNode.data.thetaStart,
      geometryNode.data.thetaLength
    );
  }

  if (nodeType === 'tetrahedronGeometry') {
    console.log('Creating TetrahedronGeometry with params:', {
      radius: geometryNode.data.radius,
      detail: geometryNode.data.detail
    });
    return new THREE.TetrahedronGeometry(
      geometryNode.data.radius,
      geometryNode.data.detail
    );
  }

  if (nodeType === 'torusKnotGeometry') {
    console.log('Creating TorusKnotGeometry with params:', {
      radius: geometryNode.data.radius,
      tube: geometryNode.data.tube,
      tubularSegments: geometryNode.data.tubularSegments,
      radialSegments: geometryNode.data.radialSegments,
      p: geometryNode.data.p,
      q: geometryNode.data.q
    });
    return new THREE.TorusKnotGeometry(
      geometryNode.data.radius,
      geometryNode.data.tube,
      geometryNode.data.tubularSegments,
      geometryNode.data.radialSegments,
      geometryNode.data.p,
      geometryNode.data.q
    );
  }

  if (nodeType === 'torusGeometry') {
    console.log('Creating TorusGeometry with params:', {
      radius: geometryNode.data.radius,
      tube: geometryNode.data.tube,
      radialSegments: geometryNode.data.radialSegments,
      tubularSegments: geometryNode.data.tubularSegments,
      arc: geometryNode.data.arc
    });
    return new THREE.TorusGeometry(
      geometryNode.data.radius,
      geometryNode.data.tube,
      geometryNode.data.radialSegments,
      geometryNode.data.tubularSegments,
      geometryNode.data.arc
    );
  }

  if (nodeType === 'tubeGeometry') {
    // Create a custom curve (helix)
    class CustomCurve extends THREE.Curve<THREE.Vector3> {
      private scale: number;
      
      constructor(scale = 1) {
        super();
        this.scale = scale;
      }

      getPoint(t: number): THREE.Vector3 {
        const tx = Math.sin(2 * Math.PI * t);
        const ty = t * 2 - 1; // Move up as we go around
        const tz = Math.cos(2 * Math.PI * t);

        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path = new CustomCurve(geometryNode.data.radius);
    
    return new THREE.TubeGeometry(
      path,
      geometryNode.data.tubularSegments,
      geometryNode.data.tubeRadius,
      geometryNode.data.radialSegments,
      geometryNode.data.closed
    );
  }

  if (nodeType === 'latheGeometry') {
    // Create a default profile shape for the lathe
    const points = [];
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      const x = 0.5 + Math.sin(t * Math.PI) * 0.25; // Creates a curved profile
      const y = t - 0.5;
      points.push(new THREE.Vector2(x, y));
    }

    console.log('Creating LatheGeometry with params:', {
      points: points,
      segments: geometryNode.data.segments,
      phiStart: geometryNode.data.phiStart,
      phiLength: geometryNode.data.phiLength
    });
    return new THREE.LatheGeometry(
      points,
      geometryNode.data.segments,
      geometryNode.data.phiStart,
      geometryNode.data.phiLength
    );
  }

  if (nodeType === 'extrudeGeometry') {
    // Create a default shape (heart shape) for extrusion
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0, 0.5, -0.5, 1, -1, 1);
    shape.bezierCurveTo(-1.5, 1, -2, 0.5, -2, 0);
    shape.bezierCurveTo(-2, -0.5, -1.5, -1.5, 0, -2);
    shape.bezierCurveTo(1.5, -1.5, 2, -0.5, 2, 0);
    shape.bezierCurveTo(2, 0.5, 1.5, 1, 1, 1);
    shape.bezierCurveTo(0.5, 1, 0, 0.5, 0, 0);

    const extrudeSettings = {
      depth: geometryNode.data.depth,
      bevelEnabled: geometryNode.data.bevelEnabled,
      bevelThickness: geometryNode.data.bevelThickness,
      bevelSize: geometryNode.data.bevelSize,
      bevelSegments: geometryNode.data.bevelSegments,
      steps: geometryNode.data.steps
    };

    console.log('Creating ExtrudeGeometry with params:', {
      shape: shape,
      extrudeSettings: extrudeSettings
    });
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }

  console.warn('Unknown geometry type:', geometryNode.type);
  return new THREE.BoxGeometry(1, 1, 1);
};

const createMaterial = (materialNode: any): THREE.Material => {
  const getSide = (side: string) => {
    switch (side) {
      case 'front':
        return THREE.FrontSide;
      case 'back':
        return THREE.BackSide;
      case 'double':
        return THREE.DoubleSide;
      default:
        return THREE.FrontSide;
    }
  };

  switch (materialNode.type) {
    case 'meshNormalMaterial':
      return new THREE.MeshNormalMaterial({
        wireframe: materialNode.data.wireframe,
        transparent: materialNode.data.transparent,
        opacity: materialNode.data.opacity,
        side: getSide(materialNode.data.side)
      });
    case 'meshBasicMaterial':
      return new THREE.MeshBasicMaterial({
        color: materialNode.data.color,
        wireframe: materialNode.data.wireframe,
        transparent: materialNode.data.transparent,
        opacity: materialNode.data.opacity,
        visible: materialNode.data.visible,
        side: getSide(materialNode.data.side)
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
        side: getSide(materialNode.data.side),
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
