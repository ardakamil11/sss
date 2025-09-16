import { useState } from 'react';
import { Copy, Download, ArrowLeft, RefreshCw, Check, FileText, Settings, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoGenerator } from '@/components/VideoGenerator';
import { FormData } from '@/types/content';

interface ResultsDisplayProps {
  content: string;
  audienceData: FormData;
  onBack: () => void;
  onGenerateNew: () => void;
}

export const ResultsDisplay = ({ content, audienceData, onBack, onGenerateNew }: ResultsDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Kopyalama başarısız:', err);
    }
  };

  const downloadContent = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'soda-ai-content.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Format content for display with line numbers
  const contentLines = content.split('\n');

  if (showVideoGenerator) {
    return (
      <VideoGenerator
        audienceData={audienceData}
        textContent={content}
        onBack={() => setShowVideoGenerator(false)}
      />
    );
  }

  return (
    <div className="min-h-screen enterprise-container technical-grid">
      <div className="container mx-auto max-w-5xl px-6 py-8">
        
        {/* Professional Header */}
        <header className="robotic-header pb-8 mb-8 fade-in-up">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="font-medium">Geri Dön</span>
            </Button>
            
            <div className="text-center">
              <h1 className="enterprise-title text-2xl mb-1">
                İçerik Hazırlandı
              </h1>
              <p className="enterprise-subtitle text-sm">
                AI destekli profesyonel içerik üretimi
              </p>
            </div>
            
            <div className="w-24" />
          </div>
        </header>

        {/* Status Indicator */}
        <div className="status-indicator rounded-lg p-6 mb-8 fade-in-up stagger-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 border border-success/30 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-success" strokeWidth={2} />
            </div>
            <div>
              <h2 className="enterprise-title text-lg text-success mb-1">
                Başarıyla Oluşturuldu
              </h2>
              <p className="enterprise-subtitle">
                AI destekli içerik üretimi tamamlandı ve kullanıma hazır
              </p>
            </div>
          </div>
        </div>

        {/* Code Editor Style Content Display */}
        <div className="code-container rounded-lg mb-8 fade-in-up stagger-2">
          {/* Editor Header */}
          <div className="code-header px-6 py-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full border border-muted-foreground/30"></div>
                  <div className="w-3 h-3 rounded-full border border-muted-foreground/30"></div>
                  <div className="w-3 h-3 rounded-full border border-muted-foreground/30"></div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="font-mono text-sm">soda-content.txt</span>
                </div>
              </div>
              
              {/* Action Buttons in Header */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={copyToClipboard}
                  className="professional-button h-8 px-3 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1.5" />
                      Kopyalandı
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1.5" />
                      Kopyala
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  onClick={downloadContent}
                  className="professional-button h-8 px-3 text-xs"
                >
                  <Download className="w-3 h-3 mr-1.5" />
                  İndir
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area with Line Numbers */}
          <div className="flex">
            <div className="line-numbers px-3 py-4 min-w-[3rem] text-right">
              {contentLines.map((_, index) => (
                <div key={index} className="h-6 flex items-center justify-end">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
              ))}
            </div>
            
            <div className="flex-1 p-4">
              <pre className="syntax-content whitespace-pre-wrap leading-6 overflow-x-auto">
                {content}
              </pre>
            </div>
          </div>
        </div>

        {/* Professional Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 fade-in-up stagger-3">
          <Button
            onClick={() => setShowVideoGenerator(true)}
            className="professional-button px-6 py-2.5 h-auto bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
          >
            <Play className="w-4 h-4 mr-2" />
            <span className="font-medium">Reklam Filmi Oluştur</span>
          </Button>
          
          <Button
            onClick={onGenerateNew}
            className="professional-button px-6 py-2.5 h-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="font-medium">Yeni İçerik Üret</span>
          </Button>
          
          <Button
            onClick={onBack}
            variant="outline"
            className="professional-button px-6 py-2.5 h-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-medium">Ana Sayfaya Dön</span>
          </Button>
        </div>

        {/* Professional Guidelines Section */}
        <div className="enterprise-card rounded-lg p-6 fade-in-up stagger-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded border border-border bg-muted/30 flex items-center justify-center">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="enterprise-title text-base">
              Sonraki Adımlar
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-primary mt-2.5 flex-shrink-0"></div>
                <p className="enterprise-subtitle leading-relaxed">
                  <strong>Reklam Filmi:</strong> Ürün görselinizi yükleyerek video oluşturun
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 flex-shrink-0"></div>
                <p className="enterprise-subtitle leading-relaxed">
                  İçeriği marka sesinize uygun şekilde düzenleyin
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 flex-shrink-0"></div>
                <p className="enterprise-subtitle leading-relaxed">
                  A/B test sonuçlarıyla performansı optimize edin
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2.5 flex-shrink-0"></div>
                <p className="enterprise-subtitle leading-relaxed">
                  Analitik verilerle engagement oranlarını takip edin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};