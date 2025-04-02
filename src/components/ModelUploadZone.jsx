import { useState, useCallback, useRef } from 'react';
import { Client, Storage, ID } from 'appwrite';

const appwrite = new Client();
appwrite
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67ebffb60035df3d18be');

const storage = new Storage(appwrite);

export default function ModelUploadZone({
  onModelUploaded,
  onFileDrop,
  isUploading,
  setIsUploading
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validExtensions = ['.glb', '.gltf', '.obj', '.fbx', '.usdz'];

  const processFile = useCallback(async (file) => {
    if (!file) return;

    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(extension)) {
      setError(`Please upload a valid 3D model file (${validExtensions.join(', ')})`);
      triggerShakeAnimation();
      return;
    }

    if (onFileDrop) {
      const url = URL.createObjectURL(file);
      onFileDrop(url);
    }

    if (onModelUploaded && setIsUploading) {
      try {
        setIsUploading(true);
        setUploadProgress(0);

        const timestamp = new Date().getTime();
        const uniqueFilename = `model_${timestamp}${extension}`;

        const uploadPromise = storage.createFile(
          '67ec002100025524dd4b', // Replace with your Appwrite bucket ID
          ID.unique(),
          file
        );

        const uploadInterval = setInterval(() => {
          setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
        }, 500);

        const result = await uploadPromise;
        clearInterval(uploadInterval);
        setUploadProgress(100);

        const fileUrl = storage.getFileDownload('67ec002100025524dd4b', result.$id);
        onModelUploaded(fileUrl, result.$id);

        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Failed to upload model. Please try again.');
        triggerShakeAnimation();
      } finally {
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
      }
    }
  }, [onModelUploaded, onFileDrop, setIsUploading]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');
    const file = e.dataTransfer.files[0];
    processFile(file);
  }, [processFile]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const triggerFileInput = () => {
    if (!isUploading) fileInputRef.current.click();
  };

  const triggerShakeAnimation = () => {
    const container = document.querySelector('.upload-zone-container');
    if (container) {
      container.classList.add('shake-animation');
      setTimeout(() => container.classList.remove('shake-animation'), 820);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`upload-zone-container w-full h-full p-6 flex flex-col items-center justify-center border-4 border-dashed rounded-lg transition-all duration-300 bg-white shadow-lg ${
        isDragging
          ? 'border-orange-500 bg-orange-50'
          : isHovering && !isUploading
            ? 'border-orange-300 bg-orange-50'
            : 'border-orange-200'
      } ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      role="button"
      tabIndex="0"
      aria-label="Upload 3D model"
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isUploading) {
          triggerFileInput();
        }
      }}
    >
      <div className={`mb-4 text-orange-500 transition-transform duration-300 ${isDragging ? 'scale-125' : isHovering ? 'scale-110' : 'scale-100'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-orange-500 mb-2">
        {isUploading ? 'Uploading...' : 'Drop or Click to Upload'}
      </h2>

      {!isUploading && (
        <p className="text-lg text-gray-600 mb-2">
          Drag your 3D model here or click to browse
        </p>
      )}

      {isUploading && (
        <div className="w-full">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-center">{uploadProgress}% Uploaded</p>
        </div>
      )}

      <p className="text-sm text-orange-500 font-medium mt-2">
        Supported formats: {validExtensions.join(', ')}
      </p>

      {error && (
        <div className="mt-4 p-3 bg-white border-l-4 border-orange-500 text-orange-700 rounded shadow-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={validExtensions.join(',')}
        className="hidden"
        disabled={isUploading}
        aria-hidden="true"
      />

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake-animation {
          animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}