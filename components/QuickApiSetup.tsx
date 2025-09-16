import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Settings } from 'lucide-react';
import { toast } from 'sonner';

export const QuickApiSetup = () => {
  const [apiKey, setApiKey] = useState('e94c8b82-0ab8-4a93-a307-397c4253450a:dd0e35431b6d9cd3ba1dc9e8cc8a1d30');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSetup = () => {
    setIsLoading(true);
    
    // Save to localStorage
    localStorage.setItem('fal_api_key', apiKey);
    
    // Show success message
    toast.success('FAL.AI API anahtarı başarıyla kaydedildi');
    
    // Trigger a storage event to update other components
    window.dispatchEvent(new Event('storage'));
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="glass-card border-border max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-inter text-primary">
          <Settings className="w-5 h-5" />
          API Anahtarı Kurulumu
        </CardTitle>
        <CardDescription>
          FAL.AI API anahtarınızı güvenli şekilde ekleyin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">API Anahtarı:</label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="cyber-input font-mono text-xs"
            placeholder="API anahtarınızı buraya yapıştırın..."
          />
        </div>
        
        <Button 
          onClick={handleQuickSetup}
          disabled={isLoading || !apiKey.trim()}
          className="w-full glass-button"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Key className="w-4 h-4 mr-2" />
              API Anahtarını Kaydet
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Anahtarınız güvenli şekilde tarayıcınızda saklanacak
        </p>
      </CardContent>
    </Card>
  );
};