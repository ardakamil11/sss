import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AuthModals } from '@/components/auth/AuthModals';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const TrendBulma = () => {
  const { user, profile, deductCredit } = useAuth();
  const [productName, setProductName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trendResponse, setTrendResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check credits
    if (!profile || profile.credits < 1) {
      toast.error('Yetersiz kredi bakiyesi. Trend analizi için en az 1 kredi gerekli.');
      return;
    }
    
    if (!productName.trim()) {
      setError('Lütfen bir ürün adı giriniz');
      toast.error('Ürün adı gerekli');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTrendResponse(null);

    try {
      // Deduct credit first
      await deductCredit();
      toast.success('1 kredi kullanıldı. Kalan kredi: ' + (profile.credits - 1));

      console.log('Trend analizi başlatılıyor:', productName.trim());
      
      // Webhook çağrısı (arka planda)
      fetch("https://ardaoztrk999.app.n8n.cloud/webhook/soda-trend", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ query: productName.trim() })
      }).catch(error => {
        console.log('Webhook hatası (normal):', error);
      });

      // 2 dakika sonra sonucu göster
      setTimeout(() => {
        setTrendResponse({ success: true });
        setIsLoading(false);
        toast.success('Trend analizi tamamlandı!');
      }, 120000); // 2 dakika = 120000ms
      
    } catch (error: any) {
      console.error('Hata:', error);
      setError(`Hata: ${error.message}`);
      toast.error(`Hata: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-background text-foreground min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Trend Otomasyonu</h1>
            <p className="text-muted-foreground">AI trend analizi ve öneriler</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ürün Trend Analizi</CardTitle>
          <CardDescription>
            Ürününüz için güncel trend analizini görmek ve viral fırsatları keşfetmek için ürün adınızı giriniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productName">Ürün Adı</Label>
              <Input
                id="productName"
                name="productName"
                type="text"
                placeholder="Ürün adı (örn: altın takı)"
                value={productName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {isLoading && (
                <p className="text-sm text-muted-foreground">İşlem birkaç dakika sürebilir…</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !productName.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Çalıştırılıyor...
                </>
              ) : !user ? (
                'Giriş Yapın'
              ) : profile && profile.credits < 1 ? (
                'Yetersiz Kredi'
              ) : (
                'Çalıştır'
              )}
            </Button>
            {!user && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Trend analizi için giriş yapmanız gerekiyor
              </p>
            )}
            {user && profile && profile.credits < 1 && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Trend analizi için en az 1 kredi gerekli
              </p>
            )}
          </form>

          {/* Hata Mesajı */}
          {error && (
            <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {/* Başarı Sonucu */}
          {trendResponse && (
            <div className="mt-6">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <h3 className="text-green-700 dark:text-green-400 font-bold text-lg mb-2">
                  ✅ Analiz Tamamlandı!
                </h3>
                <p className="text-green-600 dark:text-green-300 mb-4">
                  "{productName}" için trend analizi başarıyla tamamlandı.
                </p>
                
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                >
                  <a
                    href="https://docs.google.com/spreadsheets/d/1bXOr0YSiKnWisG2d_t77kyF_Px9Oovwf6t7rwui6BJI/edit?gid=0#gid=0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Linke tıklayın
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auth Modal */}
      <AuthModals
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
      />
    </div>
  );
};

export default TrendBulma;