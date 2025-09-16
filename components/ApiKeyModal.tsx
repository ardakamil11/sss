import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Key, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (falKey: string, openaiKey?: string) => void;
}

export const ApiKeyModal = ({ isOpen, onClose, onSave }: ApiKeyModalProps) => {
  const [falApiKey, setFalApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!falApiKey.trim()) {
      setError('FAL.AI API anahtarı gerekli');
      return;
    }

    // FAL.AI API key format validation
    if (!falApiKey.includes('-') && !falApiKey.includes(':')) {
      setError('Geçerli bir FAL.AI API anahtarı giriniz');
      return;
    }

    localStorage.setItem('fal_api_key', falApiKey.trim());
    
    if (openaiApiKey.trim()) {
      localStorage.setItem('openai_api_key', openaiApiKey.trim());
    }
    
    onSave(falApiKey.trim(), openaiApiKey.trim() || undefined);
    onClose();
    setFalApiKey('');
    setOpenaiApiKey('');
    setError('');
  };

  const handleClose = () => {
    onClose();
    setFalApiKey('');
    setOpenaiApiKey('');
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-inter">
            <Key className="w-5 h-5 text-primary" />
            API Anahtarları
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Video üretimi için gerekli API anahtarlarını girin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className="border-yellow-500/20 bg-yellow-500/5">
            <Shield className="w-4 h-4 text-yellow-500" />
            <AlertDescription className="text-sm">
              <strong>Güvenlik:</strong> API anahtarlarınız yalnızca tarayıcınızda saklanır.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="fal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fal">FAL.AI (Gerekli)</TabsTrigger>
              <TabsTrigger value="openai">ChatGPT (Opsiyonel)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fal" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fal-key">FAL.AI API Anahtarı *</Label>
                <Input
                  id="fal-key"
                  type="password"
                  placeholder="API anahtarınızı buraya yapıştırın..."
                  value={falApiKey}
                  onChange={(e) => setFalApiKey(e.target.value)}
                  className="cyber-input font-mono text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  <p><strong>Nasıl alınır:</strong></p>
                  <p>1. <a href="https://fal.ai" target="_blank" rel="noopener" className="text-primary hover:underline">fal.ai</a> hesabı oluşturun</p>
                  <p>2. Dashboard → API Keys → Yeni anahtar</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="openai" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">ChatGPT API Anahtarı</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-... (Opsiyonel - video prompt optimizasyonu için)"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  className="cyber-input font-mono text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  <p><strong>Faydası:</strong> Hedef kitleye özel video promptları</p>
                  <p><strong>Olmadan:</strong> Önceden tanımlı promptlar kullanılır</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 glass-button"
            >
              Kaydet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};