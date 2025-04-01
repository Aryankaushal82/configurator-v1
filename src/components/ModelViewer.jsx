// import { Canvas, useLoader, useThree } from '@react-three/fiber';
// import { OrbitControls, useGLTF, useAnimations, Environment, ContactShadows, Html, Bounds, Line } from '@react-three/drei';
// import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
// import { RotatingLines } from 'react-loader-spinner';
// import * as THREE from 'three';
// import {QRCodeSVG} from 'qrcode.react';


// const TEXTURES = {
//   wood: './wood.jpg',
//   marble: './marble.jpg',
//   metal: './metal.jpg',
//   concrete: './concrete.jpg',
//   brick: './brick.jpg',
//   tiles: './tiles.jpg',
//   fabric: './fabric.jpg',
//   leather: './leather.jpg'
// };

// const materialPresets = {
//   plastic: {
//     color: '#f0f0f0',
//     metalness: 0.2,
//     roughness: 0.6
//   },
//   metal: {
//     color: '#a0a0a0',
//     metalness: 0.8,
//     roughness: 0.3
//   },
//   glass: {
//     color: '#ffffff',
//     metalness: 0,
//     roughness: 0,
//     transparent: true,
//     opacity: 0.5
//   },
//   wood: {
//     color: '#8B4513',
//     metalness: 0.1,
//     roughness: 0.7
//   },
//   ceramic: {
//     color: '#ffffff',
//     metalness: 0.3,
//     roughness: 0.4
//   },
//   rubber: {
//     color: '#333333',
//     metalness: 0,
//     roughness: 0.9
//   },
//   leather: {
//     color: '#5D4037',
//     metalness: 0.1,
//     roughness: 0.6
//   },
//   fabric: {
//     color: '#BDBDBD',
//     metalness: 0,
//     roughness: 0.8
//   }
// };

// const textureLoader = new THREE.TextureLoader();
// const loadedTextures = Object.fromEntries(
//   Object.entries(TEXTURES).map(([key, url]) => [key, textureLoader.load(url)])
// );

// function DimensionLines({ size, visible, modelSize, position }) {
//   const width = size[0];
//   const height = size[1];
//   const depth = size[2];

//   // Calculate positions for the dimensions
//   const halfWidth = width / 2;
//   const halfHeight = height / 2;
//   const halfDepth = depth / 2;

//   // Set origin to the bottom-left-back corner of the model's bounding box
//   const originX = -halfWidth;
//   const originY = -halfHeight;
//   const originZ = -halfDepth;

//   if (!visible) return null;
  
//   return (
//     <group position={[0,modelSize[1]+originY,0]}>
//       {/* X-axis measurement (width) */}
//       <Line
//         points={[
//           [originX, originY, originZ],
//           [originX + width, originY, originZ],
//         ]}
//         color="black"
//         lineWidth={2}
//       />
//       <Html position={[originX + width / 2, originY - 0.2, originZ]} center>
//         <div
//           style={{
//             background: "rgba(255,255,255,0.8)",
//             color: "black",
//             padding: "4px 8px",
//             borderRadius: "4px",
//             fontSize: "12px",
//             fontWeight: "bold",
//           }}
//         >
//           X: {width.toFixed(2)} units
//         </div>
//       </Html>

//       {/* Y-axis measurement (height) */}
//       <Line
//         points={[
//           [originX, originY, originZ],
//           [originX, originY + height, originZ],
//         ]}
//         color="black"
//         lineWidth={2}
//       />
//       <Html position={[originX - 0.2, originY + height / 2, originZ]} center>
//         <div
//           style={{
//             background: "rgba(255,255,255,0.8)",
//             color: "black",
//             padding: "4px 8px",
//             borderRadius: "4px",
//             fontSize: "12px",
//             fontWeight: "bold",
//           }}
//         >
//           Y: {height.toFixed(2)} units
//         </div>
//       </Html>

//       {/* Z-axis measurement (depth) */}
//       <Line
//         points={[
//           [originX, originY, originZ],
//           [originX, originY, originZ + depth],
//         ]}
//         color="black"
//         lineWidth={2}
//       />
//       <Html position={[originX, originY - 0.2, originZ + depth / 2]} center>
//         <div
//           style={{
//             background: "rgba(255,255,255,0.8)",
//             color: "black",
//             padding: "4px 8px",
//             borderRadius: "4px",
//             fontSize: "12px",
//             fontWeight: "bold",
//           }}
//         >
//           Z: {depth.toFixed(2)} units
//         </div>
//       </Html>
//     </group>
//   );
// }

// function Model({ url, config, onModelLoaded }) {
//   const group = useRef();
//   const { scene, animations } = useGLTF(url);
//   const { actions } = useAnimations(animations, group);
//   const [modelSize, setModelSize] = useState([1, 1, 1]);
//   const [loading, setLoading] = useState(true);
//   const [
//     colorMap,
//     displacementMap,
//     normalMap,
//     roughnessMap,
//     aoMap
//   ] = useLoader(THREE.TextureLoader, [
//     './PavingStones092_1K_Color.jpg',
//     './PavingStones092_1K_Displacement.jpg',
//     './PavingStones092_1K_Normal.jpg',
//     './PavingStones092_1K_Roughness.jpg',
//     './PavingStones092_1K_AmbientOcclusion.jpg'
//   ]);

//   useEffect(() => {
//     scene.traverse((child) => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;

//         // Create new material based on selected material type
//         const materialPreset = materialPresets[config.meshMaterial] || materialPresets.plastic;
        
//         let newMaterial;
//         switch(config.meshMaterial) {
//           case 'glass':
//             newMaterial = new THREE.MeshPhysicalMaterial({
//               color: materialPreset.color,
//               metalness: config.meshMetalness,
//               roughness: config.meshRoughness,
//               transmission: 1,
//               opacity: materialPreset.opacity,
//               transparent: true,
//               reflectivity: 0.5,
//               ior: 1.5
//             });
//             break;
//           case 'metal':
//             newMaterial = new THREE.MeshStandardMaterial({
//               color: materialPreset.color,
//               metalness: Math.max(config.meshMetalness, 0.6),
//               roughness: Math.min(config.meshRoughness, 0.4)
//             });
//             break;
//           case 'pathar':
//             newMaterial = new THREE.MeshStandardMaterial({
//               map: colorMap, // Base color texture
//               displacementMap: displacementMap, // Displacement map for height effects
//               normalMap: normalMap, // Normal map for surface details
//               roughnessMap: roughnessMap, // Roughness map for reflections
//               aoMap: aoMap, // Ambient occlusion map for shadows
//               roughness: 1, // Default roughness value
//               metalness: 0.5 // Default metalness value
//             });
//             break;
//           default:
//             newMaterial = new THREE.MeshStandardMaterial({
//               color: materialPreset.color,
//               metalness: config.meshMetalness,
//               roughness: config.meshRoughness
//             });
//         }

//         // Apply mesh type modifications
//         switch(config.meshType) {
//           case 'wireframe':
//             newMaterial.wireframe = true;
//             break;
//           case 'points':
//             const pointsMaterial = new THREE.PointsMaterial({ 
//               color: newMaterial.color, 
//               size: 0.02,
//               opacity: 0.8,
//               transparent: true
//             });
//             child.material = pointsMaterial;
//             break;
//           default:
//             child.material = newMaterial;
//         }
//       }
//     });
    
//     const box = new THREE.Box3().setFromObject(scene);
//     const size = new THREE.Vector3();
//     box.getSize(size);
//     setLoading(false);
//     setModelSize([size.x, size.y, size.z]);
//     onModelLoaded(size, scene.position);
//   }, [scene, config, onModelLoaded, colorMap, displacementMap, normalMap, roughnessMap, aoMap]);

//   useEffect(() => {
//     if (animations.length > 0) {
//       const action = actions[Object.keys(actions)[config.animationIndex]];
//       if (action) {
//         config.animationPlaying ? action.reset().play() : action.stop();
//       }
//     }
//   }, [animations, actions, config.animationIndex, config.animationPlaying]);

//   scene.rotation.y = config.rotation;

//   return <primitive ref={group} object={scene} />;
// }

// // Component to handle screenshot capture
// function ScreenshotButton({ onScreenshot }) {
//   const { gl, scene, camera } = useThree();
  
//   const takeScreenshot = useCallback(() => {
//     // Render the scene
//     gl.render(scene, camera);
    
//     // Get the canvas data URL
//     const dataURL = gl.domElement.toDataURL('image/png');
    
//     // Pass the screenshot data URL to the parent component
//     onScreenshot(dataURL);
//   }, [gl, scene, camera, onScreenshot]);
  
//   return (
//     <Html position={[0, 0, 0]} style={{ display: 'none' }}>
//       <button id="hidden-screenshot-trigger" onClick={takeScreenshot} />
//     </Html>
//   );
// }

// // AR View using model-viewer web component
// function ARView({ modelUrl, visible, onClose }) {
//   const modelViewerRef = useRef(null);
//   const [arUrl, setArUrl] = useState('');
//   const [qrVisible, setQrVisible] = useState(false);

//   useEffect(() => {
//     if (visible && modelUrl) {
//       // Generate a URL for AR viewing
//       // This would typically be a full URL to your model
//       const baseUrl = window.location.origin;
//       const fullUrl = `${baseUrl}/ar-view.html?model=${encodeURIComponent(modelUrl)}`;
//       setArUrl(fullUrl);
//     }
//   }, [visible, modelUrl]);

//   if (!visible) return null;

//   const toggleQRCode = () => {
//     setQrVisible(!qrVisible);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
//       <div className="bg-white rounded-lg p-4 w-full max-w-4xl h-5/6 flex flex-col">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold">AR View</h3>
//           <div className="flex gap-2">
//             <button 
//               onClick={toggleQRCode}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//             >
//               {qrVisible ? "Hide QR Code" : "Show QR Code"}
//             </button>
//             <button 
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center"
//             >
//               &times;
//             </button>
//           </div>
//         </div>

//         {/* QR Code overlay */}
//         {qrVisible && (
//           <div className="absolute top-20 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
//             <div className="text-center mb-2">Scan to view in AR</div>
//             <QRCodeSVG value={arUrl} size={200} />
//             <div className="text-xs mt-2 text-gray-500 max-w-xs text-center">
//               Point your camera at this QR code to open the AR view on your mobile device
//             </div>
//           </div>
//         )}

//         <div className="flex-grow relative">
//           <model-viewer
//             ref={modelViewerRef}
//             src={modelUrl}
//             ar
//             ar-modes="webxr scene-viewer quick-look"
//             camera-controls
//             auto-rotate
//             ar-scale="auto"
//             ar-placement="floor"
//             interaction-prompt="auto"
//             shadow-intensity="1"
//             environment-image="neutral"
//             exposure="0.5"
//             style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}
//           >
//             {/* AR button will be automatically added by model-viewer */}
//             <button slot="ar-button" className="ar-button">
//               View in AR
//             </button>
            
//             {/* Loading indicator */}
//             <div slot="poster" className="flex items-center justify-center h-full">
//               <RotatingLines
//                 strokeColor="gray"
//                 strokeWidth="5"
//                 animationDuration="0.75"
//                 width="50"
//                 visible={true}
//               />
//               <p className="ml-2 text-gray-700">Loading 3D model...</p>
//             </div>
//           </model-viewer>
//         </div>
        
//         <div className="mt-4 text-gray-700 text-sm">
//           <p>Instructions:</p>
//           <ul className="list-disc pl-5">
//             <li>Click "View in AR" to launch AR mode on supported devices</li>
//             <li>Use pinch gestures to resize the model</li>
//             <li>Use single finger to rotate the model</li>
//             <li>Share the QR code to view on other devices</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function ModelViewer({ modelUrl, config }) {
//   const [modelSize, setModelSize] = useState([1, 1, 1]);
//   const [modelPosition, setModelPosition] = useState([0, 0, 0]);
//   const [showDimensions, setShowDimensions] = useState(false);
//   const [screenshotPreview, setScreenshotPreview] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showAR, setShowAR] = useState(false);
//   const canvasRef = useRef();
//   const screenshotTriggerRef = useRef();

//   const handleModelLoaded = (size, position) => {
//     setModelSize([size.x, size.y, size.z]);
//     setModelPosition([position.x, position.y, position.z]);
//   };

//   // Function to handle screenshot capture
//   const handleScreenshot = (dataURL) => {
//     setScreenshotPreview(dataURL);
//     setShowPreview(true);
//   };
  
//   // Function to trigger screenshot
//   const triggerScreenshot = () => {
//     const triggerButton = document.getElementById('hidden-screenshot-trigger');
//     if (triggerButton) {
//       triggerButton.click();
//     }
//   };

//   // Function to download the screenshot
//   const downloadScreenshot = () => {
//     if (screenshotPreview) {
//       const link = document.createElement('a');
//       link.href = screenshotPreview;
//       link.download = 'model-screenshot.png';
//       link.click();
//     }
//   };

//   // Function to close the preview
//   const closePreview = () => {
//     setShowPreview(false);
//   };

//   // Function to toggle AR view
//   const toggleARView = () => {
//     setShowAR(!showAR);
//   };

//   // Calculate base and camera positioning based on model size
//   const baseDimensions = [
//     Math.max(modelSize[0] * 2, 4), // width
//     Math.max(modelSize[2] * 2, 4), // depth
//   ];
//   const cameraDistance = Math.max(modelSize[1] * 3, 5);

//   return (
//     <div className="w-full h-full relative">
//       {/* Dimension toggle button */}
//       <button
//         onClick={() => setShowDimensions(!showDimensions)}
//         className="absolute top-4 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
//       >
//         {showDimensions ? "Hide Dimensions" : "Show Dimensions"}
//       </button>
      
//       {/* Screenshot button */}
//       <button
//         onClick={triggerScreenshot}
//         className="absolute top-16 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
//       >
//         Take Screenshot
//       </button>

//       {/* AR View button */}
//       <button
//         onClick={toggleARView}
//         className="absolute top-28 right-4 z-10 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow flex items-center"
//       >
//         <span className="mr-1">View in AR</span>
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//           <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3zm5.5 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM6 11a1 1 0 100-2 1 1 0 000 2zm3-2a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
//         </svg>
//       </button>

//       {/* Dimension info panel */}
//       {showDimensions && (
//         <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-70 text-white p-3 rounded shadow">
//           <h3 className="font-bold text-lg mb-2">Model Dimensions</h3>
//           <p>Width: {modelSize[0].toFixed(2)} units</p>
//           <p>Height: {modelSize[1].toFixed(2)} units</p>
//           <p>Depth: {modelSize[2].toFixed(2)} units</p>
//         </div>
//       )}

//       {/* Screenshot preview modal */}
//       {showPreview && screenshotPreview && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
//           <div className="bg-white rounded-lg p-4 max-w-4xl max-h-screen overflow-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold">Screenshot Preview</h3>
//               <button 
//                 onClick={closePreview}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 &times;
//               </button>
//             </div>
//             <div className="mb-4 border border-gray-300">
//               <img src={screenshotPreview} alt="Model screenshot" className="max-w-full h-auto" />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button 
//                 onClick={closePreview}
//                 className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={downloadScreenshot}
//                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 Download
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* AR View Modal */}
//       <ARView 
//         modelUrl={modelUrl} 
//         visible={showAR} 
//         onClose={toggleARView} 
//       />

//       <Canvas
//          shadows
//          camera={{
//            position: [0, modelSize[1] * 1.5, cameraDistance],
//            fov: 70,
//          }}
//          ref={canvasRef}
//       >
//         <color attach="background" args={[config.backgroundColor || "#f0f0f0"]} />
//         <fog
//           attach="fog"
//           args={[config.backgroundColor || "#f0f0f0", cameraDistance, cameraDistance * 2]}
//         />

//         {/* Lighting */}
//         <ambientLight intensity={0.3} />
//         <directionalLight
//           castShadow
//           position={[10, 20, 15]}
//           intensity={1.5}
//           shadow-mapSize-width={1024}
//           shadow-mapSize-height={1024}
//         />
//         <pointLight position={[-10, 0, -20]} intensity={0.5} />

//         <Suspense
//           fallback={
//             <Html center>
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                 <RotatingLines
//                   strokeColor="gray"
//                   strokeWidth="5"
//                   animationDuration="0.75"
//                   width="50"
//                   visible={true}
//                 />
//                 <p style={{ marginTop: "10px", color: "#555" }}>Loading Model...</p>
//               </div>
//             </Html>
//           }
//         >
//           <Environment preset={config.backgroundScene} background />
//           <Bounds fit clip observe margin={1.2} maxDuration={1}>
//             {modelUrl && (
//               <Model url={modelUrl} config={config} onModelLoaded={handleModelLoaded} />
//             )}
//           </Bounds>

//           {/* Dimension lines and measurements */}
//           <DimensionLines size={modelSize} visible={showDimensions} modelSize={modelSize} position={modelPosition} />

//           {/* Base Plane */}
//           <mesh
//             position={[0, -modelSize[1] / 8 + 0.001, 0]}
//             rotation={[-Math.PI / 2, 0, 0]}
//             scale={[baseDimensions[0], baseDimensions[1], 1]}
//             receiveShadow
//           >
//             <planeGeometry />
//             <meshStandardMaterial
//               map={loadedTextures[config.baseTexture]}
//               metalness={config.baseMetalness}
//               roughness={config.baseRoughness}
//             />
//           </mesh>

//           {/* Contact Shadows */}
//           <ContactShadows
//             position={[0, -modelSize[1] / 8 + 0.01, 0]}
//             opacity={0.7}
//             blur={2}
//             far={modelSize[2] * 2}
//             scale={[baseDimensions[0], baseDimensions[1], 1]}
//           />
          
//           {/* Screenshot button component */}
//           <ScreenshotButton onScreenshot={handleScreenshot} ref={screenshotTriggerRef} />
//         </Suspense>

//         <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} enablePan enableZoom />
//       </Canvas>
//     </div>
//   );
// }



import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment, ContactShadows, Html, Bounds, Line } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import * as THREE from 'three';
import { QRCodeSVG } from 'qrcode.react';
import { Client, Storage, ID } from 'appwrite';

// Initialize Appwrite
const appwrite = new Client();
appwrite
  .setEndpoint('https://cloud.appwrite.io/v1') // Set your Appwrite endpoint
  .setProject('67ebffb60035df3d18be'); // Set your project ID

const storage = new Storage(appwrite);

// Texture definitions
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

// Component for the model upload UI
function ModelUploader({ onModelUploaded, isUploading, setIsUploading }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if the file is a valid 3D model
    const validExtensions = ['.glb', '.gltf', '.obj', '.fbx', '.usdz'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(extension)) {
      alert('Please upload a valid 3D model file (GLB, GLTF, OBJ, FBX, USDZ)');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a unique filename
      const timestamp = new Date().getTime();
      const uniqueFilename = `model_${timestamp}${extension}`;
      
      // Upload file to Appwrite Storage
      const uploadPromise = storage.createFile(
        '67ec002100025524dd4b', // Replace with your Appwrite bucket ID
        ID.unique(),
        file
      );
      
      // Monitor upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          // Simulate progress until we get actual progress from Appwrite
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 500);
      
      const result = await uploadPromise;
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      // Generate public URL for the file
      const fileUrl = storage.getFileView('67ec002100025524dd4b', result.$id);
      
      console.log('File uploaded successfully:', fileUrl);
      
      // Pass the URL back to the parent component
      onModelUploaded(fileUrl);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload model. Please try again.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow mb-4">
      <h3 className="text-lg font-bold mb-2">Upload 3D Model</h3>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".glb,.gltf,.obj,.fbx,.usdz"
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        disabled={isUploading}
      />
      {isUploading && (
        <div className="w-full">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-center">{uploadProgress}% Uploaded</p>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">
        Supported formats: GLB, GLTF, OBJ, FBX, USDZ
      </p>
    </div>
  );
}

function DimensionLines({ size, visible, modelSize, position }) {
  const width = size[0];
  const height = size[1];
  const depth = size[2];

  // Calculate positions for the dimensions
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfDepth = depth / 2;

  // Set origin to the bottom-left-back corner of the model's bounding box
  const originX = -halfWidth;
  const originY = -halfHeight;
  const originZ = -halfDepth;

  if (!visible) return null;
  
  return (
    <group position={[0,modelSize[1]+originY,0]}>
      {/* X-axis measurement (width) */}
      <Line
        points={[
          [originX, originY, originZ],
          [originX + width, originY, originZ],
        ]}
        color="black"
        lineWidth={2}
      />
      <Html position={[originX + width / 2, originY - 0.2, originZ]} center>
        <div
          style={{
            background: "rgba(255,255,255,0.8)",
            color: "black",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          X: {width.toFixed(2)} metres
        </div>
      </Html>

      {/* Y-axis measurement (height) */}
      <Line
        points={[
          [originX, originY, originZ],
          [originX, originY + height, originZ],
        ]}
        color="black"
        lineWidth={2}
      />
      <Html position={[originX - 0.2, originY + height / 2, originZ]} center>
        <div
          style={{
            background: "rgba(255,255,255,0.8)",
            color: "black",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          Y: {height.toFixed(2)} metres
        </div>
      </Html>

      {/* Z-axis measurement (depth) */}
      <Line
        points={[
          [originX, originY, originZ],
          [originX, originY, originZ + depth],
        ]}
        color="black"
        lineWidth={2}
      />
      <Html position={[originX, originY - 0.2, originZ + depth / 2]} center>
        <div
          style={{
            background: "rgba(255,255,255,0.8)",
            color: "black",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          Z: {depth.toFixed(2)} metres
        </div>
      </Html>
    </group>
  );
}

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
    onModelLoaded(size, scene.position);
  }, [scene, config, onModelLoaded, colorMap, displacementMap, normalMap, roughnessMap, aoMap]);

  useEffect(() => {
    if (animations.length > 0) {
      const action = actions[Object.keys(actions)[config.animationIndex]];
      if (action) {
        config.animationPlaying ? action.reset().play() : action.stop();
      }
    }
  }, [animations, actions, config.animationIndex, config.animationPlaying]);

  scene.rotation.y = config.rotation;

  return <primitive ref={group} object={scene} />;
}

// Component to handle screenshot capture
function ScreenshotButton({ onScreenshot }) {
  const { gl, scene, camera } = useThree();
  
  const takeScreenshot = useCallback(() => {
    // Render the scene
    gl.render(scene, camera);
    
    // Get the canvas data URL
    const dataURL = gl.domElement.toDataURL('image/png');
    
    // Pass the screenshot data URL to the parent component
    onScreenshot(dataURL);
  }, [gl, scene, camera, onScreenshot]);
  
  return (
    <Html position={[0, 0, 0]} style={{ display: 'none' }}>
      <button id="hidden-screenshot-trigger" onClick={takeScreenshot} />
    </Html>
  );
}

// AR View using model-viewer web component with Appwrite URL support
function ARView({ modelUrl, visible, onClose, modelId }) {
  const modelViewerRef = useRef(null);
  const [arUrl, setArUrl] = useState('');
  const [qrVisible, setQrVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    if (visible && modelUrl) {
      // Generate a URL for AR viewing with the appwrite model ID
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/ar-view.html?modelId=${encodeURIComponent(modelId || '')}&modelUrl=${encodeURIComponent(modelUrl)}`;
      setArUrl(fullUrl);
      setShareLink(fullUrl);
    }
  }, [visible, modelUrl, modelId]);

  if (!visible) return null;

  const toggleQRCode = () => {
    setQrVisible(!qrVisible);
    if (qrVisible) setShareVisible(false);
  };

  const toggleShareOptions = () => {
    setShareVisible(!shareVisible);
    if (shareVisible) setQrVisible(false);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(err => {
        console.error('Could not copy link: ', err);
        alert("Failed to copy link. Please try again.");
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">AR View</h3>
          <div className="flex gap-2">
            <button 
              onClick={toggleQRCode}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {qrVisible ? "Hide QR Code" : "Show QR Code"}
            </button>
            <button 
              onClick={toggleShareOptions}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {shareVisible ? "Hide Share Options" : "Share"}
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center"
            >
              &times;
            </button>
          </div>
        </div>

        {/* QR Code overlay */}
        {qrVisible && (
          <div className="absolute top-20 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
            <div className="text-center mb-2">Scan to view in AR</div>
            <QRCodeSVG value={arUrl} size={200} />
            <div className="text-xs mt-2 text-gray-500 max-w-xs text-center">
              Point your camera at this QR code to open the AR view on your mobile device
            </div>
          </div>
        )}

        {/* Share options overlay */}
        {shareVisible && (
          <div className="absolute top-20 right-4 bg-white p-4 rounded-lg shadow-lg z-10 w-80">
            <div className="text-center font-bold mb-2">Share this model</div>
            <div className="flex items-center mb-3">
              <input 
                type="text" 
                value={shareLink} 
                readOnly 
                className="flex-grow p-2 border border-gray-300 rounded-l text-sm truncate" 
              />
              <button 
                onClick={copyLinkToClipboard}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-r"
              >
                Copy
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Share this link with others to let them view this model in AR on their device
            </div>
          </div>
        )}

        <div className="flex-grow relative">
          <model-viewer
            ref={modelViewerRef}
            src={modelUrl}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            ar-scale="auto"
            ar-placement="floor"
            interaction-prompt="auto"
            shadow-intensity="1"
            environment-image="neutral"
            exposure="0.5"
            style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}
          >
            {/* AR button will be automatically added by model-viewer */}
            <button slot="ar-button" className="ar-button">
              View in AR
            </button>
            
            {/* Loading indicator */}
            <div slot="poster" className="flex items-center justify-center h-full">
              <RotatingLines
                strokeColor="gray"
                strokeWidth="5"
                animationDuration="0.75"
                width="50"
                visible={true}
              />
              <p className="ml-2 text-gray-700">Loading 3D model...</p>
            </div>
          </model-viewer>
        </div>
        
        <div className="mt-4 text-gray-700 text-sm">
          <p>Instructions:</p>
          <ul className="list-disc pl-5">
            <li>Click "View in AR" to launch AR mode on supported devices</li>
            <li>Use pinch gestures to resize the model</li>
            <li>Use single finger to rotate the model</li>
            <li>Share the QR code or link to view on other devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ModelViewer({ modelUrl, config }) {
  const [modelSize, setModelSize] = useState([1, 1, 1]);
  const [modelPosition, setModelPosition] = useState([0, 0, 0]);
  const [showDimensions, setShowDimensions] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const [uploadedModelUrl, setUploadedModelUrl] = useState(modelUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [modelId, setModelId] = useState(null);
  const canvasRef = useRef();
  const screenshotTriggerRef = useRef();

  const handleModelLoaded = (size, position) => {
    setModelSize([size.x, size.y, size.z]);
    setModelPosition([position.x, position.y, position.z]);
  };

  const handleModelUploaded = (url, id) => {
    setUploadedModelUrl(url);
    setModelId(id);
  };

  // Function to handle screenshot capture
  const handleScreenshot = (dataURL) => {
    setScreenshotPreview(dataURL);
    setShowPreview(true);
  };
  
  // Function to trigger screenshot
  const triggerScreenshot = () => {
    const triggerButton = document.getElementById('hidden-screenshot-trigger');
    if (triggerButton) {
      triggerButton.click();
    }
  };

  // Function to download the screenshot
  const downloadScreenshot = () => {
    if (screenshotPreview) {
      const link = document.createElement('a');
      link.href = screenshotPreview;
      link.download = 'model-screenshot.png';
      link.click();
    }
  };

  // Function to close the preview
  const closePreview = () => {
    setShowPreview(false);
  };

  // Function to toggle AR view
  const toggleARView = () => {
    setShowAR(!showAR);
  };

  // Calculate base and camera positioning based on model size
  const baseDimensions = [
    Math.max(modelSize[0] * 2, 4), // width
    Math.max(modelSize[2] * 2, 4), // depth
  ];
  const cameraDistance = Math.max(modelSize[1] * 3, 5);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Model Upload Section */}
      <ModelUploader 
        onModelUploaded={handleModelUploaded} 
        isUploading={isUploading}
        setIsUploading={setIsUploading}
      />
      
      <div className="relative flex-grow">
        {/* Dimension toggle button */}
        <button
          onClick={() => setShowDimensions(!showDimensions)}
          className="absolute top-4 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          {showDimensions ? "Hide Dimensions" : "Show Dimensions"}
        </button>
        
        {/* Screenshot button */}
        <button
          onClick={triggerScreenshot}
          className="absolute top-16 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          Take Screenshot
        </button>

        {/* AR View button */}
        <button
          onClick={toggleARView}
          className="absolute top-28 right-4 z-10 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow flex items-center"
          disabled={!uploadedModelUrl || isUploading}
        >
          <span className="mr-1">View in AR</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3zm5.5 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM6 11a1 1 0 100-2 1 1 0 000 2zm3-2a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2zm1 2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Dimension info panel */}
        {showDimensions && (
          <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-70 text-white p-3 rounded shadow">
            <h3 className="font-bold text-lg mb-2">Model Dimensions</h3>
            <p>Width: {modelSize[0].toFixed(2)} units</p>
            <p>Height: {modelSize[1].toFixed(2)} units</p>
            <p>Depth: {modelSize[2].toFixed(2)} units</p>
          </div>
        )}

        {/* Screenshot preview modal */}
        {showPreview && screenshotPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white rounded-lg p-4 max-w-4xl max-h-screen overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Screenshot Preview</h3>
                <button 
                  onClick={closePreview}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <div className="mb-4 border border-gray-300">
                <img src={screenshotPreview} alt="Model screenshot" className="max-w-full h-auto" />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={closePreview}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={downloadScreenshot}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AR View Modal */}
        <ARView 
          modelUrl={uploadedModelUrl} 
          visible={showAR} 
          onClose={toggleARView}
          modelId={modelId}
        />

        <Canvas
          shadows
          camera={{
            position: [0, modelSize[1] * 1.5, cameraDistance],
            fov: 70,
          }}
          ref={canvasRef}
        >
          <color attach="background" args={[config.backgroundColor || "#f0f0f0"]} />
          <fog
            attach="fog"
            args={[config.backgroundColor || "#f0f0f0", cameraDistance, cameraDistance * 2]}
          />

          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            castShadow
            position={[10, 20, 15]}
            intensity={1.5}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-10, 0, -20]} intensity={0.5} />

          <Suspense
            fallback={
              <Html center>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <RotatingLines
                    strokeColor="gray"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="50"
                    visible={true}
                  />
                  <p style={{ marginTop: "10px", color: "#555" }}>Loading Model...</p>
                </div>
              </Html>
            }
          >
            <Environment preset={config.backgroundScene} background />
            <Bounds fit clip observe margin={1.2} maxDuration={1}>
              {uploadedModelUrl && (
                <Model url={uploadedModelUrl} config={config} onModelLoaded={handleModelLoaded} />
              )}
            </Bounds>

            {/* Dimension lines and measurements */}
            <DimensionLines size={modelSize} visible={showDimensions} modelSize={modelSize} position={modelPosition} />

            {/* Base Plane */}
            <mesh
              position={[0, -modelSize[1] / 8 + 0.001, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[baseDimensions[0], baseDimensions[1], 1]}
              receiveShadow
            >
              <planeGeometry />
              <meshStandardMaterial
                map={loadedTextures[config.baseTexture]}
                metalness={config.baseMetalness}
                roughness={config.baseRoughness}
              />
            </mesh>

            {/* Contact Shadows */}
            <ContactShadows
              position={[0, -modelSize[1] / 8 + 0.01, 0]}
              opacity={0.7}
              blur={2}
              far={modelSize[2] * 2}
              scale={[baseDimensions[0], baseDimensions[1], 1]}
            />
            
            {/* Screenshot button component */}
            <ScreenshotButton onScreenshot={handleScreenshot} ref={screenshotTriggerRef} />
          </Suspense>

          <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} enablePan enableZoom />
        </Canvas>
      </div>
    </div>
  );
}