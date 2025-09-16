import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MultiImageUploadProps {
  onImagesSelect: (files: File[]) => void;
  selectedImages: File[];
  onRemoveImage: (index: number) => void;
  maxImages: number;
  minImages: number;
}

export const MultiImageUpload = ({ 
  onImagesSelect, 
  selectedImages, 
  onRemoveImage, 
  maxImages,
  minImages 
}: MultiImageUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileSelect(files);
    }
  };

  const handleFileSelect = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} geçerli bir görsel dosyası değil`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error(`${file.name} dosyası çok büyük (max 10MB)`);
        return false;
      }
      return true;
    });

    const newImages = [...selectedImages, ...validFiles];
    
    if (newImages.length > maxImages) {
      toast.error(`En fazla ${maxImages} görsel yükleyebilirsiniz`);
      return;
    }

    if (validFiles.length > 0) {
      onImagesSelect(newImages);
    }
  };

  const handleRemove = (index: number) => {
    onRemoveImage(index);
  };

  if (selectedImages.length > 0) {
    return (
      <div className="space-y-4">
        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border" style={{ backgroundColor: '#2a2a2a', borderColor: '#444444' }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(index)}
                    className="rounded-full w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-xs truncate" style={{ color: '#888888' }}>
                {image.name}
              </div>
            </div>
          ))}
          
          {/* Add More Button */}
          {selectedImages.length < maxImages && (
            <div
              className={`aspect-square rounded-lg border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center ${
                isDragActive ? 'bg-primary/10' : 'hover:bg-opacity-80'
              }`}
              style={{
                backgroundColor: '#2a2a2a',
                borderColor: isDragActive ? '#CCFF00' : '#CCFF00'
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('multi-file-input')?.click()}
            >
              <Upload className="w-8 h-8 mb-2 text-primary" />
              <span className="text-xs text-center" style={{ color: '#888888' }}>
                Daha fazla<br />ekle
              </span>
            </div>
          )}
        </div>

        {/* File Input */}
        <input
          id="multi-file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Info */}
        <div className="text-sm" style={{ color: '#888888' }}>
          {selectedImages.length}/{maxImages} görsel seçildi
          {selectedImages.length < minImages && (
            <span className="text-destructive ml-2">
              (En az {minImages} görsel gerekli)
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
        isDragActive
          ? 'border-primary bg-primary/10'
          : 'hover:bg-opacity-80'
      }`}
      style={{
        backgroundColor: '#2a2a2a',
        borderColor: isDragActive ? '#CCFF00' : '#CCFF00'
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('multi-file-input')?.click()}
    >
      <input
        id="multi-file-input"
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-primary" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">Çoklu Görsel Yükle</h3>
          <p className="mb-4" style={{ color: '#888888' }}>
            {minImages}-{maxImages} adet görsel sürükleyip bırakın veya seçin
          </p>
          
          <Button variant="outline" className="glass-button border-primary text-primary hover:bg-primary/10">
            <Upload className="w-4 h-4 mr-2" />
            Görselleri Seç
          </Button>
        </div>
        
        <div className="text-sm" style={{ color: '#888888' }}>
          PNG, JPG, JPEG desteklenir • Max 10MB/dosya
        </div>
      </div>
    </div>
  );
};