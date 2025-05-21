import { useState, useRef, useEffect, useCallback } from 'react';
import { uploadAPI } from '../../api';
import { toast } from 'react-hot-toast';

const SimpleFileUploader = ({ 
  onFileUploaded, 
  value, 
  label = 'Upload Image',
  accept = 'image/*',
  maxSize = 5, // in MB
  className = '',
  showUploadProgress = true,
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Reset progress when upload is complete
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    }
  }, [loading]);

  const handleFileChange = (e) => {
    setError(null);
    
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Validate file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Validate file type
    const fileType = selectedFile.type;
    if (!fileType.startsWith('image/')) {
      setError(`Only image files are accepted`);
      return;
    }

    setFile(selectedFile);
    handleUpload(selectedFile);
  };

  const handleUpload = async (fileToUpload) => {
    if (!fileToUpload) {
      setError('Please select a file first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);
      
      // Upload the file with progress tracking
      const response = await uploadAPI.uploadFile(fileToUpload, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });
      
      if (response.data && response.data.data.fileUrl) {
        console.log('File uploaded successfully, URL:', response.data.data.fileUrl);
        onFileUploaded(response.data.data.fileUrl);
        toast.success('File uploaded successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
      toast.error('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate file type
      if (!droppedFile.type.startsWith('image/')) {
        setError(`Only image files are accepted`);
        return;
      }
      
      // Validate file size
      if (droppedFile.size > maxSize * 1024 * 1024) {
        setError(`File size exceeds ${maxSize}MB limit`);
        return;
      }
      
      setFile(droppedFile);
      handleUpload(droppedFile);
    }
  };

  const handleClick = useCallback(() => {
    if (!loading) {
      fileInputRef.current?.click();
    }
  }, [loading]);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      
      <div 
        ref={dropZoneRef}
        className={`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : error 
              ? 'border-red-300' 
              : loading
                ? 'border-gray-300'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{ minHeight: '100px', maxHeight: '120px' }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="sr-only"
        />
        
        {loading ? (
          <div className="text-center">
            <svg className="animate-spin mx-auto h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-sm text-gray-600">Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600 font-medium">
                {isDragging 
                  ? 'Drop image here'
                  : value
                    ? 'Click to replace image'
                    : 'Drag & drop or click to upload'
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {`Supports: ${accept.replace('image/', '').replace('*', 'All image formats')} (max ${maxSize}MB)`}
              </p>
            </div>
          </>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {value && (
        <button
          type="button"
          onClick={() => {
            setFile(null);
            setError(null);
            onFileUploaded(''); // Clear the uploaded value in parent component
          }}
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Remove image
        </button>
      )}
    </div>
  );
};

export default SimpleFileUploader;