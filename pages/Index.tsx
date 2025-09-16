import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Video, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "Trend Analizi Yap",
      description: "Güncel trendleri keşfet ve viral fırsatları yakala",
      action: () => navigate('/trend-bulma')
    },
    {
      icon: Users,
      title: "Rakip Analizi Yap", 
      description: "Rakiplerinin stratejilerini incele ve öne geç",
      action: () => navigate('/rakip-analizi')
    },
    {
      icon: Video,
      title: "Saniyeler İçinde Reklam Al",
      description: "Görsel yükle, prompt ekle ve anında video oluştur", 
      action: () => navigate('/urun-reklama')
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            SODA ile E-ticarette
            <span className="block text-primary">Yeni Dönem</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tek panelden içerik üret, trendleri yakala, rakipleri analiz et, satışları artır.
            <span className="text-primary font-semibold"> Profesyonel AI araçlarıyla</span> e-ticaret deneyiminizi dönüştürün.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white border-gray-200 hover:border-primary/30 transition-all duration-300 cursor-pointer group flex flex-col h-full"
              onClick={feature.action}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-800 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-gray-900 group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 mt-auto">
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group-hover:scale-105 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    feature.action();
                  }}
                >
                  Başla →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="text-center mb-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">⚡</div>
              <div className="text-2xl font-bold text-white mb-1">Hızlı</div>
              <div className="text-gray-400">Saniyeler içinde sonuç</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">🎯</div>
              <div className="text-2xl font-bold text-white mb-1">Profesyonel</div>
              <div className="text-gray-400">Yüksek kalite garantisi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">🚀</div>
              <div className="text-2xl font-bold text-white mb-1">Kolay</div>
              <div className="text-gray-400">Birkaç tıkla hazır</div>
            </div>
          </div>
        </div>

        {/* Hakkımızda Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Hakkımızda</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                Biz SODA AI olarak, e-ticaret dünyasını daha akıllı, hızlı ve verimli hale getirmeye odaklandık.
                Geliştirdiğimiz kredi tabanlı sistem sayesinde kullanıcılarımız, ihtiyaç duydukları anda yapay zekâ destekli çözümleri kolayca kullanabiliyor.
              </p>
              <p>
                Vizyonumuz, küçükten büyüğe tüm işletmelerin yapay zekâ gücünü deneyimlemesini sağlamak.
                Amacımız ise, e-ticaret yapan herkesin iş süreçlerini optimize etmesine, satışlarını artırmasına ve zamandan tasarruf etmesine yardımcı olmak. 🚀
              </p>
              <p>
                Kurucularımızdan biri, Orta Doğu Teknik Üniversitesi İstatistik ve Veri Bilimi bölümünde öğrenim görmekte; diğeri ise Yıldız Teknik Üniversitesi Mekatronik Mühendisliği mezunudur.
                Bu farklı uzmanlık alanlarını bir araya getirerek, hem veri bilimi hem de mühendislik perspektifiyle yenilikçi çözümler geliştiriyoruz.
              </p>
              <p>
                Bizim için teknoloji sadece bir araç değil; işletmelerin geleceğe daha sağlam adımlarla ilerlemesi için bir dönüşüm gücü.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Footer Note */}
        <div className="text-center mt-16 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-primary">İletişim:</strong> info@soda.app | destek@soda.app | satis@soda.app
          </p>
          <p className="text-xs text-gray-500">
            SODA Teknoloji A.Ş. - Çalışma Saatleri: 09:00-18:00 (Pazartesi-Cuma)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;