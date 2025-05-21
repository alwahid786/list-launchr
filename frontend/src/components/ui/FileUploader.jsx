import { useState, useRef, useEffect } from 'react';
import { uploadAPI } from '../../api';
import { toast } from 'react-hot-toast';

const FileUploader = ({ 
  onFileUploaded, 
  value, 
  label = 'Upload Image',
  accept = 'image/*',
  maxSize = 5, // in MB
  className = '',
  showPreview = true,
  previewClassName = '',
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // If a value (URL) is provided, use it as preview
  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  // Create a preview when a file is selected
  useEffect(() => {
    if (!file) {
      // Only reset preview if no value is provided
      if (!value) {
        setPreview(null);
      }
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Cleanup when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, value]);

  const handleFileChange = (e) => {
    setError(null);
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Validate file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await uploadAPI.uploadFile(file);
      
      if (response.data && response.data.data.fileUrl) {
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
      if (!accept.includes('*') && !accept.includes(droppedFile.type.split('/')[1])) {
        setError(`File type not accepted. Please upload ${accept.replace('image/', '')} files`);
        return;
      }
      
      // Validate file size
      if (droppedFile.size > maxSize * 1024 * 1024) {
        setError(`File size exceeds ${maxSize}MB limit`);
        return;
      }
      
      setFile(droppedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      
      <div 
        className={`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${
          isDragging ? 'border-blue-500 bg-blue-50' : error ? 'border-red-300' : 'border-gray-300'
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="sr-only"
        />
        
        {showPreview && preview ? (
          <div className={`mb-4 ${previewClassName}`}>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded"
            />
          </div>
        ) : (
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
        )}
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isDragging 
              ? 'Drop file here'
              : 'Drag & drop or click to select'
            }
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {`Supports: ${accept.replace('image/', '')} (max ${maxSize}MB)`}
          </p>
        </div>
        
        {file && !preview && (
          <div className="mt-2 text-xs font-medium">
            Selected: {file.name}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {file && file.name && !loading && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {file.name}
        </div>
      )}
      
      <div className="mt-4">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            loading ? 'cursor-wait' : ''
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            'Upload'
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;