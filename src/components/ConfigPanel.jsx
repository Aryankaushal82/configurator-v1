
import { useEffect } from 'react'

export default function ConfigPanel({ onConfigChange, config }) {
  const handleChange = (key, value) => {
    onConfigChange({ [key]: value })
  }

  const backgroundScenes = [
    'sunset', 'dawn', 'night', 'warehouse', 'forest', 
    'apartment', 'studio', 'park', 'lobby', 'city'
  ]

  const meshMaterials = [
    'plastic', 'metal', 'glass', 'wood', 'ceramic', 
    'rubber', 'leather', 'fabric','pathar'
  ]

  const baseTextures = [
    'wood', 'marble', 'metal', 'concrete', 'brick', 
    'tiles', 'fabric', 'leather'
  ]

  const meshTypes = [
    'default', 'wireframe', 'points', 'outline'
  ]

  return (
    <div className="h-full overflow-y-auto bg-white shadow-lg p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">3D Model Configurator</h2>
      
      {/* Scene Settings */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Scene Settings</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Background Scene</label>
            <select 
              value={config.backgroundScene}
              onChange={(e) => handleChange('backgroundScene', e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {backgroundScenes.map(scene => (
                <option key={scene} value={scene}>
                  {scene.charAt(0).toUpperCase() + scene.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Model Settings */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Model Settings</h3>
        <div className="space-y-4">
          {/*  */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Material Type</label>
            <select 
              value={config.meshMaterial}
              onChange={(e) => handleChange('meshMaterial', e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {meshMaterials.map(material => (
                <option key={material} value={material}>
                  {material.charAt(0).toUpperCase() + material.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mesh Metalness: {config.meshMetalness.toFixed(1)}
            </label>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.meshMetalness}
              onChange={(e) => handleChange('meshMetalness', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mesh Roughness: {config.meshRoughness.toFixed(1)}
            </label>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.meshRoughness}
              onChange={(e) => handleChange('meshRoughness', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Base Settings */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Base Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Base Texture</label>
            <select 
              value={config.baseTexture}
              onChange={(e) => handleChange('baseTexture', e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {baseTextures.map(texture => (
                <option key={texture} value={texture}>
                  {texture.charAt(0).toUpperCase() + texture.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Base Metalness: {config.baseMetalness.toFixed(1)}
            </label>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.baseMetalness}
              onChange={(e) => handleChange('baseMetalness', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Base Roughness: {config.baseRoughness.toFixed(1)}
            </label>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.baseRoughness}
              onChange={(e) => handleChange('baseRoughness', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Animation Settings */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Animation</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input 
              type="checkbox"
              checked={config.animationPlaying}
              onChange={(e) => handleChange('animationPlaying', e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-600">Play Animation</label>
          </div>
        </div>
      </div>
    </div>
  )
}