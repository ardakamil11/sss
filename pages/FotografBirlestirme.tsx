import { useState } from 'react';
import { ImageIcon, Upload, Download, Loader2, Lightbulb, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiImageUpload } from '@/components/MultiImageUpload';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ApiKeyStatus } from '@/components/ApiKeyStatus';
import { AuthModals } from '@/components/auth/AuthModals';
import { useAuth } from '@/hooks/useAuth';
import { generateMultiImageVideo, uploadImageToFal } from '@/utils/falai';
import { toast } from 'sonner';

const FotografBirlestirme = () => {
  const { user, profile, deductCredit } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const suggestedPrompts = [
    "İlk ürün soldan sağa kayarken ikinci ürün yukarıdan aşağı iner, ortada buluşup birleşirler",
    "Görseller sırayla fade-in olarak belirir, dönen kamera açısıyla panoramik kompozisyon",
    "Ürünler merkeze doğru yakınlaşırken arka planda ışık efektleri ile birleşme animasyonu"
  ];

  const handleSuggestedPromptClick = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
  };

  const handleMultiImageSelect = (files: File[]) => {
    setSelectedImages(files);
  };

  const handleRemoveMultiImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateCompositeImage = async () => {
    // Check authentication
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check credits
    if (!profile || profile.credits < 1) {
      toast.error('Yetersiz kredi bakiyesi. Kompozit görsel oluşturmak için en az 1 kredi gerekli.');
      return;
    }

    if (!prompt.trim() || selectedImages.length < 2) {
      toast.error('Lütfen prompt ve en az 2 görsel ekleyin');
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

      // Upload multiple images
      toast.info('Görseller yükleniyor...');
      const imageUrls = await Promise.all(
        selectedImages.map(image => uploadImageToFal(image, falApiKey))
      );
      
      // Generate composite image with nano-banana
      toast.info('Nano-banana ile kompozit görsel oluşturuluyor...');
      const result = await generateMultiImageVideo(prompt, imageUrls, falApiKey);
      
      clearInterval(progressInterval);
      setProgress(100);
      setImageUrl(result.video_url);
      toast.success('Kompozit görsel başarıyla oluşturuldu!');
      
    } catch (error: any) {
      console.error('Composite generation failed:', error);
      toast.error(error.message || 'Kompozit görsel oluşturulurken hata oluştu');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `soda-composite-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Görsel indiriliyor...');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('İndirme başarısız');
    }
  };

  const resetCreator = () => {
    setPrompt('');
    setSelectedImages([]);
    setImageUrl(null);
    setProgress(0);
  };

  if (imageUrl) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-success/20">
                  <ImageIcon className="w-8 h-8 text-success" />
                </div>
                <CardTitle className="text-2xl text-black">Kompozit Görsel Başarıyla Oluşturuldu!</CardTitle>
                <CardDescription className="text-gray-600">Kompozit görselinizi görün ve indirin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-100 rounded-lg p-4">
                  <img 
                    src={imageUrl} 
                    alt="Kompozit görsel"
                    className="w-full rounded-lg"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                </div>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={downloadImage}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Görsel İndir
                  </Button>
                  <Button 
                    onClick={resetCreator} 
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black"
                  >
                    Yeni Kompozit Oluştur
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="relative mb-8">
              <ImageIcon className="w-24 h-24 mx-auto animate-pulse text-primary" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full animate-ping bg-primary/50"></div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Kompozit Görsel Oluşturuluyor...
            </h2>
            <p className="text-gray-400 mb-8">
              Nano-banana görselleri birleştiriyor, lütfen bekleyin
            </p>
            
            <div className="mb-4">
              <Progress value={progress} className="w-full" />
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="font-medium text-primary">İşlem devam ediyor... ({progress}%)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-primary">
              Fotoğraf Birleştirme
            </h1>
            <p className="text-gray-400">
              Çoklu görsel + prompt = kompozit görsel
            </p>
          </div>

          {/* Prompt Input */}
          <Card style={{ backgroundColor: '#1a1a1a', borderColor: '#444444' }}>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                Kompozisyon Açıklaması
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Görsellerin nasıl birleştirilmesini istediğinizi açıklayın..."
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

          {/* Multi Image Upload */}
          <Card style={{ backgroundColor: '#1a1a1a', borderColor: '#444444' }}>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Upload className="w-5 h-5 mr-2 text-primary" />
                Ürün Görselleri (2-6 adet)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MultiImageUpload
                onImagesSelect={handleMultiImageSelect}
                selectedImages={selectedImages}
                onRemoveImage={handleRemoveMultiImage}
                maxImages={6}
                minImages={2}
              />
            </CardContent>
          </Card>

          {/* Generate Button */}
          <div className="text-center">
            <Button 
              onClick={generateCompositeImage}
              disabled={!prompt.trim() || selectedImages.length < 2 || isGenerating}
              size="lg"
              className="text-lg px-12 py-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              {!user ? 'Giriş Yapın' : profile && profile.credits < 1 ? 'Yetersiz Kredi' : 'Kompozit Görsel Oluştur'}
            </Button>
            {!user && (
              <p className="text-sm text-gray-400 mt-2">
                Kompozit görsel oluşturmak için giriş yapmanız gerekiyor
              </p>
            )}
            {user && profile && profile.credits < 1 && (
              <p className="text-sm text-gray-400 mt-2">
                Kompozit görsel oluşturmak için en az 1 kredi gerekli
              </p>
            )}
          </div>

          {/* API Key Status */}
          <ApiKeyStatus onSetApiKey={() => setShowApiKeyModal(true)} />
        </div>
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

export default FotografBirlestirme;