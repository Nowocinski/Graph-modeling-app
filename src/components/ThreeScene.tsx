'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls.js';
import { useScene } from '../context/SceneContext';
import { CSG } from 'three-csg-ts';

const sceneStyles = {
  width: '100%',
  height: '100vh',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  position: 'relative' as const,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f0f0f0'
};

const viewButtonsContainerStyles = {
  position: 'absolute' as const,
  top: '20px',
  right: '20px',
  display: 'grid',
  gridTemplateAreas: `
    ". top ."
    "left center right"
    ". bottom ."
  `,
  gap: '5px',
  zIndex: 1000
};

const buttonStyle = {
  padding: '6px',
  width: '30px',
  height: '30px',
  backgroundColor: '#ffffff',
  border: '1px solid #cccccc',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  color: '#333333',
  transition: 'all 0.2s ease',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ':hover': {
    backgroundColor: '#f0f0f0',
    borderColor: '#999999'
  }
};

const topButtonStyle = { ...buttonStyle, gridArea: 'top' };
const bottomButtonStyle = { ...buttonStyle, gridArea: 'bottom' };
const leftButtonStyle = { ...buttonStyle, gridArea: 'left' };
const rightButtonStyle = { ...buttonStyle, gridArea: 'right' };
const centerButtonStyle = { ...buttonStyle, gridArea: 'center' };

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
  const { nodes, edges } = useScene();
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthographicCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const objectsRef = useRef<{ [key: string]: THREE.Object3D }>({});
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Make scene accessible globally
  useEffect(() => {
    if (sceneRef.current) {
      (window as any).__threeScene = sceneRef.current;
    }
  }, [sceneRef.current]);

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
    if (!containerRef.current || isInitialized) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Perspective camera
    const perspectiveCamera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000);
    perspectiveCamera.position.set(5, 5, 5);
    perspectiveCamera.lookAt(0, 0, 0);
    perspectiveCameraRef.current = perspectiveCamera;

    // Orthographic camera
    const frustumSize = 10;
    const aspect = dimensions.width / dimensions.height;
    const orthographicCamera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    orthographicCamera.position.set(5, 5, 5);
    orthographicCamera.lookAt(0, 0, 0);
    orthographicCameraRef.current = orthographicCamera;

    // Set initial camera
    cameraRef.current = perspectiveCamera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    rendererRef.current = renderer;
    
    const controls = new OrbitControlsImpl(cameraRef.current, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controlsRef.current = controls;

    containerRef.current.appendChild(renderer.domElement);

    setIsInitialized(true);

    return () => {
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Handle resize
  useEffect(() => {
    if (!rendererRef.current || !cameraRef.current) return;

    const aspect = dimensions.width / dimensions.height;
    
    // Update perspective camera
    const perspectiveCamera = perspectiveCameraRef.current;
    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();

    // Update orthographic camera
    const orthographicCamera = orthographicCameraRef.current;
    const frustumSize = 10;
    orthographicCamera.left = frustumSize * aspect / -2;
    orthographicCamera.right = frustumSize * aspect / 2;
    orthographicCamera.top = frustumSize / 2;
    orthographicCamera.bottom = frustumSize / -2;
    orthographicCamera.updateProjectionMatrix();

    // Update renderer
    rendererRef.current.setSize(dimensions.width, dimensions.height);
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
        if (targetNode?.type === 'scene' || targetNode?.type === 'group') {
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

    // Clean up removed or disconnected objects
    Object.entries(objectsRef.current).forEach(([id, object]) => {
      const node = nodes.find(node => node.id === id);
      if (!node || !isConnectedToScene(id)) {
        if (object.parent) {
          object.parent.remove(object);
        }
        delete objectsRef.current[id];
      }
    });

    // Update or create groups
    const groupNodes = nodes.filter(node => node.type === 'group');
    
    // Funkcja do znalezienia rodzica grupy
    const findGroupParent = (groupId: string): THREE.Object3D => {
      const parentEdge = edges.find(edge => edge.source === groupId);
      const parentNode = nodes.find(node => node.id === parentEdge?.target);

      if (parentNode?.type === 'group') {
        return objectsRef.current[parentNode.id] as THREE.Group || scene;
      }
      return scene;
    };

    // Najpierw stwórz wszystkie grupy
    groupNodes.forEach(groupNode => {
      if (!objectsRef.current[groupNode.id]) {
        const group = new THREE.Group();
        objectsRef.current[groupNode.id] = group;
      }
    });

    // Następnie ustaw hierarchię i transformacje
    groupNodes.forEach(groupNode => {
      // Sprawdź czy grupa jest połączona ze sceną
      if (!isConnectedToScene(groupNode.id)) {
        if (objectsRef.current[groupNode.id]) {
          const group = objectsRef.current[groupNode.id];
          if (group.parent) {
            group.parent.remove(group);
          }
          delete objectsRef.current[groupNode.id];
        }
        return;
      }

      const group = objectsRef.current[groupNode.id] as THREE.Group;
      const parent = findGroupParent(groupNode.id);
      
      // Zmień rodzica jeśli potrzeba
      if (group.parent !== parent) {
        if (group.parent) {
          group.parent.remove(group);
        }
        parent.add(group);
      }

      // Aktualizuj transformacje grupy
      group.position.set(
        groupNode.data.position.x,
        groupNode.data.position.y,
        groupNode.data.position.z
      );

      group.rotation.set(
        groupNode.data.rotation.x,
        groupNode.data.rotation.y,
        groupNode.data.rotation.z
      );

      group.scale.set(
        groupNode.data.scale.x,
        groupNode.data.scale.y,
        groupNode.data.scale.z
      );
    });

    // Update or create meshes
    const meshNodes = nodes.filter(node => 
      node.type === 'mesh' || 
      node.type === 'subtract' || 
      node.type === 'intersect' || 
      node.type === 'union' ||
      node.type === 'loop'
    );
    meshNodes.forEach(meshNode => {
      // Sprawdź czy mesh jest połączony ze sceną lub grupą
      if (!isConnectedToScene(meshNode.id)) {
        if (objectsRef.current[meshNode.id]) {
          const mesh = objectsRef.current[meshNode.id];
          if (mesh.parent) {
            mesh.parent.remove(mesh);
          }
          delete objectsRef.current[meshNode.id];
        }
        return;
      }

      // Obsługa node'a subtract
      if (meshNode.type === 'subtract') {
        handleSubtractNode(meshNode, edges, scene, objectsRef.current);
        return;
      }

      // Obsługa node'a intersect
      if (meshNode.type === 'intersect') {
        handleIntersectNode(meshNode, edges, scene, objectsRef.current);
        return;
      }

      // Obsługa node'a union
      if (meshNode.type === 'union') {
        handleUnionNode(meshNode, edges, scene, objectsRef.current);
        return;
      }

      // Obsługa node'a loop
      if (meshNode.type === 'loop') {
        handleLoopNode(meshNode, edges, scene, objectsRef.current);
        return;
      }

      // Standardowa obsługa zwykłych meshy
      processMeshNode(meshNode, scene);
    });

    // Obsługa AxesHelper i GridHelper
    if (sceneNode) {
      // AxesHelper
      if (sceneNode.data.showAxesHelper && !axesHelperRef.current) {
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        axesHelperRef.current = axesHelper;
      } else if (!sceneNode.data.showAxesHelper && axesHelperRef.current) {
        scene.remove(axesHelperRef.current);
        axesHelperRef.current = null;
      }

      // GridHelper
      if (sceneNode.data.showGridHelper && !gridHelperRef.current) {
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);
        gridHelperRef.current = gridHelper;
      } else if (!sceneNode.data.showGridHelper && gridHelperRef.current) {
        scene.remove(gridHelperRef.current);
        gridHelperRef.current = null;
      }
    }
  }, [nodes, edges]);

  // Funkcja obsługująca operację subtract
  const handleSubtractNode = (
    meshNode: any, 
    edges: any[], 
    scene: THREE.Scene,
    objectsRef: { [key: string]: THREE.Object3D }
  ) => {
    console.log('Handling subtract node:', meshNode.id);
    
    // Znajdź połączone meshe
    const meshAEdge = edges.find(edge => edge.target === meshNode.id && edge.targetHandle === 'meshA');
    const meshBEdge = edges.find(edge => edge.target === meshNode.id && edge.targetHandle === 'meshB');

    console.log('Found edges:', { meshAEdge, meshBEdge });

    const meshA = meshAEdge ? objectsRef[meshAEdge.source] as THREE.Mesh : null;
    const meshB = meshBEdge ? objectsRef[meshBEdge.source] as THREE.Mesh : null;

    console.log('Mesh A position:', meshA?.position);
    console.log('Mesh B position:', meshB?.position);
    console.log('Mesh A matrix:', meshA?.matrix);
    console.log('Mesh B matrix:', meshB?.matrix);

    if (!meshA || !meshB) {
      console.warn('Missing meshes for subtract operation');
      return;
    }

    try {
      // Hide input meshes
      if (meshA.parent) {
        meshA.parent.remove(meshA);
      }
      if (meshB.parent) {
        meshB.parent.remove(meshB);
      }

      // Update world matrices
      meshA.updateMatrixWorld(true);
      meshB.updateMatrixWorld(true);

      console.log('Mesh A world matrix:', meshA.matrixWorld);
      console.log('Mesh B world matrix:', meshB.matrixWorld);

      // Clone meshes
      const meshAClone = meshA.clone();
      const meshBClone = meshB.clone();

      // Apply world transformations to geometries
      const geometryA = meshA.geometry.clone().applyMatrix4(meshA.matrixWorld);
      const geometryB = meshB.geometry.clone().applyMatrix4(meshB.matrixWorld);

      meshAClone.geometry = geometryA;
      meshBClone.geometry = geometryB;

      // Reset transformations
      meshAClone.position.set(0, 0, 0);
      meshAClone.rotation.set(0, 0, 0);
      meshAClone.scale.set(1, 1, 1);
      meshAClone.updateMatrix();

      meshBClone.position.set(0, 0, 0);
      meshBClone.rotation.set(0, 0, 0);
      meshBClone.scale.set(1, 1, 1);
      meshBClone.updateMatrix();

      console.log('Starting CSG operation');

      // Perform CSG operation
      const bspA = CSG.fromMesh(meshAClone);
      const bspB = CSG.fromMesh(meshBClone);
      const bspResult = bspA.subtract(bspB);

      console.log('CSG operation completed');

      // Use meshA's position for the result
      const resultPosition = meshA.position.clone();
      const resultRotation = meshA.rotation.clone();
      const resultScale = meshA.scale.clone();
      
      console.log('Using meshA position:', resultPosition);

      // Create or update result mesh
      let resultMesh = objectsRef[meshNode.id] as THREE.Mesh;
      
      if (!resultMesh) {
        console.log('Creating new result mesh');
        resultMesh = CSG.toMesh(bspResult, meshA.matrix.clone(), meshA.material);
        resultMesh.position.copy(resultPosition);
        resultMesh.rotation.copy(resultRotation);
        resultMesh.scale.copy(resultScale);
        objectsRef[meshNode.id] = resultMesh;
      } else {
        console.log('Updating existing result mesh');
        const newMesh = CSG.toMesh(bspResult, meshA.matrix.clone(), meshA.material);
        resultMesh.geometry.dispose();
        resultMesh.geometry = newMesh.geometry;
        resultMesh.material = newMesh.material;
        resultMesh.position.copy(resultPosition);
        resultMesh.rotation.copy(resultRotation);
        resultMesh.scale.copy(resultScale);
      }

      // Force geometry update
      resultMesh.geometry.computeBoundingSphere();
      resultMesh.geometry.computeBoundingBox();

      // Find parent
      const parentEdge = edges.find(edge => edge.source === meshNode.id);
      const parentNode = nodes.find(node => node.id === parentEdge?.target);

      console.log('Parent node:', parentNode);
      console.log('Result mesh position:', resultMesh.position);
      console.log('Result mesh matrix:', resultMesh.matrix);

      // Update parent
      if (parentNode?.type === 'group') {
        const parentGroup = objectsRef[parentEdge.target] as THREE.Group;
        if (parentGroup && resultMesh.parent !== parentGroup) {
          if (resultMesh.parent) {
            resultMesh.parent.remove(resultMesh);
          }
          parentGroup.add(resultMesh);
          console.log('Added result to group');
        }
      } else {
        if (resultMesh.parent !== scene) {
          if (resultMesh.parent) {
            resultMesh.parent.remove(resultMesh);
          }
          scene.add(resultMesh);
          console.log('Added result to scene');
        }
      }

      // Remove input meshes from objectsRef
      if (meshAEdge) {
        delete objectsRef[meshAEdge.source];
      }
      if (meshBEdge) {
        delete objectsRef[meshBEdge.source];
      }

      // Ensure the result mesh is visible
      resultMesh.visible = true;
      resultMesh.material.visible = true;
      resultMesh.material.needsUpdate = true;
      resultMesh.geometry.attributes.position.needsUpdate = true;

      // Clean up
      geometryA.dispose();
      geometryB.dispose();
      meshAClone.geometry.dispose();
      meshBClone.geometry.dispose();

      console.log('Subtract operation completed successfully');
    } catch (error) {
      console.error('Error in CSG operation:', error);
    }
  };

  // Funkcja obsługująca operację intersect
  const handleIntersectNode = (
    meshNode: any, 
    edges: any[], 
    scene: THREE.Scene,
    objectsRef: { [key: string]: THREE.Object3D }
  ) => {
    console.log('Handling intersect node:', meshNode.id);
    
    // Znajdź połączone meshe
    const meshAEdge = edges.find(edge => edge.target === meshNode.id && edge.targetHandle === 'meshA');
    const meshBEdge = edges.find(edge => edge.target === meshNode.id && edge.targetHandle === 'meshB');

    console.log('Found edges:', { meshAEdge, meshBEdge });

    const meshA = meshAEdge ? objectsRef[meshAEdge.source] as THREE.Mesh : null;
    const meshB = meshBEdge ? objectsRef[meshBEdge.source] as THREE.Mesh : null;

    console.log('Mesh A position:', meshA?.position);
    console.log('Mesh B position:', meshB?.position);
    console.log('Mesh A matrix:', meshA?.matrix);
    console.log('Mesh B matrix:', meshB?.matrix);

    if (!meshA || !meshB) {
      console.warn('Missing meshes for intersect operation');
      return;
    }

    try {
      // Hide input meshes
      if (meshA.parent) {
        meshA.parent.remove(meshA);
      }
      if (meshB.parent) {
        meshB.parent.remove(meshB);
      }

      // Update world matrices
      meshA.updateMatrixWorld(true);
      meshB.updateMatrixWorld(true);

      console.log('Mesh A world matrix:', meshA.matrixWorld);
      console.log('Mesh B world matrix:', meshB.matrixWorld);

      // Clone meshes
      const meshAClone = meshA.clone();
      const meshBClone = meshB.clone();

      // Apply world transformations to geometries
      const geometryA = meshA.geometry.clone().applyMatrix4(meshA.matrixWorld);
      const geometryB = meshB.geometry.clone().applyMatrix4(meshB.matrixWorld);

      meshAClone.geometry = geometryA;
      meshBClone.geometry = geometryB;

      // Reset transformations
      meshAClone.position.set(0, 0, 0);
      meshAClone.rotation.set(0, 0, 0);
      meshAClone.scale.set(1, 1, 1);
      meshAClone.updateMatrix();

      meshBClone.position.set(0, 0, 0);
      meshBClone.rotation.set(0, 0, 0);
      meshBClone.scale.set(1, 1, 1);
      meshBClone.updateMatrix();

      console.log('Starting CSG operation');

      // Perform CSG operation
      const bspA = CSG.fromMesh(meshAClone);
      const bspB = CSG.fromMesh(meshBClone);
      const bspResult = bspA.intersect(bspB);

      console.log('CSG operation completed');

      // Use meshA's position for the result
      const resultPosition = meshA.position.clone();
      const resultRotation = meshA.rotation.clone();
      const resultScale = meshA.scale.clone();
      
      console.log('Using meshA position:', resultPosition);

      // Create or update result mesh
      let resultMesh = objectsRef[meshNode.id] as THREE.Mesh;
      
      if (!resultMesh) {
        console.log('Creating new result mesh');
        resultMesh = CSG.toMesh(bspResult, meshA.matrix.clone(), meshA.material);
        resultMesh.position.copy(resultPosition);
        resultMesh.rotation.copy(resultRotation);
        resultMesh.scale.copy(resultScale);
        objectsRef[meshNode.id] = resultMesh;
      } else {
        console.log('Updating existing result mesh');
        const newMesh = CSG.toMesh(bspResult, meshA.matrix.clone(), meshA.material);
        resultMesh.geometry.dispose();
        resultMesh.geometry = newMesh.geometry;
        resultMesh.material = newMesh.material;
        resultMesh.position.copy(resultPosition);
        resultMesh.rotation.copy(resultRotation);
        resultMesh.scale.copy(resultScale);
      }

      // Force geometry update
      resultMesh.geometry.computeBoundingSphere();
      resultMesh.geometry.computeBoundingBox();

      // Find parent
      const parentEdge = edges.find(edge => edge.source === meshNode.id);
      const parentNode = nodes.find(node => node.id === parentEdge?.target);

      console.log('Parent node:', parentNode);
      console.log('Result mesh position:', resultMesh.position);
      console.log('Result mesh matrix:', resultMesh.matrix);

      // Update parent
      if (parentNode?.type === 'group') {
        const parentGroup = objectsRef[parentEdge.target] as THREE.Group;
        if (parentGroup && resultMesh.parent !== parentGroup) {
          if (resultMesh.parent) {
            resultMesh.parent.remove(resultMesh);
          }
          parentGroup.add(resultMesh);
          console.log('Added result to group');
        }
      } else {
        if (resultMesh.parent !== scene) {
          if (resultMesh.parent) {
            resultMesh.parent.remove(resultMesh);
          }
          scene.add(resultMesh);
          console.log('Added result to scene');
        }
      }

      // Remove input meshes from objectsRef
      if (meshAEdge) {
        delete objectsRef[meshAEdge.source];
      }
      if (meshBEdge) {
        delete objectsRef[meshBEdge.source];
      }

      // Ensure the result mesh is visible
      resultMesh.visible = true;
      resultMesh.material.visible = true;
      resultMesh.material.needsUpdate = true;
      resultMesh.geometry.attributes.position.needsUpdate = true;

      // Clean up
      geometryA.dispose();
      geometryB.dispose();
      meshAClone.geometry.dispose();
      meshBClone.geometry.dispose();

      console.log('Intersect operation completed successfully');
    } catch (error) {
      console.error('Error in CSG operation:', error);
    }
  };

  // Funkcja obsługująca operację union
  const handleUnionNode = (
    meshNode: any, 
    edges: any[], 
    scene: THREE.Scene,
    objectsRef: { [key: string]: THREE.Object3D }
  ) => {
    console.log('Handling union node:', meshNode.id);
    
    // Znajdź połączone meshe
    const meshAEdge = edges.find(edge => edge.target === meshNode.id && edge.targetHandle === 'meshA');
    const meshBEdge = edges.find(edge => edge.target === meshNode.id && edge.targetHandle === 'meshB');

    console.log('Found edges:', { meshAEdge, meshBEdge });

    const meshA = meshAEdge ? objectsRef[meshAEdge.source] as THREE.Mesh : null;
    const meshB = meshBEdge ? objectsRef[meshBEdge.source] as THREE.Mesh : null;

    console.log('Mesh A position:', meshA?.position);
    console.log('Mesh B position:', meshB?.position);
    console.log('Mesh A matrix:', meshA?.matrix);
    console.log('Mesh B matrix:', meshB?.matrix);

    if (!meshA || !meshB) {
      console.warn('Missing meshes for union operation');
      return;
    }

    try {
      // Hide input meshes
      if (meshA.parent) {
        meshA.parent.remove(meshA);
      }
      if (meshB.parent) {
        meshB.parent.remove(meshB);
      }

      // Update world matrices
      meshA.updateMatrixWorld(true);
      meshB.updateMatrixWorld(true);

      console.log('Mesh A world matrix:', meshA.matrixWorld);
      console.log('Mesh B world matrix:', meshB.matrixWorld);

      // Clone meshes
      const meshAClone = meshA.clone();
      const meshBClone = meshB.clone();

      // Apply world transformations to geometries
      const geometryA = meshA.geometry.clone().applyMatrix4(meshA.matrixWorld);
      const geometryB = meshB.geometry.clone().applyMatrix4(meshB.matrixWorld);

      meshAClone.geometry = geometryA;
      meshBClone.geometry = geometryB;

      // Reset transformations
      meshAClone.position.set(0, 0, 0);
      meshAClone.rotation.set(0, 0, 0);
      meshAClone.scale.set(1, 1, 1);
      meshAClone.updateMatrix();

      meshBClone.position.set(0, 0, 0);
      meshBClone.rotation.set(0, 0, 0);
      meshBClone.scale.set(1, 1, 1);
      meshBClone.updateMatrix();

      console.log('Starting CSG operation');

      // Perform CSG operation
      const bspA = CSG.fromMesh(meshAClone);
      const bspB = CSG.fromMesh(meshBClone);
      const bspResult = bspA.union(bspB);

      console.log('CSG operation completed');

      // Use meshA's position for the result
      const resultPosition = meshA.position.clone();
      const resultRotation = meshA.rotation.clone();
      const resultScale = meshA.scale.clone();
      
      console.log('Using meshA position:', resultPosition);

      // Create or update result mesh
      let resultMesh = objectsRef[meshNode.id] as THREE.Mesh;
      
      if (!resultMesh) {
        console.log('Creating new result mesh');
        resultMesh = CSG.toMesh(bspResult, meshA.matrix.clone(), meshA.material);
        resultMesh.position.copy(resultPosition);
        resultMesh.rotation.copy(resultRotation);
        resultMesh.scale.copy(resultScale);
        objectsRef[meshNode.id] = resultMesh;
      } else {
        console.log('Updating existing result mesh');
        const newMesh = CSG.toMesh(bspResult, meshA.matrix.clone(), meshA.material);
        resultMesh.geometry.dispose();
        resultMesh.geometry = newMesh.geometry;
        resultMesh.material = newMesh.material;
        resultMesh.position.copy(resultPosition);
        resultMesh.rotation.copy(resultRotation);
        resultMesh.scale.copy(resultScale);
      }

      // Force geometry update
      resultMesh.geometry.computeBoundingSphere();
      resultMesh.geometry.computeBoundingBox();

      // Find parent
      const parentEdge = edges.find(edge => edge.source === meshNode.id);
      const parentNode = nodes.find(node => node.id === parentEdge?.target);

      console.log('Parent node:', parentNode);
      console.log('Result mesh position:', resultMesh.position);
      console.log('Result mesh matrix:', resultMesh.matrix);

      // Update parent
      if (parentNode?.type === 'group') {
        const parentGroup = objectsRef[parentEdge.target] as THREE.Group;
        if (parentGroup && resultMesh.parent !== parentGroup) {
          if (resultMesh.parent) {
            resultMesh.parent.remove(resultMesh);
          }
          parentGroup.add(resultMesh);
          console.log('Added result to group');
        }
      } else {
        if (resultMesh.parent !== scene) {
          if (resultMesh.parent) {
            resultMesh.parent.remove(resultMesh);
          }
          scene.add(resultMesh);
          console.log('Added result to scene');
        }
      }

      // Remove input meshes from objectsRef
      if (meshAEdge) {
        delete objectsRef[meshAEdge.source];
      }
      if (meshBEdge) {
        delete objectsRef[meshBEdge.source];
      }

      // Ensure the result mesh is visible
      resultMesh.visible = true;
      resultMesh.material.visible = true;
      resultMesh.material.needsUpdate = true;
      resultMesh.geometry.attributes.position.needsUpdate = true;

      // Clean up
      geometryA.dispose();
      geometryB.dispose();
      meshAClone.geometry.dispose();
      meshBClone.geometry.dispose();

      console.log('Union operation completed successfully');
    } catch (error) {
      console.error('Error in CSG operation:', error);
    }
  };

  // Funkcja do obsługi Loop node'a
  const handleLoopNode = (
    loopNode: any,
    edges: any[],
    scene: THREE.Scene,
    objects: { [key: string]: THREE.Object3D }
  ) => {
    // Znajdź input node (Mesh, Group lub CSG)
    const inputEdge = edges.find(edge => edge.target === loopNode.id);
    if (!inputEdge) return;

    const inputNode = nodes.find(node => node.id === inputEdge.source);
    if (!inputNode) return;

    // Jeśli input to operacja CSG, poczekaj na jej zakończenie
    if (inputNode.type === 'subtract' || inputNode.type === 'intersect' || inputNode.type === 'union') {
      if (!objects[inputNode.id]) return;
    }

    const inputObject = objects[inputNode.id];
    if (!inputObject) return;

    // Usuń poprzedni obiekt Loop jeśli istnieje
    if (objects[loopNode.id]) {
      const oldGroup = objects[loopNode.id];
      if (oldGroup.parent) {
        oldGroup.parent.remove(oldGroup);
      }
      delete objects[loopNode.id];
    }

    // Stwórz nową grupę dla Loop node'a
    const loopGroup = new THREE.Group();
    objects[loopNode.id] = loopGroup;

    // Ustaw transformacje grupy
    loopGroup.position.set(
      loopNode.data.position.x,
      loopNode.data.position.y,
      loopNode.data.position.z
    );
    loopGroup.rotation.set(
      loopNode.data.rotation.x,
      loopNode.data.rotation.y,
      loopNode.data.rotation.z
    );
    loopGroup.scale.set(
      loopNode.data.scale.x,
      loopNode.data.scale.y,
      loopNode.data.scale.z
    );

    // Stwórz kopie obiektu wejściowego
    for (let i = 0; i < loopNode.data.iterations; i++) {
      const clone = inputObject.clone(true);
      
      // Ustaw pozycję klona w zależności od kierunku
      const offset = i * loopNode.data.spacing;
      if (loopNode.data.direction === 'x') {
        clone.position.x = offset;
      } else if (loopNode.data.direction === 'y') {
        clone.position.y = offset;
      } else {
        clone.position.z = offset;
      }

      // Jeśli to operacja CSG, upewnij się że materiały są skopiowane poprawnie
      if (inputNode.type === 'subtract' || inputNode.type === 'intersect' || inputNode.type === 'union') {
        if (clone instanceof THREE.Mesh) {
          clone.material = (inputObject as THREE.Mesh).material.clone();
        }
      }

      loopGroup.add(clone);
    }

    // Znajdź rodzica dla Loop node'a
    const parentEdge = edges.find(edge => edge.source === loopNode.id);
    if (parentEdge) {
      const parentNode = nodes.find(node => node.id === parentEdge.target);
      if (parentNode) {
        const parentObject = parentNode.type === 'scene' ? scene : objects[parentNode.id];
        if (parentObject) {
          parentObject.add(loopGroup);
        }
      }
    }
  };

  const processMeshNode = (meshNode: any, scene: THREE.Scene) => {
    let mesh = objectsRef.current[meshNode.id] as THREE.Mesh;

    // Znajdź geometrię
    const geometryEdge = edges.find(edge => 
      edge.target === meshNode.id && edge.targetHandle === 'geometry'
    );
    const geometryNode = nodes.find(node => node.id === geometryEdge?.source);

    // Znajdź materiał
    const materialEdge = edges.find(edge => 
      edge.target === meshNode.id && edge.targetHandle === 'material'
    );
    const materialNode = nodes.find(node => node.id === materialEdge?.source);

    // Jeśli brak geometrii lub materiału, usuń mesh ze sceny
    if (!geometryNode || !materialNode) {
      if (mesh) {
        mesh.removeFromParent();
      }
      return;
    }

    // Stwórz nowy mesh jeśli nie istnieje
    if (!mesh) {
      const geometry = createGeometry(geometryNode);
      const material = createMaterial(materialNode);
      mesh = new THREE.Mesh(geometry, material);
      objectsRef.current[meshNode.id] = mesh;
    } else {
      // Aktualizuj geometrię
      const newGeometry = createGeometry(geometryNode);
      mesh.geometry.dispose();
      mesh.geometry = newGeometry;

      // Aktualizuj materiał
      const newMaterial = createMaterial(materialNode);
      if (mesh.material) {
        mesh.material.dispose();
      }
      mesh.material = newMaterial;
    }

    // Aktualizuj transformacje
    const updateMeshTransform = (mesh: THREE.Mesh, meshNode: any) => {
      const position = meshNode.data.connections?.position ?? meshNode.data.position;
      const rotation = meshNode.data.connections?.rotation ?? meshNode.data.rotation;
      const scale = meshNode.data.connections?.scale ?? meshNode.data.scale;

      mesh.position.set(position.x, position.y, position.z);
      mesh.rotation.set(rotation.x, rotation.y, rotation.z);
      mesh.scale.set(scale.x, scale.y, scale.z);
    };
    updateMeshTransform(mesh, meshNode);

    // Znajdź rodzica (scenę lub grupę)
    const parentEdge = edges.find(edge => edge.source === meshNode.id);
    const parentNode = nodes.find(node => node.id === parentEdge?.target);
    
    if (parentNode) {
      if (parentNode.type === 'scene') {
        if (mesh.parent !== scene) {
          scene.add(mesh);
        }
      } else if (parentNode.type === 'group') {
        const parentGroup = objectsRef.current[parentNode.id] as THREE.Group;
        if (parentGroup && mesh.parent !== parentGroup) {
          if (mesh.parent) {
            mesh.parent.remove(mesh);
          }
          parentGroup.add(mesh);
        }
      }
    } else {
      if (mesh.parent !== scene) {
        scene.add(mesh);
      }
    }
  };

  const handleViewChange = (view: 'top' | 'bottom' | 'left' | 'right' | 'center') => {
    if (!perspectiveCameraRef.current || !orthographicCameraRef.current || !controlsRef.current) return;

    const distance = 10;
    let camera: THREE.Camera;
    const controls = controlsRef.current;

    // Choose camera type based on view
    if (view === 'center') {
      camera = perspectiveCameraRef.current;
      camera.position.set(5, 5, 5);
      camera.up.set(0, 1, 0);
      
      // Enable full orbital controls for center view
      controls.enableRotate = true;
      controls.enablePan = true;
      controls.enableZoom = true;
      controls.minPolarAngle = 0;
      controls.maxPolarAngle = Math.PI;
    } else {
      camera = orthographicCameraRef.current;
      
      // Disable rotation and limit panning for orthographic views
      controls.enableRotate = false;
      controls.enablePan = true;
      controls.enableZoom = true;

      switch (view) {
        case 'top':
          camera.position.set(0, distance, 0);
          camera.up.set(0, 0, -1);
          break;
        case 'bottom':
          camera.position.set(0, -distance, 0);
          camera.up.set(0, 0, 1);
          break;
        case 'left':
          camera.position.set(-distance, 0, 0);
          camera.up.set(0, 1, 0);
          break;
        case 'right':
          camera.position.set(distance, 0, 0);
          camera.up.set(0, 1, 0);
          break;
      }
    }

    // Update camera and controls
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    controls.object = camera;
    
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    // Reset controls target and update
    controls.target.set(0, 0, 0);
    controls.update();
  };

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

  return (
    <div ref={containerRef} style={sceneStyles}>
      <div style={viewButtonsContainerStyles}>
        <button 
          onClick={() => handleViewChange('top')}
          style={topButtonStyle}
        >
          T
        </button>
        <button 
          onClick={() => handleViewChange('left')}
          style={leftButtonStyle}
        >
          L
        </button>
        <button 
          onClick={() => handleViewChange('center')}
          style={centerButtonStyle}
        >
          C
        </button>
        <button 
          onClick={() => handleViewChange('right')}
          style={rightButtonStyle}
        >
          R
        </button>
        <button 
          onClick={() => handleViewChange('bottom')}
          style={bottomButtonStyle}
        >
          B
        </button>
      </div>
    </div>
  );
}
