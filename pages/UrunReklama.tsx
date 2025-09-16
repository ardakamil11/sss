import { useState } from 'react';
import { Video, Upload, Play, Download, Loader2, Lightbulb, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ImageUpload';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ApiKeyStatus } from '@/components/ApiKeyStatus';
import { AuthModals } from '@/components/auth/AuthModals';
import { useAuth } from '@/hooks/useAuth';
import { generateVideo, uploadImageToFal } from '@/utils/falai';
import { toast } from 'sonner';

const UrunReklama = () => {
  const { user, profile, deductCredit } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const suggestedPrompts = [
    "Modern living room with furniture rotating slowly, warm ambient lighting, cozy home atmosphere, camera pans around the space",
    "Bedroom furniture showcase in elegant home interior, soft natural light through windows, peaceful atmosphere, smooth camera movement",
    "Kitchen furniture display in contemporary home setting, bright lighting, clean design, professional product presentation"
  ];

  const handleSuggestedPromptClick = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const generateVideoContent = async () => {
    // Check authentication
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check credits
    if (!profile || profile.credits < 1) {
      toast.error('Yetersiz kredi bakiyesi. Video oluşturmak için en az 1 kredi gerekli.');
      return;
    }

    if (!prompt.trim() || !selectedImage) {
      toast.error('Lütfen prompt ve görsel ekleyin');
      return;
    }

    const falApiKey = localStorage.getItem('fal_api_key');
    if (!falApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Deduct credit first
      await deductCredit();
      toast.success('1 kredi kullanıldı. Kalan kredi: ' + (profile.credits - 1));

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 1000);

      // Upload image
      toast.info('Görsel yükleniyor...');
      const imageUrl = await uploadImageToFal(selectedImage, falApiKey);
      
      // Generate video
      toast.info('Video oluşturuluyor...');
      const result = await generateVideo(prompt, imageUrl, falApiKey);
      
      clearInterval(progressInterval);
      setProgress(100);
      setVideoUrl(result.video_url);
      toast.success('Video başarıyla oluşturuldu!');
      
    } catch (error: any) {
      console.error('Video generation failed:', error);
      toast.error(error.message || 'Video oluşturulurken hata oluştu');
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
      toast.error('İndirme başarısız');
    }
  };

  const resetCreator = () => {
    setPrompt('');
    setSelectedImage(null);
    setVideoUrl(null);
    setProgress(0);
  };

  if (videoUrl) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-success" />
              </div>
              <CardTitle className="text-2xl">Video Başarıyla Oluşturuldu!</CardTitle>
              <CardDescription>Videonuzu izleyin ve indirin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/20 rounded-lg p-4">
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full rounded-lg"
                  style={{ maxHeight: '400px' }}
                />
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={downloadVideo}>
                  <Download className="w-4 h-4 mr-2" />
                  Video İndir
                </Button>
                <Button onClick={resetCreator} variant="outline">
                  Yeni Video Oluştur
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <Video className="w-24 h-24 text-primary mx-auto animate-pulse" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-4">
            Video Oluşturuluyor...
          </h2>
          <p className="text-muted-foreground mb-8">
            AI videonuzu oluşturuyor, lütfen bekleyin
          </p>
          
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="text-primary font-medium">İşlem devam ediyor... ({progress}%)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Üründen Reklama
          </h1>
          <p className="text-muted-foreground">
            Ürün görseli + prompt = AI reklam videosu
          </p>
        </div>

        {/* Prompt Input */}
        <Card style={{ backgroundColor: '#1a1a1a', borderColor: '#444444' }}>
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Lightbulb className="w-5 h-5 mr-2 text-primary" />
              Video Açıklaması
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Video açıklamanızı girin..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] text-white border focus:border-primary focus:ring-primary"
              style={{ 
                backgroundColor: '#333333', 
                borderColor: '#444444',
                color: '#ffffff'
              }}
            />

            <div className="space-y-2">
              <p className="text-sm" style={{ color: '#888888' }}>Örnek promptlar:</p>
              {suggestedPrompts.map((suggestedPrompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPromptClick(suggestedPrompt)}
                  className="block w-full text-left p-3 rounded-lg text-sm transition-colors border"
                  style={{ 
                    backgroundColor: '#2a2a2a',
                    borderColor: '#444444',
                    color: '#CCFF00'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#333333';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                  }}
                >
                  "{suggestedPrompt}"
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card style={{ backgroundColor: '#1a1a1a', borderColor: '#444444' }}>
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Upload className="w-5 h-5 mr-2" />
              Ürün Görseli
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onRemoveImage={handleRemoveImage}
            />
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center">
          <Button 
            onClick={generateVideoContent}
            disabled={!prompt.trim() || !selectedImage || isGenerating}
            size="lg"
            className="text-lg px-12 py-6"
          >
            <Video className="w-5 h-5 mr-2" />
            {!user ? 'Giriş Yapın' : profile && profile.credits < 1 ? 'Yetersiz Kredi' : 'Video Oluştur'}
          </Button>
          {!user && (
            <p className="text-sm text-muted-foreground mt-2">
              Video oluşturmak için giriş yapmanız gerekiyor
            </p>
          )}
          {user && profile && profile.credits < 1 && (
            <p className="text-sm text-muted-foreground mt-2">
              Video oluşturmak için en az 1 kredi gerekli
            </p>
          )}
        </div>

        {/* API Key Status */}
        <ApiKeyStatus onSetApiKey={() => setShowApiKeyModal(true)} />
      </div>

      {/* Auth Modal */}
      <AuthModals
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
      />

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

export default UrunReklama;