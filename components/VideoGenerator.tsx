import { useState } from 'react';
import { Play, Download, Loader2, Wand2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ImageUpload';
import { FormData, VideoGenerationResult } from '@/types/content';
import { generateVideoPrompt } from '@/utils/chatgpt';
import { generateVideo, uploadImageToFal } from '@/utils/falai';
import { toast } from 'sonner';

interface VideoGeneratorProps {
  audienceData: FormData;
  textContent: string;
  onBack: () => void;
}

export const VideoGenerator = ({ audienceData, textContent, onBack }: VideoGeneratorProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoResult, setVideoResult] = useState<VideoGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'generating' | 'completed'>('upload');

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setError(null);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const generateVideoContent = async () => {
    if (!selectedImage) {
      toast.error('Lütfen önce bir görsel yükleyin');
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generating');
    setError(null);

    try {
      // Step 1: Upload image to FAL
      toast.info('Görsel yükleniyor...');
      const imageUrl = await uploadImageToFal(selectedImage);

      // Step 2: Generate video prompt with ChatGPT
      toast.info('Video senaryosu oluşturuluyor...');
      const productDescription = `${audienceData.niche} sektöründe ${textContent.substring(0, 100)}...`;
      const videoPrompt = await generateVideoPrompt(audienceData, productDescription);

      // Step 3: Generate video with FAL.AI
      toast.info('Video üretiliyor... Bu işlem birkaç dakika sürebilir.');
      const { video_url } = await generateVideo(videoPrompt, imageUrl);

      const result: VideoGenerationResult = {
        videoUrl: video_url,
        prompt: videoPrompt,
        processedImageUrl: imageUrl,
        duration: 6,
        status: 'completed'
      };

      setVideoResult(result);
      setCurrentStep('completed');
      toast.success('Video başarıyla oluşturuldu!');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Video üretimi sırasında bir hata oluştu';
      setError(errorMessage);
      toast.error(errorMessage);
      setCurrentStep('upload');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = async () => {
    if (!videoResult?.videoUrl) return;

    try {
      const response = await fetch(videoResult.videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `soda-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Video indirildi!');
    } catch (error) {
      toast.error('Video indirme sırasında bir hata oluştu');
    }
  };

  if (currentStep === 'completed' && videoResult) {
    return (
      <div className="enterprise-container min-h-screen py-8">
        <div className="container mx-auto max-w-4xl px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
            <div className="text-center">
              <h1 className="enterprise-title text-2xl">Video Hazır</h1>
              <p className="enterprise-subtitle">AI destekli reklam filmi</p>
            </div>
            <div className="w-24" />
          </div>

          {/* Success Status */}
          <div className="status-indicator rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 border border-success/30 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-success" />
              </div>
              <div>
                <h2 className="enterprise-title text-lg text-success mb-1">
                  Video Başarıyla Oluşturuldu
                </h2>
                <p className="enterprise-subtitle">
                  AI destekli reklam filmi kullanıma hazır
                </p>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="enterprise-card rounded-lg p-6 mb-8">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-full"
                poster={videoResult.processedImageUrl}
              >
                <source src={videoResult.videoUrl} type="video/mp4" />
                Tarayıcınız video oynatmayı desteklemiyor.
              </video>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <p>Süre: {videoResult.duration} saniye</p>
                <p>Çözünürlük: 768P</p>
              </div>
              
              <Button
                onClick={downloadVideo}
                className="professional-button"
              >
                <Download className="w-4 h-4 mr-2" />
                Videoyu İndir
              </Button>
            </div>
          </div>

          {/* Video Prompt Info */}
          <div className="enterprise-card rounded-lg p-6">
            <h3 className="enterprise-title text-base mb-4">Kullanılan Video Prompt</h3>
            <div className="bg-muted/20 rounded p-4 border border-border">
              <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
                {videoResult.prompt}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enterprise-container min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Metin İçeriğe Dön
          </Button>
          <div className="text-center">
            <h1 className="enterprise-title text-2xl">Reklam Filmi Oluştur</h1>
            <p className="enterprise-subtitle">Görselinizi yükleyin, AI video üretsin</p>
          </div>
          <div className="w-24" />
        </div>

        {/* Processing State */}
        {currentStep === 'generating' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="enterprise-title text-xl mb-2">Video Oluşturuluyor</h2>
            <p className="enterprise-subtitle mb-6">Bu işlem 2-5 dakika sürebilir...</p>
            
            <div className="max-w-md mx-auto space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Görsel yüklendi</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-2 h-2 animate-spin" />
                <span>AI video senaryosu oluşturuluyor</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
                <span>Video render ediliyor</span>
              </div>
            </div>
          </div>
        )}

        {/* Upload State */}
        {currentStep === 'upload' && (
          <>
            {/* Image Upload */}
            <div className="mb-8">
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage || undefined}
                onRemoveImage={handleRemoveImage}
              />
            </div>

            {/* Audience Info */}
            {selectedImage && (
              <div className="enterprise-card rounded-lg p-6 mb-8">
                <h3 className="enterprise-title text-base mb-4">Hedef Kitle Bilgileri</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="text-muted-foreground">Yaş Grubu:</span> {audienceData.ageGroup}</p>
                    <p><span className="text-muted-foreground">Cinsiyet:</span> {audienceData.gender}</p>
                    <p><span className="text-muted-foreground">Platform:</span> {audienceData.platform}</p>
                  </div>
                  <div>
                    <p><span className="text-muted-foreground">Stil:</span> {audienceData.contentStyle}</p>
                    <p><span className="text-muted-foreground">Sektör:</span> {audienceData.niche}</p>
                    <p><span className="text-muted-foreground">Gelir:</span> {audienceData.incomeLevel}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted/20 rounded border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Metin İçerik Özeti:</p>
                  <p className="text-sm">{textContent.substring(0, 150)}...</p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <div className="text-center">
              <Button
                onClick={generateVideoContent}
                disabled={!selectedImage || isGenerating}
                className="professional-button px-8 py-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Video Üretiliyor...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Reklam Filmi Oluştur
                  </>
                )}
              </Button>
              
              {selectedImage && (
                <p className="mt-3 text-sm text-muted-foreground">
                  AI hedef kitle verilerinize göre video senaryosu oluşturacak
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};