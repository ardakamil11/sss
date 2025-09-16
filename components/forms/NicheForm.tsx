import { Store, Briefcase, Heart, Palette, Car, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface NicheFormProps {
  data: {
    niche: string;
    businessType: string;
  };
  onUpdate: (data: Partial<{ niche: string; businessType: string }>) => void;
}

const businessTypes = [
  { id: 'ecommerce', label: 'E-ticaret', icon: Store },
  { id: 'service', label: 'Hizmet', icon: Briefcase },
  { id: 'health', label: 'Sağlık & Wellness', icon: Heart },
  { id: 'creative', label: 'Kreatif & Sanat', icon: Palette },
  { id: 'automotive', label: 'Otomotiv', icon: Car },
  { id: 'realestate', label: 'Emlak', icon: Home },
];

const popularNiches = [
  'Moda & Giyim',
  'Teknoloji',
  'Güzellik & Kozmetik',
  'Fitness & Spor',
  'Yemek & Restoran',
  'Eğitim & Kurs',
  'Finansal Danışmanlık',
  'Emlak',
  'Sağlık Hizmetleri',
  'Dijital Pazarlama'
];

export const NicheForm = ({ data, onUpdate }: NicheFormProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-orbitron font-bold gradient-text mb-4">
          İşletmenizi Tanıyalım
        </h2>
        <p className="text-muted-foreground text-lg">
          AI'ın sizin için en uygun içerikleri üretebilmesi için işletmeniz hakkında bilgi verin
        </p>
      </div>

      {/* Niche Input */}
      <div className="space-y-4">
        <Label htmlFor="niche" className="text-lg font-semibold">
          İş Alanınız / Nişiniz
        </Label>
        <Input
          id="niche"
          value={data.niche}
          onChange={(e) => onUpdate({ niche: e.target.value })}
          placeholder="Örn: Online moda mağazası, fitness koçluğu, restoran..."
          className="cyber-input text-lg py-3"
        />
        
        {/* Popular Niches */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Popüler alanlardan seçin:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {popularNiches.map((niche) => (
              <Button
                key={niche}
                variant="outline"
                size="sm"
                onClick={() => onUpdate({ niche })}
                className="glass-button text-left justify-start"
              >
                {niche}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Business Type */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">
          İşletme Türünüz
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {businessTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = data.businessType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => onUpdate({ businessType: type.id })}
                className={`glass-card p-4 text-center hover-lift transition-all duration-300 ${
                  isSelected ? 'border-primary bg-primary/10' : ''
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <p className={`font-medium ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}>
                  {type.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="pt-6 border-t border-border/20">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Adım 1/3: İşletme Bilgileri</span>
          <span>{data.niche && data.businessType ? 'Tamamlandı ✓' : 'Devam edin'}</span>
        </div>
      </div>
    </div>
  );
};