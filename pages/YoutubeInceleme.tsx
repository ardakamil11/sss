import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Youtube, ExternalLink, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModals } from "@/components/auth/AuthModals";
import { toast } from "sonner";

const YoutubeInceleme = () => {
  const [productName, setProductName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, profile, deductCredit } = useAuth();

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
    setSearchError(null);
  };

  const handleProductSubmit = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!profile || profile.credits <= 0) {
      toast.error("Yeterli krediniz yok. Lütfen kredi satın alın.");
      return;
    }

    if (!productName.trim()) {
      setSearchError("Lütfen bir ürün adı girin.");
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);

      // Kredi kesme işlemi
      await deductCredit();

      // Ürün arama webhook'u çağır (şimdilik simüle ediyoruz)
      const webhookUrl = "https://hook.eu2.make.com/your-product-search-webhook-url";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: productName,
          user_id: user.id,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Ürün araması başlatılamadı");
      }

      // 2 dakika sonra başarı mesajı göster
      setTimeout(() => {
        setSearchResponse("Ürün araması tamamlandı! Detaylı raporu aşağıdaki linkten görüntüleyebilirsiniz.");
        setIsSearching(false);
        toast.success("Ürün araması başarıyla tamamlandı!");
      }, 120000); // 2 dakika

    } catch (err) {
      console.error("Ürün araması hatası:", err);
      setSearchError("Ürün araması sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      setIsSearching(false);
    }
  };

  const getProductButtonText = () => {
    if (isSearching) return "Aranıyor...";
    if (!user) return "Giriş Yap";
    if (!profile || profile.credits <= 0) return "Kredi Gerekli";
    return "Çalıştır";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
      <div className="container mx-auto max-w-4xl pt-20">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Youtube className="h-12 w-12 text-red-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              YouTube Ürün Analizi
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ürününüz için güncel trend analizini görmek ve viral fırsatları keşfetmek için ürün adınızı giriniz.
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Ürün Trend Analizi
            </CardTitle>
            <CardDescription>
              Ürününüz için güncel trend analizini görmek ve viral fırsatları keşfetmek için ürün adınızı giriniz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product-name">
                Ürün Adı
              </Label>
              <Input
                id="product-name"
                type="text"
                placeholder="Ürün adı (örn: altın takı)"
                value={productName}
                onChange={handleProductInputChange}
                className="w-full"
                disabled={isSearching}
              />
              {searchError && (
                <p className="text-sm text-destructive">{searchError}</p>
              )}
            </div>

            <Button
              onClick={handleProductSubmit}
              disabled={isSearching || (!user && !showAuthModal) || (user && (!profile || profile.credits <= 0))}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isSearching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getProductButtonText()}
            </Button>

            {isSearching && (
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-lg font-medium">Ürün trend analizi yapılıyor...</span>
                </div>
                <p className="text-muted-foreground">
                  Bu işlem yaklaşık 2 dakika sürecek. Lütfen bekleyin.
                </p>
              </div>
            )}

            {searchResponse && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Search className="h-6 w-6 text-green-600 dark:text-green-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      Ürün Trend Analizi Tamamlandı
                    </h3>
                    <p className="text-green-700 dark:text-green-300 mb-4">
                      {searchResponse}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
                      asChild
                    >
                      <a
                        href="https://docs.google.com/spreadsheets/d/1UebS12LlmV7RiJ2KSIU7Pw5whj8Ne3vN5q0UIH5RQK4/edit?gid=0#gid=0"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Trend Analizi Raporunu Görüntüle
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {showAuthModal && (
          <AuthModals 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default YoutubeInceleme;