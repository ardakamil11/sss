import { useState } from 'react';
import { Type, Download, Loader2, Lightbulb, ImageIcon, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthModals } from '@/components/auth/AuthModals';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const MetinGoruntu = () => {
  const { user, profile, deductCredit } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const suggestedPrompts = [
    "Modern minimalist product photography, clean white background, professional lighting, high quality",
    "Lifestyle product shot in natural environment, warm lighting, authentic setting, photorealistic",
    "Creative product composition with artistic elements, dramatic lighting, commercial photography style"
  ];

  const handleSuggestedPromptClick = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
  };

  const generateImage = async () => {
    // Check authentication
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check credits
    if (!profile || profile.credits < 1) {
      toast.error('Yetersiz kredi bakiyesi. Görsel oluşturmak için en az 1 kredi gerekli.');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Lütfen görsel açıklaması girin');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Deduct credit first
      await deductCredit();
      toast.success('1 kredi kullanıldı. Kalan kredi: ' + (profile.credits - 1));

      // Simulate progress and API call
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 800);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Mock generated image URL
      setImageUrl('https://via.placeholder.com/512x512/4a9eff/ffffff?text=Generated+Image');
      toast.success('Görsel başarıyla oluşturuldu!');
      
    } catch (error: any) {
      console.error('Image generation failed:', error);
      toast.error(error.message || 'Görsel oluşturulurken hata oluştu');
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
      a.download = `soda-generated-${Date.now()}.jpg`;
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
    setImageUrl(null);
    setProgress(0);
  };

  if (imageUrl) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-success" />
              </div>
              <CardTitle className="text-2xl">Görsel Başarıyla Oluşturuldu!</CardTitle>
              <CardDescription>Oluşturulan görselinizi görün ve indirin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/20 rounded-lg p-4">
                <img 
                  src={imageUrl} 
                  alt="Oluşturulan görsel"
                  className="w-full rounded-lg"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={downloadImage}>
                  <Download className="w-4 h-4 mr-2" />
                  Görsel İndir
                </Button>
                <Button onClick={resetCreator} variant="outline">
                  Yeni Görsel Oluştur
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
            <Type className="w-24 h-24 text-primary mx-auto animate-pulse" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-4">
            Görsel Oluşturuluyor...
          </h2>
          <p className="text-muted-foreground mb-8">
            AI metninizden görsel oluşturuyor, lütfen bekleyin
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
            Metinden Görüntü
          </h1>
          <p className="text-muted-foreground">
            Text prompt → AI görsel üretimi
          </p>
        </div>

        {/* Prompt Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Görsel Açıklaması
            </CardTitle>
            <CardDescription>
              Ne tür bir görsel oluşturmak istediğinizi detaylı olarak açıklayın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Oluşturmak istediğiniz görseli detaylı olarak açıklayın..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px]"
            />

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Örnek promptlar:</p>
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
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center">
          <Button 
            onClick={generateImage}
            disabled={!prompt.trim() || isGenerating}
            size="lg"
            className="text-lg px-12 py-6"
          >
            <Type className="w-5 h-5 mr-2" />
            {!user ? 'Giriş Yapın' : profile && profile.credits < 1 ? 'Yetersiz Kredi' : 'Görsel Oluştur'}
          </Button>
          {!user && (
            <p className="text-sm text-muted-foreground mt-2">
              Görsel oluşturmak için giriş yapmanız gerekiyor
            </p>
          )}
          {user && profile && profile.credits < 1 && (
            <p className="text-sm text-muted-foreground mt-2">
              Görsel oluşturmak için en az 1 kredi gerekli
            </p>
          )}
        </div>
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

export default MetinGoruntu;