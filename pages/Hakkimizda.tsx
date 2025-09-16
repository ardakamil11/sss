import React from 'react';

const Hakkimizda = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">Hakkımızda</h1>
        
        <div className="prose prose-lg max-w-none text-foreground space-y-6">
          <section>
            <div className="text-muted-foreground leading-relaxed space-y-4">
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
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">İletişim Bilgileri</h2>
            <div className="bg-card p-6 rounded-lg border border-border">
              <p className="text-muted-foreground">
                <strong>E-posta:</strong> info@soda.app<br />
                <strong>Destek:</strong> destek@soda.app<br />
                <strong>İş Ortaklıkları:</strong> ortaklik@soda.app<br />
                <strong>Çalışma Saatleri:</strong> 09:00 - 18:00 (Pazartesi-Cuma)
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Hakkimizda;