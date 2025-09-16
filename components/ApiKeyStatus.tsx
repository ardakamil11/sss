import { useState, useEffect } from 'react';
import { Key, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ApiKeyStatusProps {
  onSetApiKey: () => void;
}

export const ApiKeyStatus = ({ onSetApiKey }: ApiKeyStatusProps) => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('fal_api_key');
      if (apiKey) {
        setHasApiKey(true);
        setMaskedKey(apiKey.substring(0, 8) + '••••••••••••');
      } else {
        setHasApiKey(false);
        setMaskedKey('');
      }
    };

    checkApiKey();
    
    // Listen for storage changes
    window.addEventListener('storage', checkApiKey);
    
    return () => {
      window.removeEventListener('storage', checkApiKey);
    };
  }, []);

  const removeApiKey = () => {
    localStorage.removeItem('fal_api_key');
    setHasApiKey(false);
    setMaskedKey('');
  };

  if (hasApiKey) {
    return (
      <div className="flex items-center gap-3 p-3 glass-card border-primary/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-primary" />
          <Badge variant="outline" className="text-primary border-primary/30">
            API Bağlı
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {maskedKey}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={removeApiKey}
          className="text-xs text-muted-foreground hover:text-destructive"
        >
          Kaldır
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 glass-card border-yellow-500/20 rounded-lg">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-yellow-500" />
        <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
          Demo Modu
        </Badge>
      </div>
      <span className="text-xs text-muted-foreground">
        Gerçek AI için API anahtarı gerekli
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onSetApiKey}
        className="text-xs glass-button"
      >
        <Key className="w-3 h-3 mr-1" />
        API Anahtarı
      </Button>
    </div>
  );
};