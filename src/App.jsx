


import { useState, useEffect } from 'react';
import ModelViewer from './components/ModelViewer';
import ConfigPanel from './components/ConfigPanel';
import ModelUploadZone from './components/ModelUploadZone';

function App() {
  const [modelUrl, setModelUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    backgroundType: 'scene',
    backgroundScene: 'sunset',
    backgroundColor: '#FFFFFF',
    lightIntensity: 1,
    rotation: 0,
    environment: 'city',
    meshType: 'default',
    meshMaterial: 'plastic',
    meshMetalness: 0,
    meshRoughness: 1,
    baseTexture: 'wood',
    baseMetalness: 0,
    baseRoughness: 1,
    animationIndex: 0,
    animationPlaying: true
  });

  // Check for mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileDrop = (url) => {
    setIsLoading(true);
    setModelUrl(url);
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading
  };

  const handleModelUploaded = (url, id) => {
    setModelUrl(url);
    console.log('Model uploaded in App:', { url, id });
    localStorage.setItem('modelUrl', url);
    localStorage.setItem('modelId', id);

  };

  const handleConfigChange = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset? This will remove your current model.')) {
      // Clear the model URL and ID from localStorage
      localStorage.removeItem('modelUrl');
      localStorage.removeItem('modelId');
  
      // Reset the state
      setModelUrl(null);
      setConfig({
        backgroundType: 'scene',
        backgroundScene: 'sunset',
        backgroundColor: '#FFFFFF',
        lightIntensity: 1,
        rotation: 0,
        environment: 'city',
        meshType: 'default',
        meshMaterial: 'plastic',
        meshMetalness: 0,
        meshRoughness: 1,
        baseTexture: 'wood',
        baseMetalness: 0,
        baseRoughness: 1,
        animationIndex: 0,
        animationPlaying: true,
      });
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-white" role="application" aria-label="3D Model Viewer Application">
      {/* Main viewer area */}
      <div className="w-full md:w-3/4 h-1/2 md:h-screen relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-orange-500 ">
        {modelUrl ? (
          <ModelViewer modelUrl={modelUrl} config={config} />
        ) : (
          <ModelUploadZone
            onFileDrop={handleFileDrop}
            onModelUploaded={handleModelUploaded}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        )}
        
        {modelUrl && (
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 z-10"
            aria-label="Reset model"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Configuration panel */}
      <div className="w-full md:w-1/4 h-1/2 md:h-screen overflow-y-auto bg-white">
        <div className="sticky top-0 bg-orange-500 text-white p-4 shadow-md z-10">
          <h1 className="text-xl font-bold">Model Configuration</h1>
          {isMobile && modelUrl && (
            <p className="text-sm mt-1 opacity-80">Scroll down to access all configuration options</p>
          )}
        </div>
        
        <ConfigPanel onConfigChange={handleConfigChange} config={config} />
      </div>

      {/* Mobile action button */}
      {isMobile && (
        <button
          className="fixed bottom-4 right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 z-20"
          onClick={() => {
            const configPanel = document.querySelector('.config-panel');
            if (configPanel) configPanel.classList.toggle('expanded');
          }}
          aria-label="Toggle configuration panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;




// import { useState, useEffect } from 'react';
// import ModelViewer from './components/ModelViewer';
// import ConfigPanel from './components/ConfigPanel';
// import FileDropZone from './components/FileDropZone';

// function App() {
//   const [modelUrl, setModelUrl] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [config, setConfig] = useState({
//     backgroundType: 'scene',
//     backgroundScene: 'sunset',
//     backgroundColor: '#FFFFFF',
//     lightIntensity: 1,
//     rotation: 0,
//     environment: 'city',
//     meshType: 'default',
//     meshMaterial: 'plastic',
//     meshMetalness: 0,
//     meshRoughness: 1,
//     baseTexture: 'wood',
//     baseMetalness: 0,
//     baseRoughness: 1,
//     animationIndex: 0,
//     animationPlaying: true
//   });

//   // Check for mobile devices
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     handleResize();
//     window.addEventListener('resize', handleResize);
    
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   const handleFileDrop = (url) => {
//     setIsLoading(true);
//     setModelUrl(url);
//     // Simulate loading time
//     setTimeout(() => setIsLoading(false), 1000);
//   };

//   const handleConfigChange = (newConfig) => {
//     setConfig(prev => ({ ...prev, ...newConfig }));
//   };

//   const handleReset = () => {
//     if (window.confirm('Are you sure you want to reset? This will remove your current model.')) {
//       setModelUrl(null);
//       setConfig({
//         backgroundType: 'scene',
//         backgroundScene: 'sunset',
//         backgroundColor: '#FFFFFF',
//         lightIntensity: 1,
//         rotation: 0,
//         environment: 'city',
//         meshType: 'default',
//         meshMaterial: 'plastic',
//         meshMetalness: 0,
//         meshRoughness: 1,
//         baseTexture: 'wood',
//         baseMetalness: 0,
//         baseRoughness: 1,
//         animationIndex: 0,
//         animationPlaying: true
//       });
//     }
//   };

//   return (
//     <div className="w-screen h-screen flex flex-col md:flex-row bg-white" role="application" aria-label="3D Model Viewer Application">
//       {/* Main viewer area */}
//       <div className="w-full md:w-3/4 h-1/2 md:h-screen relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-orange-500">
//         {isLoading ? (
//           <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
//             <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         ) : null}
        
//         {modelUrl ? (
//           <ModelViewer 
//             modelUrl={modelUrl} 
//             config={config}
//           />
//         ) : (
//            <FileDropZone onFileDrop={handleFileDrop} />
        
//         )}
        
//         {modelUrl && (
//           <button 
//             onClick={handleReset}
//             className="absolute top-4 right-4 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 z-10"
//             aria-label="Reset model"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>

//       {/* Configuration panel */}
//       <div className="w-full md:w-1/4 h-1/2 md:h-screen overflow-y-auto bg-white">
//         <div className="sticky top-0 bg-orange-500 text-white p-4 shadow-md z-10">
//           <h1 className="text-xl font-bold">Model Configuration</h1>
//           {isMobile && modelUrl && (
//             <p className="text-sm mt-1 opacity-80">Scroll down to access all configuration options</p>
//           )}
//         </div>
        
//         <ConfigPanel 
//           onConfigChange={handleConfigChange}
//           config={config}
//         />
//       </div>

//       {/* Mobile action button to toggle config panel visibility on small screens */}
//       {isMobile && (
//         <button 
//           className="fixed bottom-4 right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-300 z-20"
//           onClick={() => {
//             // This would be implemented to toggle the config panel visibility
//             const configPanel = document.querySelector('.config-panel');
//             if (configPanel) {
//               configPanel.classList.toggle('expanded');
//             }
//           }}
//           aria-label="Toggle configuration panel"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//         </button>
//       )}
//     </div>
//   );
// }

// export default App;