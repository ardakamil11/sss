import React from 'react';
import { Mail, Clock, MessageCircle, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Iletisim = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">İletişim</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 border border-border bg-card/50">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">E-posta İletişim</h3>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <p><strong>Genel Bilgi:</strong> info@soda.app</p>
              <p><strong>Teknik Destek:</strong> destek@soda.app</p>
              <p><strong>Satış & Ortaklık:</strong> satis@soda.app</p>
              <p><strong>Faturalama:</strong> fatura@soda.app</p>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card/50">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Çalışma Saatleri</h3>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Pazartesi - Cuma:</strong> 09:00 - 18:00</p>
              <p><strong>Cumartesi:</strong> 10:00 - 16:00</p>
              <p><strong>Pazar:</strong> Kapalı</p>
              <p className="text-primary text-sm mt-3">
                24 saat içinde yanıt garantisi
              </p>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card/50">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Hızlı Destek</h3>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <p>Acil destek için canlı destek sistemimizi kullanabilirsiniz.</p>
              <p><strong>Ortalama Yanıt Süresi:</strong> 5 dakika</p>
              <p><strong>Kullanılabilir:</strong> Çalışma saatleri içinde</p>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card/50">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Telefon Desteği</h3>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <p><strong>Destek Hattı:</strong> +90 (212) 000 00 00</p>
              <p><strong>Sadece acil durumlar için</strong></p>
              <p>E-posta iletişimi tercih edilir</p>
            </div>
          </Card>
        </div>

        <Card className="mt-8 p-6 border border-border bg-card/50">
          <h3 className="text-2xl font-semibold text-primary mb-4">Şirket Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground">
            <div>
              <p><strong>Şirket Adı:</strong> SODA Teknoloji A.Ş.</p>
              <p><strong>Vergi Dairesi:</strong> Beşiktaş Vergi Dairesi</p>
              <p><strong>Vergi No:</strong> 1234567890</p>
            </div>
            <div>
              <p><strong>Mersis No:</strong> 0123456789012345</p>
              <p><strong>Ticaret Sicil No:</strong> 123456</p>
              <p><strong>Faaliyet Konusu:</strong> Yazılım ve Teknoloji Hizmetleri</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Kayıtlı Adres:</strong> Teknoloji Mahallesi, İnovasyon Caddesi, No: 123, Kat: 5, Beşiktaş, İstanbul, Türkiye, 34357
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Iletisim;