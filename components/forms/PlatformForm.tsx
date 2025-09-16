import { Instagram, Music, ShoppingBag, Mail, FileText, Video } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface PlatformFormProps {
  data: {
    platform: string;
    contentStyle: string;
    contentType: string;
  };
  onUpdate: (data: Partial<{ platform: string; contentStyle: string; contentType: string }>) => void;
}

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400' },
  { id: 'tiktok', label: 'TikTok', icon: Music, color: 'text-purple-400' },
  { id: 'trendyol', label: 'Trendyol', icon: ShoppingBag, color: 'text-orange-400' },
  { id: 'email', label: 'E-mail', icon: Mail, color: 'text-blue-400' },
  { id: 'blog', label: 'Blog', icon: FileText, color: 'text-green-400' },
  { id: 'youtube', label: 'YouTube', icon: Video, color: 'text-red-400' },
];

const contentStyles = [
  { id: 'minimal', label: 'Sade & Minimal', description: 'Temiz, az kelimeli, profesyonel' },
  { id: 'energetic', label: 'Renkli & Enerjik', description: 'Dinamik, emoji\'li, heyecanlı' },
  { id: 'professional', label: 'Profesyonel', description: 'İş dünyasına uygun, ciddi ton' },
  { id: 'friendly', label: 'Samimi & Dostane', description: 'Sıcak, yakın, konuşkan' },
  { id: 'luxury', label: 'Lüks & Premium', description: 'Sofistike, seçkin, prestijli' },
  { id: 'funny', label: 'Eğlenceli & Komik', description: 'Mizahi, yaratıcı, dikkat çekici' },
];

const contentTypes = [
  { id: 'post', label: 'Sosyal Medya Postu', description: 'Instagram/Facebook paylaşımları' },
  { id: 'story', label: 'Story İçeriği', description: 'Kısa, dikkat çekici story\'ler' },
  { id: 'reel', label: 'Reel/Video Scripti', description: 'Video içerikleri için metin' },
  { id: 'product', label: 'Ürün Açıklaması', description: 'E-ticaret ürün tanımları' },
  { id: 'email', label: 'E-mail Kampanyası', description: 'Newsletter ve pazarlama mailleri' },
  { id: 'blog', label: 'Blog Yazısı', description: 'Uzun form içerikler' },
];

export const PlatformForm = ({ data, onUpdate }: PlatformFormProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-orbitron font-bold gradient-text mb-4">
          Platform & Stil Seçimi
        </h2>
        <p className="text-muted-foreground text-lg">
          İçeriğinizin hangi platformda ve nasıl bir tarzda olacağını belirleyin
        </p>
      </div>

      {/* Platform Selection */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">
          Hedef Platform
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isSelected = data.platform === platform.id;
            
            return (
              <button
                key={platform.id}
                onClick={() => onUpdate({ platform: platform.id })}
                className={`glass-card p-4 text-center hover-lift transition-all duration-300 ${
                  isSelected ? 'border-primary bg-primary/10' : ''
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${
                  isSelected ? 'text-primary' : platform.color
                }`} />
                <p className={`font-medium ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}>
                  {platform.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Style */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">
          İçerik Stili
        </Label>
        <div className="grid gap-3">
          {contentStyles.map((style) => {
            const isSelected = data.contentStyle === style.id;
            
            return (
              <button
                key={style.id}
                onClick={() => onUpdate({ contentStyle: style.id })}
                className={`glass-card p-4 text-left hover-lift transition-all duration-300 ${
                  isSelected ? 'border-secondary bg-secondary/10' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`font-semibold mb-1 ${
                      isSelected ? 'text-secondary' : 'text-foreground'
                    }`}>
                      {style.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 bg-secondary rounded-full flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Type */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">
          İçerik Türü
        </Label>
        <div className="grid gap-3">
          {contentTypes.map((type) => {
            const isSelected = data.contentType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => onUpdate({ contentType: type.id })}
                className={`glass-card p-4 text-left hover-lift transition-all duration-300 ${
                  isSelected ? 'border-accent bg-accent/10' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`font-semibold mb-1 ${
                      isSelected ? 'text-accent' : 'text-foreground'
                    }`}>
                      {type.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 bg-accent rounded-full flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="pt-6 border-t border-border/20">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Adım 3/3: Platform & Stil</span>
          <span>{data.platform && data.contentStyle && data.contentType ? 'Tamamlandı ✓' : 'Devam edin'}</span>
        </div>
      </div>
    </div>
  );
};