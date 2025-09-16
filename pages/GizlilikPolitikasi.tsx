import React from 'react';

const GizlilikPolitikasi = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">Gizlilik Politikası</h1>
        
        <div className="prose prose-lg max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">1. Genel Bilgiler</h2>
            <p className="text-muted-foreground leading-relaxed">
              SODA olarak, kişisel verilerinizin güvenliği konusunda hassas davranmakta ve 
              6698 sayılı Kişisel Verilerin Korunması Kanunu'na tam uyum sağlamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">2. Toplanan Veriler</h2>
            <p className="text-muted-foreground leading-relaxed">
              Hizmetlerimizi kullanırken aşağıdaki kişisel verileriniz toplanabilir:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-3 space-y-2">
              <li>Ad, soyad ve e-posta adresi</li>
              <li>Ödeme bilgileri (güvenli şekilde işlenir)</li>
              <li>Kullanım istatistikleri ve tercihleri</li>
              <li>IP adresi ve tarayıcı bilgileri</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">3. Verilerin Kullanımı</h2>
            <p className="text-muted-foreground leading-relaxed">
              Toplanan veriler şu amaçlarla kullanılır:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-3 space-y-2">
              <li>Hizmet kalitesini artırmak</li>
              <li>Müşteri desteği sağlamak</li>
              <li>Ödeme işlemlerini gerçekleştirmek</li>
              <li>Yasal yükümlülükleri yerine getirmek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">4. Veri Güvenliği</h2>
            <p className="text-muted-foreground leading-relaxed">
              Verileriniz SSL şifreleme ve güvenli sunucularda korunmaktadır. 
              Üçüncü taraflarla paylaşılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">5. İletişim</h2>
            <p className="text-muted-foreground leading-relaxed">
              Gizlilik politikası ile ilgili sorularınız için: info@soda.app
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GizlilikPolitikasi;