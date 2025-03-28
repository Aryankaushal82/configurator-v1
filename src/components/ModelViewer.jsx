import { Canvas,useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment, ContactShadows, Html } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import * as THREE from 'three';

const TEXTURES = {
  wood: './wood.jpg',
  marble: './marble.jpg',
  metal: './metal.jpg',
  concrete: './concrete.jpg',
  brick: './brick.jpg',
  tiles: './tiles.jpg',
  fabric: './fabric.jpg',
  leather: './leather.jpg'
};

const materialPresets = {
  plastic: {
    color: '#f0f0f0',
    metalness: 0.2,
    roughness: 0.6
  },
  metal: {
    color: '#a0a0a0',
    metalness: 0.8,
    roughness: 0.3
  },
  glass: {
    color: '#ffffff',
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 0.5
  },
  wood: {
    color: '#8B4513',
    metalness: 0.1,
    roughness: 0.7
  },
  ceramic: {
    color: '#ffffff',
    metalness: 0.3,
    roughness: 0.4
  },
  rubber: {
    color: '#333333',
    metalness: 0,
    roughness: 0.9
  },
  leather: {
    color: '#5D4037',
    metalness: 0.1,
    roughness: 0.6
  },
  fabric: {
    color: '#BDBDBD',
    metalness: 0,
    roughness: 0.8
  }
};

const textureLoader = new THREE.TextureLoader();
const loadedTextures = Object.fromEntries(
  Object.entries(TEXTURES).map(([key, url]) => [key, textureLoader.load(url)])
);

function Model({ url, config, onModelLoaded }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);
  const [modelSize, setModelSize] = useState([1, 1, 1]);
  const [loading, setLoading] = useState(true);
  const [
    colorMap,
    displacementMap,
    normalMap,
    roughnessMap,
    aoMap
  ] = useLoader(THREE.TextureLoader, [
    './PavingStones092_1K_Color.jpg',
    './PavingStones092_1K_Displacement.jpg',
    './PavingStones092_1K_Normal.jpg',
    './PavingStones092_1K_Roughness.jpg',
    './PavingStones092_1K_AmbientOcclusion.jpg'
  ]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Create new material based on selected material type
        const materialPreset = materialPresets[config.meshMaterial] || materialPresets.plastic;
        
        let newMaterial;
        switch(config.meshMaterial) {
          case 'glass':
            newMaterial = new THREE.MeshPhysicalMaterial({
              color: materialPreset.color,
              metalness: config.meshMetalness,
              roughness: config.meshRoughness,
              transmission: 1,
              opacity: materialPreset.opacity,
              transparent: true,
              reflectivity: 0.5,
              ior: 1.5
            });
            break;
          case 'metal':
            newMaterial = new THREE.MeshStandardMaterial({
              color: materialPreset.color,
              metalness: Math.max(config.meshMetalness, 0.6),
              roughness: Math.min(config.meshRoughness, 0.4)
            });
            break;
          case 'pathar':
            newMaterial = new THREE.MeshStandardMaterial({
              map: colorMap, // Base color texture
              displacementMap: displacementMap, // Displacement map for height effects
              normalMap: normalMap, // Normal map for surface details
              roughnessMap: roughnessMap, // Roughness map for reflections
              aoMap: aoMap, // Ambient occlusion map for shadows
              roughness: 1, // Default roughness value
              metalness: 0.5 // Default metalness value
            });
            break;
          default:
            newMaterial = new THREE.MeshStandardMaterial({
              color: materialPreset.color,
              metalness: config.meshMetalness,
              roughness: config.meshRoughness
            });
        }

        // Apply mesh type modifications
        switch(config.meshType) {
          case 'wireframe':
            newMaterial.wireframe = true;
            break;
          case 'points':
            const pointsMaterial = new THREE.PointsMaterial({ 
              color: newMaterial.color, 
              size: 0.02,
              opacity: 0.8,
              transparent: true
            });
            child.material = pointsMaterial;
            break;
          default:
            child.material = newMaterial;
        }
      }
    });
    
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    setLoading(false);
    setModelSize([size.x, size.y, size.z]);
    onModelLoaded(size);
  }, [scene, config, onModelLoaded]);
  useEffect(() => {
    if (animations.length > 0) {
      const action = actions[Object.keys(actions)[config.animationIndex]];
      if (action) {
        config.animationPlaying ? action.reset().play() : action.stop();
      }
    }
  }, [animations, config.animationIndex, config.animationPlaying]);

  scene.rotation.y = config.rotation;

  return <primitive ref={group} object={scene} />;
}

export default function ModelViewer({ modelUrl, config }) {
  const [modelSize, setModelSize] = useState([1, 1, 1]);

  const handleModelLoaded = (size) => {
    setModelSize([size.x, size.y, size.z]);
  };

  // Calculate base and camera positioning based on model size
  const baseDimensions = [
    Math.max(modelSize[0] * 2, 4),   // width
    Math.max(modelSize[2] * 2, 4)    // depth
  ];
  const cameraDistance = Math.max(modelSize[1] * 3, 5);

  return (
    <div className="w-full h-full">
      <Canvas 
        shadows 
        camera={{ 
          position: [0, modelSize[1] * 1.5, cameraDistance], 
          fov: 70 
        }}
      >
        <color attach="background" args={[config.backgroundColor || '#f0f0f0']} />
        <fog attach="fog" args={[config.backgroundColor || '#f0f0f0', cameraDistance, cameraDistance * 2]} />
        
        {/* Improved Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          castShadow 
          position={[10, 20, 15]} 
          intensity={1.5} 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 0, -20]} intensity={0.5} />

        <Suspense fallback={<Html center>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <RotatingLines
          strokeColor="gray"
          strokeWidth="5"
          animationDuration="0.75"
          width="50"
          visible={true}
        />
        <p style={{ marginTop: '10px', color: '#555' }}>Loading Model...</p>
      </div>
    </Html>}>
          <Environment preset={config.backgroundScene} background />
          
          {modelUrl && (
            <Model 
              url={modelUrl} 
              config={config} 
              onModelLoaded={handleModelLoaded} 
            />
          )}
          
          {/* Improved Base Plane */}
          <mesh
            position={[0, -modelSize[1]/2 + 0.001, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[baseDimensions[0], baseDimensions[1], 1]}
            receiveShadow
          >
            <planeGeometry/>
            <meshStandardMaterial
              map={loadedTextures[config.baseTexture]}
              metalness={config.baseMetalness}
              roughness={config.baseRoughness}
            />
          </mesh>

          {/* Enhanced Contact Shadows */}
          <ContactShadows 
            position={[0, -modelSize[1] / 2 + 0.01, 0]} 
            opacity={0.7} 
            blur={2} 
            far={modelSize[2] * 2} 
            scale={[baseDimensions[0], baseDimensions[1], 1]} 
          />
        </Suspense>
        
        <OrbitControls 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2} 
          enablePan 
          enableZoom 
        />
      </Canvas>
    </div>
  );
}


