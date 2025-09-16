import { useState } from 'react';
import { ArrowLeft, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NicheForm } from '@/components/forms/NicheForm';
import { AudienceForm } from '@/components/forms/AudienceForm';
import { PlatformForm } from '@/components/forms/PlatformForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ApiKeyStatus } from '@/components/ApiKeyStatus';
import { useContentGeneration } from '@/hooks/useContentGeneration';
import { FormData } from '@/types/content';

interface ContentGeneratorProps {
  onBack: () => void;
}

export const ContentGenerator = ({ onBack }: ContentGeneratorProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    niche: '',
    businessType: '',
    ageGroup: '',
    gender: '',
    incomeLevel: '',
    platform: '',
    contentStyle: '',
    contentType: ''
  });

  const { 
    generateContentFromForm, 
    isGenerating, 
    error,
    showApiKeyModal,
    setShowApiKeyModal,
    handleApiKeySave
  } = useContentGeneration();

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      generateContent();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateContent = async () => {
    try {
      const content = await generateContentFromForm(formData);
      setGeneratedContent(content);
    } catch (err) {
      console.error('Content generation failed:', err);
    }
  };

  if (generatedContent) {
    return (
      <ResultsDisplay 
        content={generatedContent}
        audienceData={formData}
        onBack={onBack}
        onGenerateNew={() => {
          setGeneratedContent(null);
          setCurrentStep(1);
        }}
      />
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center">
          <div className="relative mb-8">
            <Bot className="w-24 h-24 text-primary mx-auto animate-pulse" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-orbitron font-bold gradient-text mb-4">
            AI İçeriğinizi Oluşturuyor...
          </h2>
          <p className="text-muted-foreground mb-8">
            Hedef kitleniz analiz ediliyor ve kişisel içerik üretiliyor
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="text-primary font-medium">İşlem devam ediyor...</span>
          </div>
          {error && (
            <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-medium">⚠️ Hata: {error}</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="mt-4 glass-button"
              >
                Sayfayı Yenile
              </Button>
            </div>
          )}
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
              İçerik Üreticisi
            </h1>
            <p className="text-muted-foreground">
              Adım {currentStep} / {totalSteps}
            </p>
          </div>
          
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* API Key Status */}
        <div className="mb-8">
          <ApiKeyStatus onSetApiKey={() => setShowApiKeyModal(true)} />
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="bg-muted/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-primary h-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <div className="glass-card p-8 mb-8">
          {currentStep === 1 && (
            <NicheForm 
              data={formData}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          
          {currentStep === 2 && (
            <AudienceForm 
              data={formData}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
          
          {currentStep === 3 && (
            <PlatformForm 
              data={formData}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
            className="glass-button"
          >
            Geri
          </Button>
          
          <Button 
            onClick={handleNext}
            className="glass-button px-8"
          >
            {currentStep === totalSteps ? 'İçerik Üret ⚡' : 'İleri'}
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
          // Trigger storage event to update other components
          window.dispatchEvent(new Event('storage'));
        }}
      />
    </div>
  );
};