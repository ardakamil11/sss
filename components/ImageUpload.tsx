import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage?: File;
  onRemoveImage?: () => void;
}

export const ImageUpload = ({ onImageSelect, selectedImage, onRemoveImage }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        handleFileSelect(file);
      }
    }
  }, []);

  const handleFileSelect = (file: File) => {
    onImageSelect(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        handleFileSelect(file);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Lütfen JPG, PNG veya WebP formatında bir görsel yükleyin.');
      return false;
    }

    if (file.size > maxSize) {
      alert('Görsel boyutu 10MB\'dan küçük olmalıdır.');
      return false;
    }

    return true;
  };

  const handleRemove = () => {
    setPreview(null);
    onRemoveImage?.();
  };

  if (selectedImage && preview) {
    return (
      <div className="rounded-lg p-6" style={{ backgroundColor: '#2a2a2a', borderColor: '#444444', border: '1px solid' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-white">Yüklenen Görsel</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="hover:text-white"
            style={{ color: '#888888' }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
            style={{ borderColor: '#444444' }}
          />
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {selectedImage.name}
          </div>
        </div>
        
        <div className="mt-4 text-sm" style={{ color: '#888888' }}>
          <p>Boyut: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
          <p>Format: {selectedImage.type}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
        ${dragActive 
          ? 'bg-primary/10' 
          : 'hover:bg-opacity-80'
        }
      `}
      style={{
        backgroundColor: '#2a2a2a',
        borderColor: dragActive ? '#CCFF00' : '#CCFF00'
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
          {dragActive ? (
            <Upload className="w-8 h-8 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="w-8 h-8 text-primary" />
          )}
        </div>
        
        <div>
          <h3 className="text-lg mb-2 text-white">
            {dragActive ? 'Görseli Bırakın' : 'Ürün Görselinizi Yükleyin'}
          </h3>
          <p className="text-sm mb-4" style={{ color: '#888888' }}>
            Sürükle-bırak yapın veya tıklayarak seçin
          </p>
          
          <div className="space-y-2 text-xs" style={{ color: '#888888' }}>
            <p>Desteklenen formatlar: JPG, PNG, WebP</p>
            <p>Maksimum boyut: 10MB</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          Görsel Seç
        </Button>
      </div>
    </div>
  );
};