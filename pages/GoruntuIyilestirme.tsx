import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ImageUpload } from '@/components/ImageUpload';
import { ApiKeyStatus } from '@/components/ApiKeyStatus';
import { QuickApiSetup } from '@/components/QuickApiSetup';
import { AuthModals } from '@/components/auth/AuthModals';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Settings, Download, Eye, EyeOff, ChevronDown, Sparkles } from 'lucide-react';
import { enhanceImage } from '@/utils/falai';

const GoruntuIyilestirme = () => {
  console.log('GoruntuIyilestirme component rendering...');
  
  const { user, profile, deductCredit } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [lightingDirection, setLightingDirection] = useState('None');
  const [imageSize, setImageSize] = useState('square_hd');
  const [inferenceSteps, setInferenceSteps] = useState([28]);
  const [guidanceScale, setGuidanceScale] = useState([5]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setOriginalImage(null);
    setResultImage(null);
  };

  const testApiConnection = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen API anahtarınızı girin",
        variant: "destructive"
      });
      return;
    }

    setIsTestingConnection(true);
    try {
      // Simple test request to validate API key
      const testResult = await enhanceImage({
        prompt: "test",
        image_url: "https://via.placeholder.com/512",
        num_inference_steps: 1
      }, apiKey);
      
      setConnectionStatus('success');
      toast({
        title: "Başarılı",
        description: "API bağlantısı başarıyla test edildi",
      });
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Bağlantı Hatası",
        description: "API anahtarı geçersiz veya bağlantı problemi",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleEnhanceImage = async () => {
    // Check authentication
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check credits
    if (!profile || profile.credits < 1) {
      toast({
        title: "Yetersiz kredi",
        description: "Görsel iyileştirmek için en az 1 kredi gerekli.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedImage) {
      toast({
        title: "Hata",
        description: "Lütfen önce bir görsel yükleyin",
        variant: "destructive"
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Hata", 
        description: "Lütfen iyileştirme açıklaması girin",
        variant: "destructive"
      });
      return;
    }

    const currentApiKey = apiKey || localStorage.getItem('falai_api_key') || '';
    if (!currentApiKey) {
      toast({
        title: "API Anahtarı Gerekli",
        description: "Lütfen FAL.AI API anahtarınızı girin",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Deduct credit first
      await deductCredit();
      toast({
        title: "Kredi kullanıldı",
        description: `1 kredi kullanıldı. Kalan kredi: ${profile.credits - 1}`,
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await enhanceImage({
        prompt: prompt.trim(),
        negative_prompt: negativePrompt.trim(),
        image_url: selectedImage,
        initial_latent: lightingDirection,
        image_size: imageSize,
        num_inference_steps: inferenceSteps[0],
        guidance_scale: guidanceScale[0]
      }, currentApiKey);

      clearInterval(progressInterval);
      setProgress(100);

      if (result.images && result.images.length > 0) {
        setResultImage(result.images[0].url);
        toast({
          title: "Başarılı",
          description: "Görsel başarıyla iyileştirildi!",
        });
      }
    } catch (error: any) {
      toast({
        title: "İşlem Hatası",
        description: error.message || "Görsel iyileştirme sırasında hata oluştu",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'enhanced-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Görüntü İyileştirme</h1>
          <p className="text-lg text-muted-foreground">
            Görsellerinizi AI ile profesyonel kaliteye çıkarın
          </p>
        </div>

        {/* Main Content Card */}
        <Card style={{ backgroundColor: '#1a1a1a', borderColor: '#444444' }}>
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              IC Light - Profesyonel Işıklandırma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label className="text-white mb-2 block">Orijinal görselinizi yükleyin</Label>
              <ImageUpload 
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onRemoveImage={handleRemoveImage}
              />
            </div>

            {/* Prompt Input */}
            <div>
              <Label htmlFor="prompt" className="text-white mb-2 block">
                İyileştirme açıklaması
              </Label>
              <Textarea
                id="prompt"
                placeholder="perfume bottle in a volcano surrounded by lava"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-20"
                style={{ backgroundColor: '#333333', borderColor: '#555555', color: 'white' }}
              />
            </div>

            {/* Negative Prompt */}
            <div>
              <Label htmlFor="negative-prompt" className="text-white mb-2 block">
                Negatif açıklama (istemedikleriniz)
              </Label>
              <Textarea
                id="negative-prompt"
                placeholder="blurry, low quality, distorted"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="min-h-16"
                style={{ backgroundColor: '#333333', borderColor: '#555555', color: 'white' }}
              />
            </div>

            {/* Advanced Options */}
            <Collapsible open={advancedOptionsOpen} onOpenChange={setAdvancedOptionsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Gelişmiş Ayarlar
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${advancedOptionsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                {/* Lighting Direction */}
                <div>
                  <Label className="text-white mb-2 block">Işık Yönü</Label>
                  <Select value={lightingDirection} onValueChange={setLightingDirection}>
                    <SelectTrigger style={{ backgroundColor: '#333333', borderColor: '#555555', color: 'white' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">Yok</SelectItem>
                      <SelectItem value="Left">Sol</SelectItem>
                      <SelectItem value="Right">Sağ</SelectItem>
                      <SelectItem value="Top">Üst</SelectItem>
                      <SelectItem value="Bottom">Alt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Size */}
                <div>
                  <Label className="text-white mb-2 block">Görsel Boyutu</Label>
                  <Select value={imageSize} onValueChange={setImageSize}>
                    <SelectTrigger style={{ backgroundColor: '#333333', borderColor: '#555555', color: 'white' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square_hd">Kare HD</SelectItem>
                      <SelectItem value="square">Kare</SelectItem>
                      <SelectItem value="portrait_4_3">Portre 4:3</SelectItem>
                      <SelectItem value="portrait_16_9">Portre 16:9</SelectItem>
                      <SelectItem value="landscape_4_3">Yatay 4:3</SelectItem>
                      <SelectItem value="landscape_16_9">Yatay 16:9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quality Steps */}
                <div>
                  <Label className="text-white mb-2 block">
                    Kalite Adımları: {inferenceSteps[0]}
                  </Label>
                  <Slider
                    value={inferenceSteps}
                    onValueChange={setInferenceSteps}
                    min={1}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Guidance Scale */}
                <div>
                  <Label className="text-white mb-2 block">
                    Rehberlik Ölçeği: {guidanceScale[0]}
                  </Label>
                  <Slider
                    value={guidanceScale}
                    onValueChange={setGuidanceScale}
                    min={1}
                    max={20}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Process Button */}
            <Button 
              onClick={handleEnhanceImage}
              disabled={isProcessing || !selectedImage || !prompt.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-black font-semibold"
            >
              {isProcessing ? 'İşleniyor...' : !user ? 'Giriş Yapın' : profile && profile.credits < 1 ? 'Yetersiz Kredi' : 'Görüntüyü İyileştir'}
            </Button>
            {!user && (
              <p className="text-sm text-muted-foreground text-center">
                Görsel iyileştirmek için giriş yapmanız gerekiyor
              </p>
            )}
            {user && profile && profile.credits < 1 && (
              <p className="text-sm text-muted-foreground text-center">
                Görsel iyileştirmek için en az 1 kredi gerekli
              </p>
            )}

            {/* Progress Bar */}
            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-sm text-muted-foreground">
                  İşlem devam ediyor... %{progress}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Display */}
        {resultImage && (
          <Card style={{ backgroundColor: '#1a1a1a', borderColor: '#444444' }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Sonuç</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComparison(!showComparison)}
                  >
                    {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showComparison ? 'Karşılaştırmayı Gizle' : 'Karşılaştır'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadImage}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    İndir
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showComparison && originalImage ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-white mb-2 font-semibold">Orijinal</h3>
                    <img 
                      src={originalImage} 
                      alt="Orijinal" 
                      className="w-full rounded-lg border"
                    />
                  </div>
                  <div>
                    <h3 className="text-white mb-2 font-semibold">İyileştirilmiş</h3>
                    <img 
                      src={resultImage} 
                      alt="İyileştirilmiş" 
                      className="w-full rounded-lg border"
                    />
                  </div>
                </div>
              ) : (
                <img 
                  src={resultImage} 
                  alt="İyileştirilmiş görsel" 
                  className="w-full rounded-lg border"
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* API Configuration */}
        <Card style={{ backgroundColor: '#1a1a1a', borderColor: '#444444' }}>
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Lightbulb className="w-5 h-5 mr-2 text-primary" />
              API Yapılandırması
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api-key" className="text-white mb-2 block">
                FAL.AI API Anahtarı
              </Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    placeholder="fal-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{ backgroundColor: '#333333', borderColor: '#555555', color: 'white' }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <Button
                  onClick={testApiConnection}
                  disabled={isTestingConnection || !apiKey.trim()}
                  variant="outline"
                >
                  {isTestingConnection ? 'Test Ediliyor...' : 'API Bağlantısını Test Et'}
                </Button>
              </div>
            </div>

            {/* Connection Status */}
            {connectionStatus !== 'idle' && (
              <div className={`p-3 rounded-md ${
                connectionStatus === 'success' 
                  ? 'bg-green-900/30 border border-green-700' 
                  : 'bg-red-900/30 border border-red-700'
              }`}>
                <p className={`text-sm ${
                  connectionStatus === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {connectionStatus === 'success' 
                    ? '✅ API bağlantısı başarılı' 
                    : '❌ API bağlantısı başarısız'}
                </p>
              </div>
            )}

            <QuickApiSetup />
            <ApiKeyStatus onSetApiKey={() => {}} />
          </CardContent>
        </Card>
      </div>

      {/* Auth Modal */}
      <AuthModals
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
      />
    </div>
  );
};

export default GoruntuIyilestirme;