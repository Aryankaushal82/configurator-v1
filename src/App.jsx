

import { useState } from 'react'
import ModelViewer from './components/ModelViewer'
import ConfigPanel from './components/ConfigPanel'
import FileDropZone from './components/FileDropZone'

function App() {
  const [modelUrl, setModelUrl] = useState(null)
  const [config, setConfig] = useState({
    backgroundType: 'scene',
    backgroundScene: 'sunset',
    backgroundColor: '#f0f0f0',
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
  })

  const handleFileDrop = (url) => {
    setModelUrl(url)
  }

  const handleConfigChange = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-gray-100">
      <div className="w-full md:w-3/4 h-1/2 md:h-screen relative overflow-hidden shadow-lg">
        {modelUrl ? (
          <ModelViewer 
            modelUrl={modelUrl} 
            config={config}
          />
        ) : (
          <FileDropZone onFileDrop={handleFileDrop} />
        )}
      </div>
      <div className="w-full md:w-1/4 h-1/2 md:h-screen overflow-y-auto bg-white shadow-lg">
        <ConfigPanel 
          onConfigChange={handleConfigChange}
          config={config}
        />
      </div>
    </div>
  )
}

export default App