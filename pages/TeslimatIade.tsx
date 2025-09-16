import React from 'react';

const TeslimatIade = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">Teslimat ve İade Şartları</h1>
        
        <div className="prose prose-lg max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">1. Teslimat</h2>
            <p className="text-muted-foreground leading-relaxed">
              SODA dijital bir hizmettir ve fiziksel teslimat gerektirmez.
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-3 space-y-2">
              <li>Kredi paketleri ödeme onayı sonrası anında hesabınıza yüklenir</li>
              <li>Hizmet 7/24 çevrimiçi olarak kullanılabilir</li>
              <li>Üretilen içerikler anında indirilebilir</li>
              <li>Hesap bilgilerine e-posta ile ulaşabilirsiniz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">2. İade Koşulları</h2>
            <p className="text-muted-foreground leading-relaxed">
              Aşağıdaki durumlarda iade talep edilebilir:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-3 space-y-2">
              <li>Teknik arıza nedeniyle hizmet alınamaması</li>
              <li>Kullanılmayan kredi bakiyesi (14 gün içinde)</li>
              <li>Ödeme hatası durumları</li>
              <li>Müşteri memnuniyetsizliği (ilk 48 saat)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">3. İade Süreci</h2>
            <p className="text-muted-foreground leading-relaxed">
              İade talepleri için:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-3 space-y-2">
              <li>info@soda.app adresine e-posta gönderin</li>
              <li>Ödeme bilgilerinizi ve iade sebebini belirtin</li>
              <li>İadeler 7-14 iş günü içinde işlenir</li>
              <li>İade tutarı ödeme yapılan kartınıza geri yatırılır</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">4. İade Edilemeyecek Durumlar</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Kullanılmış krediler</li>
              <li>Üretilmiş ve indirilmiş içerikler</li>
              <li>14 günü geçen taleplr</li>
              <li>Hizmet şartlarına aykırı kullanım</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">5. Müşteri Hizmetleri</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>E-posta:</strong> info@soda.app<br />
              <strong>Çalışma Saatleri:</strong> 09:00 - 18:00 (Pazartesi-Cuma)<br />
              <strong>Yanıt Süresi:</strong> 24 saat içinde
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TeslimatIade;