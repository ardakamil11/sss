import React from 'react';

const MesafeliSatis = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">Mesafeli Satış Sözleşmesi</h1>
        
        <div className="prose prose-lg max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">1. Taraflar</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Satıcı:</strong> SODA - AI Destekli İçerik Üreticisi<br />
              <strong>Alıcı:</strong> Hizmeti satın alan müşteri
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">2. Hizmet Tanımı</h2>
            <p className="text-muted-foreground leading-relaxed">
              SODA, yapay zeka destekli içerik üretim hizmetleri sunmaktadır. 
              Kredi tabanlı sistem ile çalışır ve dijital hizmet sağlar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">3. Ödeme Koşulları</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Ödemeler iyzico güvenli ödeme sistemi ile alınır</li>
              <li>Kredi paketleri anında hesabınıza yüklenir</li>
              <li>Tüm fiyatlar KDV dahildir</li>
              <li>Ödeme onayı sonrası hizmet kullanıma açılır</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">4. Cayma Hakkı</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dijital hizmet olması nedeniyle, kredi kullanımına başlandığında 
              cayma hakkı sona erer. Kullanılmayan krediler için iade talep edilebilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">5. Sorumlulukar</h2>
            <p className="text-muted-foreground leading-relaxed">
              SODA, hizmetin kesintisiz sunulması için çaba gösterir. 
              Teknik arızalar durumunda kredi iadesi yapılabilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">6. İletişim</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sözleşme ile ilgili sorularınız için: info@soda.app
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MesafeliSatis;