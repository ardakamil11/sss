import { Video, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <div className="absolute inset-0 bg-background" />
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-inter font-black mb-6">
            <span className="professional-text">🥤 SODA</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-inter font-semibold gradient-text mb-6">
            SODA ile E-ticarette yeni dönem
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tek panelden içerik üret, trendleri yakala, rakipleri analiz et, satışları artır.
            <span className="text-primary font-semibold"> Profesyonel AI araçlarıyla</span> e-ticaret deneyiminizi dönüştürün.
          </p>
        </div>

        {/* Simple Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 hover-lift">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-primary drop-shadow-lg" style={{ filter: 'brightness(1.5) saturate(1.3)' }} />
            </div>
            <h3 className="text-lg font-inter font-semibold mb-2">Görsel Yükle</h3>
            <p className="text-muted-foreground text-sm">Ürün fotoğrafınızı sürükle bırak</p>
          </div>
          
          <div className="glass-card p-6 hover-lift">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary drop-shadow-lg" style={{ filter: 'brightness(1.5) saturate(1.3)' }} />
            </div>
            <h3 className="text-lg font-inter font-semibold mb-2">Prompt Ekle</h3>
            <p className="text-muted-foreground text-sm">Video açıklamasını yazın</p>
          </div>
          
          <div className="glass-card p-6 hover-lift">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-6 h-6 text-primary drop-shadow-lg" style={{ filter: 'brightness(1.5) saturate(1.3)' }} />
            </div>
            <h3 className="text-lg font-inter font-semibold mb-2">Video Al</h3>
            <p className="text-muted-foreground text-sm">AI ile profesyonel video</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="glass-button text-lg px-12 py-6 font-inter font-semibold"
          >
            Hemen Başla
          </Button>
          <p className="text-sm text-muted-foreground">
            Hızlı ve kolay • API anahtarı gerekli
          </p>
        </div>
      </div>
    </div>
  );
};