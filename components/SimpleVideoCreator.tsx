
import { useState } from 'react';
import { ArrowLeft, Video, Upload, Play, Download, Loader2, Lightbulb, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ImageUpload';
import { MultiImageUpload } from '@/components/MultiImageUpload';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ApiKeyStatus } from '@/components/ApiKeyStatus';
import { generateVideo, generateMultiImageVideo, uploadImageToFal } from '@/utils/falai';
import { toast } from 'sonner';

interface SimpleVideoCreatorProps {
  onBack: () => void;
}

export const SimpleVideoCreator = ({ onBack }: SimpleVideoCreatorProps) => {
  const [activeTab, setActiveTab] = useState('single');
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const singleImagePrompts = [
    "Modern living room with furniture rotating slowly, warm ambient lighting, cozy home atmosphere, camera pans around the space",
    "Bedroom furniture showcase in elegant home interior, soft natural light through windows, peaceful atmosphere, smooth camera movement",
    "Kitchen furniture display in contemporary home setting, bright lighting, clean design, professional product presentation"
  ];

  const multiImagePrompts = [
    "Ilk urun soldan saga kayarken ikinci urun yukaridan asagi iner, ortada bulusup birlesirler",
    "Gorseller sirayla fade-in olarak belirir, donen kamera acisiyla panoramik kompozisyon",
    "Urunler merkeze dogru yakinlasirken arka planda isik efektleri ile birlesme animasyonu"
  ];

  const suggestedPrompts = activeTab === 'single' ? singleImagePrompts : multiImagePrompts;

  const handleSuggestedPromptClick = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleMultiImageSelect = (files: File[]) => {
    setSelectedImages(files);
  };

  const handleRemoveMultiImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateVideoContent = async () => {
    if (activeTab === 'single') {
      if (!prompt.trim() || !selectedImage) {
        toast.error('Lutfen prompt ve gorsel ekleyin');
        return;
      }
    } else {
      if (!prompt.trim() || selectedImages.length < 2) {
        toast.error('Lutfen prompt ve en az 2 gorsel ekleyin');
        return;
      }
    }

    const falApiKey = localStorage.getItem('fal_api_key');
    if (!falApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 1000);

      let result;
      
      if (activeTab === 'single') {
        // Upload image
        toast.info('Gorsel yukleniyor...');
        const imageUrl = await uploadImageToFal(selectedImage!, falApiKey);
        
        // Generate video
        toast.info('Video olusturuluyor...');
        result = await generateVideo(prompt, imageUrl, falApiKey);
      } else {
        // Upload multiple images
        toast.info('Gorseller yukleniyor...');
        const imageUrls = await Promise.all(
          selectedImages.map(image => uploadImageToFal(image, falApiKey))
        );
        
        // Generate composite image with nano-banana
        toast.info('Nano-banana ile kompozit gorsel olusturuluyor...');
        result = await generateMultiImageVideo(prompt, imageUrls, falApiKey);
      }
      
      clearInterval(progressInterval);
      setProgress(100);
      setVideoUrl(result.video_url);
      toast.success(activeTab === 'single' ? 'Video basariyla olusturuldu!' : 'Kompozit gorsel basariyla olusturuldu!');
      
    } catch (error) {
      console.error('Video generation failed:', error);
      toast.error('Video olusturulurken hata olustu');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const downloadVideo = async () => {
    if (!videoUrl) return;
    
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `soda-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Video indiriliyor...');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Indirme basarisiz');
    }
  };

  const resetCreator = () => {
    setPrompt('');
    setSelectedImage(null);
    setSelectedImages([]);
    setVideoUrl(null);
    setProgress(0);
  };

  if (videoUrl) {
    return (
      <div className="min-h-screen px-6 pt-24 pb-12">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-inter font-bold gradient-text">
                Video Hazir!
              </h1>
            </div>
            
            <div className="w-20" />
          </div>

          {/* Video Result */}
          <div className="glass-card p-8 mb-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'single' ? (
                  <Video className="w-8 h-8 text-success" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-success" />
                )}
              </div>
              <h2 className="text-2xl font-inter font-semibold mb-2">
                {activeTab === 'single' ? 'Video Basariyla Olusturuldu!' : 'Kompozit Gorsel Basariyla Olusturuldu!'}
              </h2>
              <p className="text-muted-foreground">
                {activeTab === 'single' ? 'Videonuzu izleyin ve indirin' : 'Kompozit gorselinizi gorun ve indirin'}
              </p>
            </div>

            <div className="bg-muted/20 rounded-lg p-4 mb-6">
              {activeTab === 'single' ? (
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full rounded-lg"
                  style={{ maxHeight: '400px' }}
                />
              ) : (
                <img 
                  src={videoUrl} 
                  alt="Kompozit görsel"
                  className="w-full rounded-lg"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={downloadVideo} className="glass-button">
                <Download className="w-4 h-4 mr-2" />
                {activeTab === 'single' ? 'Video Indir' : 'Gorsel Indir'}
              </Button>
              <Button onClick={resetCreator} variant="outline" className="glass-button">
                {activeTab === 'single' ? 'Yeni Video Olustur' : 'Yeni Kompozit Olustur'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <Video className="w-24 h-24 text-primary mx-auto animate-pulse" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-inter font-bold gradient-text mb-4">
            {activeTab === 'single' ? 'Video Olusturuluyor...' : 'Kompozit Gorsel Olusturuluyor...'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {activeTab === 'single' ? 'AI videonuzu olusturuyor, lutfen bekleyin' : 'Nano-banana gorselleri birlestiriyor, lutfen bekleyin'}
          </p>
          
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="text-primary font-medium">Islem devam ediyor... ({progress}%)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-24 pb-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfa
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-inter font-bold gradient-text">
              {activeTab === 'single' ? 'Video Olusturucu' : 'Kompozit Gorsel Olusturucu'}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'single' ? 'Prompt + Gorsel = AI Video' : 'Prompt + Çoklu Gorsel = Kompozit'}
            </p>
          </div>
          
          <div className="w-20" />
        </div>

        {/* API Key Status */}
        <div className="mb-8">
          <ApiKeyStatus onSetApiKey={() => setShowApiKeyModal(true)} />
        </div>

        {/* Tab Selection */}
        <div className="glass-card p-8 mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Tek Görsel</TabsTrigger>
              <TabsTrigger value="multi">Çoklu Görsel</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Prompt Input Section */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-inter font-semibold">Video Aciklamasi</h2>
          </div>
          
          <Textarea
            placeholder="Video aciklamanizi girin..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] mb-4 cyber-input"
          />

          {/* Suggested Prompts */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-2">Ornek promptlar:</p>
            {suggestedPrompts.map((suggestedPrompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedPromptClick(suggestedPrompt)}
                className="block w-full text-left p-3 rounded-lg bg-muted/20 hover:bg-muted/30 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-primary/30"
              >
                "{suggestedPrompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-center mb-4">
            <Upload className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-inter font-semibold">
              {activeTab === 'single' ? 'Urun Gorseli' : 'Urun Gorselleri (2-6 adet)'}
            </h2>
          </div>
          
          {activeTab === 'single' ? (
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onRemoveImage={handleRemoveImage}
            />
          ) : (
            <MultiImageUpload
              onImagesSelect={handleMultiImageSelect}
              selectedImages={selectedImages}
              onRemoveImage={handleRemoveMultiImage}
              maxImages={6}
              minImages={2}
            />
          )}
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <Button 
            onClick={generateVideoContent}
            disabled={
              !prompt.trim() || 
              (activeTab === 'single' ? !selectedImage : selectedImages.length < 2) || 
              isGenerating
            }
            size="lg"
            className="glass-button text-lg px-12 py-6 font-inter font-semibold"
          >
            {activeTab === 'single' ? (
              <>
                <Video className="w-5 h-5 mr-2" />
                Video Olustur
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5 mr-2" />
                Kompozit Gorsel Olustur
              </>
            )}
          </Button>
        </div>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={(falKey, openaiKey) => {
          localStorage.setItem('fal_api_key', falKey);
          if (openaiKey) {
            localStorage.setItem('openai_api_key', openaiKey);
          }
          setShowApiKeyModal(false);
          window.dispatchEvent(new Event('storage'));
        }}
      />
    </div>
  );
};
