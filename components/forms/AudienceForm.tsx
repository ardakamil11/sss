import { Users, User, TrendingUp, DollarSign } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface AudienceFormProps {
  data: {
    ageGroup: string;
    gender: string;
    incomeLevel: string;
  };
  onUpdate: (data: Partial<{ ageGroup: string; gender: string; incomeLevel: string }>) => void;
}

const ageGroups = [
  { id: '18-25', label: '18-25 yaş', description: 'Gen Z - Dijital natives' },
  { id: '26-35', label: '26-35 yaş', description: 'Millennials - Kariyer odaklı' },
  { id: '36-45', label: '36-45 yaş', description: 'Gen X - Aile ve kariyer dengesi' },
  { id: '46-55', label: '46-55 yaş', description: 'Deneyimli profesyoneller' },
  { id: '55+', label: '55+ yaş', description: 'Baby Boomers - Emeklilik hazırlığı' },
];

const genderOptions = [
  { id: 'Kadın', label: 'Kadın', description: 'Kadın hedef kitle' },
  { id: 'Erkek', label: 'Erkek', description: 'Erkek hedef kitle' },
  { id: 'Karma', label: 'Karma', description: 'Tüm cinsiyetler' },
];

const incomeLevels = [
  { id: 'Ekonomik', label: 'Ekonomik', description: 'Uygun fiyat odaklı', icon: DollarSign },
  { id: 'Orta', label: 'Orta Seviye', description: 'Kalite-fiyat dengesi', icon: TrendingUp },
  { id: 'Premium', label: 'Premium', description: 'Kalite odaklı', icon: Users },
  { id: 'Lüks', label: 'Lüks', description: 'Prestij ve exclusivity', icon: User },
];

export const AudienceForm = ({ data, onUpdate }: AudienceFormProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-orbitron font-bold gradient-text mb-4">
          Hedef Kitlenizi Tanımlayın
        </h2>
        <p className="text-muted-foreground text-lg">
          AI, bu bilgilere göre size özel pazarlama stratejileri oluşturacak
        </p>
      </div>

      {/* Age Group */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center">
          <Users className="w-5 h-5 mr-2 text-primary" />
          Yaş Grubu
        </Label>
        <div className="grid gap-3">
          {ageGroups.map((age) => {
            const isSelected = data.ageGroup === age.id;
            
            return (
              <button
                key={age.id}
                onClick={() => onUpdate({ ageGroup: age.id })}
                className={`glass-card p-4 text-left hover-lift transition-all duration-300 ${
                  isSelected ? 'border-primary bg-primary/10' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`font-semibold ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}>
                      {age.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{age.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center">
          <User className="w-5 h-5 mr-2 text-secondary" />
          Cinsiyet
        </Label>
        <div className="grid md:grid-cols-3 gap-4">
          {genderOptions.map((gender) => {
            const isSelected = data.gender === gender.id;
            
            return (
              <button
                key={gender.id}
                onClick={() => onUpdate({ gender: gender.id })}
                className={`glass-card p-4 text-center hover-lift transition-all duration-300 ${
                  isSelected ? 'border-secondary bg-secondary/10' : ''
                }`}
              >
                <p className={`font-semibold mb-1 ${
                  isSelected ? 'text-secondary' : 'text-foreground'
                }`}>
                  {gender.label}
                </p>
                <p className="text-sm text-muted-foreground">{gender.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Income Level */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-accent" />
          Gelir Seviyesi
        </Label>
        <div className="grid md:grid-cols-2 gap-4">
          {incomeLevels.map((income) => {
            const Icon = income.icon;
            const isSelected = data.incomeLevel === income.id;
            
            return (
              <button
                key={income.id}
                onClick={() => onUpdate({ incomeLevel: income.id })}
                className={`glass-card p-4 text-left hover-lift transition-all duration-300 ${
                  isSelected ? 'border-accent bg-accent/10' : ''
                }`}
              >
                <div className="flex items-center mb-2">
                  <Icon className={`w-6 h-6 mr-3 ${
                    isSelected ? 'text-accent' : 'text-muted-foreground'
                  }`} />
                  <p className={`font-semibold ${
                    isSelected ? 'text-accent' : 'text-foreground'
                  }`}>
                    {income.label}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{income.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="pt-6 border-t border-border/20">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Adım 2/3: Hedef Kitle Analizi</span>
          <span>{data.ageGroup && data.gender && data.incomeLevel ? 'Tamamlandı ✓' : 'Devam edin'}</span>
        </div>
      </div>
    </div>
  );
};