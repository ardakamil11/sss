import { Bot, Github, Twitter, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-primary/20 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Hakkımızda */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Bot className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-orbitron font-bold neon-text">🥤 SODA</h3>
            </div>
            <h4 className="font-orbitron font-semibold text-foreground mb-3">Hakkımızda</h4>
            <div className="text-muted-foreground mb-4 max-w-lg space-y-3 text-sm">
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
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-orbitron font-semibold text-foreground mb-4">Ürün</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Özellikler</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Fiyatlandırma</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Entegrasyonlar</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-orbitron font-semibold text-foreground mb-4">Destek</h4>
            <ul className="space-y-2">
              <li><a href="/iletisim" className="text-muted-foreground hover:text-primary transition-colors">İletişim</a></li>
              <li><a href="/hakkimizda" className="text-muted-foreground hover:text-primary transition-colors">Hakkımızda</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Yardım Merkezi</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Topluluk</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 SODA AI. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/gizlilik-politikasi" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Gizlilik Politikası
              </a>
              <a href="/mesafeli-satis" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Mesafeli Satış Sözleşmesi
              </a>
              <a href="/teslimat-iade" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Teslimat ve İade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};