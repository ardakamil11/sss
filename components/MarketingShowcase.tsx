import { Play, Image, FileText, Users, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketingShowcaseProps {
  onGetStarted: () => void;
}

export const MarketingShowcase = ({ onGetStarted }: MarketingShowcaseProps) => {
  const segments = [
    {
      id: 1,
      title: "Gen Z (18-25)",
      icon: TrendingUp,
      description: "Sosyal medya odaklı, trend takipçisi",
      color: "primary",
      contents: {
        video: {
          title: "TikTok Trend Video",
          description: "15 saniyelik viral içerik scriptleri",
          example: "🔥 Bu trendi denedin mi?\n[Hook: 0-3sn] Bekle, bu ne?\n[Reveal: 3-8sn] İşte gizli formül...\n[CTA: 8-15sn] Yorumlarda anlat! 👇"
        },
        image: {
          title: "Instagram Story Görseli",
          description: "Neon efektli, minimalist tasarım",
          example: "Gradient arka plan + Bold tipografi\n'YENİ TREND 🚨'\nSwipe-up animasyonu"
        },
        text: {
          title: "Sosyal Medya Postu",
          description: "Emoji-rich, conversation starter",
          example: "Bugün keşfettiğim şey beni şok etti 😱\n\nHem bütçe dostu hem de süper etkili! ✨\n\n👆 Hikayemde detaylar var\n💬 Sen ne düşünüyorsun?\n\n#genz #trend #keşfet"
        }
      }
    },
    {
      id: 2,
      title: "Millenial (26-35)", 
      icon: Users,
      description: "Kariyer odaklı, marka bilinçli",
      color: "secondary",
      contents: {
        video: {
          title: "LinkedIn Video İçeriği",
          description: "Profesyonel değer odaklı",
          example: "🎯 Kariyer ipucu serisi\n[Açılış] Bugün size paylaşacağım 3 ipucu...\n[Ana içerik] ✅ Tip 1: Network kurun\n[Kapanış] Hangi ipucunu deneyeceksiniz?"
        },
        image: {
          title: "Professional Infographic",
          description: "Data-driven, temiz tasarım",
          example: "İstatistik + Minimalist grafik\n'İş dünyasında başarının %80'i...'\nProfesyonel renk paleti"
        },
        text: {
          title: "Newsletter İçeriği",
          description: "Değer odaklı, uzun soluklu",
          example: "Merhaba [İsim],\n\nBu hafta pazarlama dünyasından 3 önemli gelişme:\n\n1️⃣ AI tools'ların ROI impact'i\n2️⃣ Yeni content stratejileri\n3️⃣ Data-driven decision making\n\nDetaylı analiz için..."
        }
      }
    },
    {
      id: 3,
      title: "Gen X (36-45)",
      icon: Zap,
      description: "Aile odaklı, güvenilirlik arayan",
      color: "accent",
      contents: {
        video: {
          title: "YouTube Eğitim Video",
          description: "Detaylı, öğretici format",
          example: "📚 'Nasıl Yapılır' Serisi\n[Giriş: 0-30sn] Merhaba, bugün sizlere...\n[Adımlar: 30sn-8dk] 1. Adım: İlk olarak...\n[Sonuç: 8-10dk] İşte sonuç! Sorularınız?"
        },
        image: {
          title: "Facebook Post Görseli",
          description: "Aile dostu, güven verici",
          example: "Warm tonlar + Aile fotoğrafı\n'Aileniz için en iyi seçim'\nTestimonial quote overlay"
        },
        text: {
          title: "Email Marketing",
          description: "Güven odaklı, detaylı bilgi",
          example: "Değerli müşterimiz,\n\n15 yıllık deneyimimizle, ailenizin ihtiyaçlarını anlıyoruz.\n\n✅ Kanıtlanmış kalite\n✅ 7/24 müşteri desteği\n✅ Güvenli ödeme\n\nDetaylı bilgi için..."
        }
      }
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return {
          border: 'border-primary/20',
          glow: 'shadow-primary/20',
          text: 'text-primary',
          bg: 'bg-primary/5'
        };
      case 'secondary':
        return {
          border: 'border-secondary/20',
          glow: 'shadow-secondary/20',
          text: 'text-secondary',
          bg: 'bg-secondary/5'
        };
      case 'accent':
        return {
          border: 'border-accent/20',
          glow: 'shadow-accent/20',
          text: 'text-accent',
          bg: 'bg-accent/5'
        };
      default:
        return {
          border: 'border-primary/20',
          glow: 'shadow-primary/20',
          text: 'text-primary',
          bg: 'bg-primary/5'
        };
    }
  };

  return (
    <section className="py-24 px-6 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-inter font-black mb-6">
            <span className="gradient-text">Her Segmente Özel</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI algoritmamız her yaş grubuna özel <span className="text-primary font-semibold">video, görsel ve metin</span> içerikleri üretir
          </p>
        </div>

        {/* Segments Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {segments.map((segment) => {
            const colors = getColorClasses(segment.color);
            const IconComponent = segment.icon;
            
            return (
              <div
                key={segment.id}
                className={`glass-card p-8 hover-lift ${colors.border} ${colors.glow} shadow-2xl`}
              >
                {/* Segment Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <h3 className="text-2xl font-inter font-bold mb-2">{segment.title}</h3>
                  <p className="text-muted-foreground">{segment.description}</p>
                </div>

                {/* Content Types */}
                <div className="space-y-6">
                  {/* Video Content */}
                  <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
                    <div className="flex items-center mb-3">
                      <Play className={`w-5 h-5 ${colors.text} mr-2`} />
                      <h4 className="font-semibold">{segment.contents.video.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {segment.contents.video.description}
                    </p>
                    <div className="text-xs bg-background/50 p-3 rounded border font-mono">
                      {segment.contents.video.example}
                    </div>
                  </div>

                  {/* Image Content */}
                  <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
                    <div className="flex items-center mb-3">
                      <Image className={`w-5 h-5 ${colors.text} mr-2`} />
                      <h4 className="font-semibold">{segment.contents.image.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {segment.contents.image.description}
                    </p>
                    <div className="text-xs bg-background/50 p-3 rounded border font-mono">
                      {segment.contents.image.example}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
                    <div className="flex items-center mb-3">
                      <FileText className={`w-5 h-5 ${colors.text} mr-2`} />
                      <h4 className="font-semibold">{segment.contents.text.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {segment.contents.text.description}
                    </p>
                    <div className="text-xs bg-background/50 p-3 rounded border font-mono whitespace-pre-line">
                      {segment.contents.text.example}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-inter font-bold mb-4">
              Kendi İçeriklerinizi Üretin
            </h3>
            <p className="text-muted-foreground mb-6">
              Hedef kitlenizi belirleyin, AI sizin için özel içerikler üretsin
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="glass-button text-lg px-8 py-4 font-inter font-semibold"
            >
              Ücretsiz Dene
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};