# EnhancedFileUploader Component

The `EnhancedFileUploader` is a feature-rich file upload component designed for ListLaunchr. It provides a seamless and user-friendly experience for uploading images with preview, cropping, and progress tracking.

## Features

- **Drag & Drop:** Users can drag and drop files directly into the upload area
- **Image Preview:** Shows preview of selected/uploaded images
- **Image Cropping:** Built-in cropping functionality with customizable aspect ratio
- **Upload Progress:** Visual indicator of upload progress
- **Validation:** File type and size validation
- **Customizable:** Highly configurable through props

## Usage

```jsx
import { EnhancedFileUploader } from '../components/ui';

// Basic usage
<EnhancedFileUploader
  onFileUploaded={(url) => console.log('Uploaded file URL:', url)}
  value={existingImageUrl} // Optional: for editing existing images
/>

// With all options
<EnhancedFileUploader
  label="Upload Logo"
  value={formData.image}
  onFileUploaded={(url) => {
    setFormData(prev => ({
      ...prev,
      image: url
    }));
  }}
  accept="image/*"
  maxSize={2} // in MB
  showPreview={true}
  previewClassName="h-24 w-auto max-w-full"
  aspectRatio={1} // Square aspect ratio
  allowCropping={true}
  showUploadProgress={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onFileUploaded` | function | *required* | Callback function that receives the uploaded file URL |
| `value` | string | `''` | URL of an existing file (for edit mode) |
| `label` | string | `'Upload Image'` | Label text for the uploader |
| `accept` | string | `'image/*'` | Accepted file types (MIME types) |
| `maxSize` | number | `5` | Maximum file size in MB |
| `className` | string | `''` | Additional CSS classes for the component |
| `showPreview` | boolean | `true` | Whether to show a preview of the uploaded/selected file |
| `previewClassName` | string | `''` | Additional CSS classes for the preview container |
| `aspectRatio` | number | `null` | Aspect ratio for the cropping tool (e.g., 16/9, 1, 4/3) |
| `allowCropping` | boolean | `true` | Whether to enable image cropping |
| `showUploadProgress` | boolean | `true` | Whether to show upload progress indicator |

## Best Practices

1. **For Logo Uploads:**
   - Set `aspectRatio={1}` for square logos
   - Consider setting `previewClassName="h-24 w-auto max-w-full"` for appropriate sizing
   - Recommend PNG format for transparency support

2. **For Header/Banner Images:**
   - Set `aspectRatio={16/9}` for widescreen headers
   - Use `previewClassName="h-48 w-full object-cover rounded-md"` for proper preview

3. **For Profile Pictures:**
   - Set `aspectRatio={1}` for square profile pictures
   - Consider setting a smaller preview size

4. **General Tips:**
   - Always handle the uploaded URL properly with the `onFileUploaded` callback
   - Set appropriate `maxSize` based on your application's requirements
   - When updating existing images, always provide the current image URL via the `value` prop

## Implementation Notes

- The component internally uses the `uploadAPI.uploadFile` method to handle the actual file upload
- The cropping functionality is provided by the React Cropper library
- The component handles both drag-and-drop and click-to-select interactions
- File validation happens before upload to prevent unnecessary API calls
- The component supports retrying uploads if they fail