import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Zap, Star, Crown, Check, Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { PaymentLogos } from '@/components/PaymentLogos';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  bonusCredits: number;
  priceUSD: number;
  priceTL: number;
  costPerCredit: number;
  savingsPercent: number;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  popular?: boolean;
  targetAudience: string;
  features: string[];
}

const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Başlangıç Paketi',
    credits: 160,
    bonusCredits: 0,
    priceUSD: 10,
    priceTL: 270,
    costPerCredit: 1.69,
    savingsPercent: 0,
    icon: <Zap className="w-6 h-6" />,
    badge: 'Başlangıç İçin İdeal',
    badgeVariant: 'secondary',
    targetAudience: 'Başlamak isteyenler, denemelik kullanım',
    features: [
      '160 kredi',
      'Temel AI özellikler',
      'Email destek'
    ]
  },
  {
    id: 'growth',
    name: 'Büyüme Paketi',
    credits: 480,
    bonusCredits: 40,
    priceUSD: 30,
    priceTL: 810,
    costPerCredit: 1.41,
    savingsPercent: 17,
    icon: <Star className="w-6 h-6" />,
    badge: 'En Popüler',
    badgeVariant: 'default',
    popular: true,
    targetAudience: 'Aktif kullanıcılar, düzenli içerik üretenler',
    features: [
      '480 + 40 bonus kredi',
      'Gelişmiş AI özellikler',
      'Öncelikli destek',
      '%17 tasarruf'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Paketi',
    credits: 1600,
    bonusCredits: 300,
    priceUSD: 100,
    priceTL: 2700,
    costPerCredit: 1.27,
    savingsPercent: 24,
    icon: <Crown className="w-6 h-6" />,
    badge: 'En İyi Değer',
    badgeVariant: 'outline',
    targetAudience: 'Ajanslar, içerik stüdyoları, yüksek hacimli kullanıcılar',
    features: [
      '1600 + 300 bonus kredi',
      'Premium AI özellikler',
      '7/24 öncelikli destek',
      'Toplu işlem imkanı',
      '%24 tasarruf'
    ]
  }
];

interface CreditPackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditPackagesModal: React.FC<CreditPackagesModalProps> = ({ isOpen, onClose }) => {
  const { updateCredits } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handlePurchase = async (pkg: CreditPackage) => {
    setIsProcessing(true);
    setSelectedPackage(pkg.id);

    try {
      const { initiateIyzicoPayment, openIyzicoCheckout } = await import('@/utils/iyzico');
      
      // Initiate iyzico payment
      const paymentResult = await initiateIyzicoPayment(pkg.id);
      
      if (paymentResult.success && paymentResult.checkoutFormUrl) {
        // Open iyzico checkout form
        openIyzicoCheckout(paymentResult.checkoutFormUrl);
        
        // Listen for payment completion
        const handlePaymentComplete = async (event: CustomEvent) => {
          try {
            const { verifyIyzicoPayment } = await import('@/utils/iyzico');
            const verification = await verifyIyzicoPayment(event.detail.token);
            
            if (verification.success) {
              // Refresh user profile to get updated credits
              await updateCredits(0, 'purchase', 'Kredi güncelleme tetiklendi');
              
              toast({
                title: "Ödeme Başarılı! 🎉",
                description: `${verification.credits} kredi hesabınıza eklendi. İyi kullanımlar!`,
              });
              
              onClose();
            } else {
              throw new Error(verification.error || 'Ödeme doğrulanamadı');
            }
          } catch (error) {
            toast({
              title: "Ödeme Doğrulama Hatası",
              description: "Ödeme doğrulanırken bir hata oluştu. Destek ile iletişime geçin.",
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
            setSelectedPackage(null);
            window.removeEventListener('iyzico-payment-completed', handlePaymentComplete);
          }
        };
        
        window.addEventListener('iyzico-payment-completed', handlePaymentComplete);
        
        // Reset processing state when checkout opens
        setIsProcessing(false);
        setSelectedPackage(null);
        
      } else {
        throw new Error(paymentResult.error || 'Ödeme başlatılamadı');
      }
    } catch (error) {
      toast({
        title: "Ödeme Hatası",
        description: error instanceof Error ? error.message : "Ödeme başlatılırken bir hata oluştu.",
        variant: "destructive",
      });
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Coins className="w-8 h-8" />
            Kredi Paketleri
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            AI destekli içerik üretimi için size uygun kredi paketini seçin
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6">
          {creditPackages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                pkg.popular 
                  ? 'border-primary shadow-primary/20 scale-105' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant={pkg.badgeVariant} className="px-3 py-1">
                    {pkg.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                  pkg.popular ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                }`}>
                  {pkg.icon}
                </div>
                <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
                <CardDescription className="text-sm">{pkg.targetAudience}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Credits Display */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">{pkg.credits.toLocaleString('tr-TR')}</span>
                    <span className="text-muted-foreground">kredi</span>
                  </div>
                  
                  {pkg.bonusCredits > 0 && (
                    <div className="flex items-center justify-center gap-1 text-success">
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">{pkg.bonusCredits} bonus kredi ücretsiz!</span>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold">${pkg.priceUSD}</span>
                    <span className="text-lg text-muted-foreground">≈ ₺{pkg.priceTL.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Kredi başına: ≈ ₺{pkg.costPerCredit.toFixed(2)}
                  </div>
                  {pkg.savingsPercent > 0 && (
                    <Badge variant="outline" className="text-success border-success">
                      %{pkg.savingsPercent} tasarruf
                    </Badge>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handlePurchase(pkg)}
                  disabled={isProcessing}
                  className={`w-full ${
                    pkg.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {isProcessing && selectedPackage === pkg.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <Coins className="mr-2 h-4 w-4" />
                      Satın Al
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">Güvenli Ödeme Garantisi</p>
              <p className="text-xs text-muted-foreground">
                Tüm ödemeler SSL ile şifrelenir. 30 gün para iade garantisi.
                Kredileriniz hesabınıza anında yansır.
              </p>
            </div>
          </div>
          
          <PaymentLogos size="sm" className="justify-center" />
        </div>
      </DialogContent>
    </Dialog>
  );
};