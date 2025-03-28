import { useState, useCallback } from 'react'

export default function FileDropZone({ onFileDrop }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    setError('')

    const file = e.dataTransfer.files[0]
    if (file) {
      if (file.name.toLowerCase().endsWith('.gltf') || file.name.toLowerCase().endsWith('.glb')) {
        const url = URL.createObjectURL(file)
        onFileDrop(url)
      } else {
        setError('Please upload a GLTF or GLB file')
      }
    }
  }, [onFileDrop])

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full h-full flex flex-col items-center justify-center border-4 border-dashed rounded-lg transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <p className="text-lg text-gray-600 mb-2">
        Drag and drop your 3D model here
      </p>
      <p className="text-sm text-gray-500">
        Supported formats: .gltf, .glb
      </p>
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}


