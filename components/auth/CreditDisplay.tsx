import React from 'react';
import { Button } from '@/components/ui/button';
import { Coins, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface CreditDisplayProps {
  onAddCredits: () => void;
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({ onAddCredits }) => {
  const { profile } = useAuth();

  // Show loading state if profile is not loaded yet
  if (!profile) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-8 bg-muted/50 rounded animate-pulse"></div>
        <div className="w-20 h-8 bg-muted/50 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Credit Balance */}
      <div className="flex items-center gap-2 glass-card px-3 py-2 border border-border">
        <Coins className="w-4 h-4 text-primary" />
        <span className="font-medium text-foreground">
          {profile.credits.toLocaleString('tr-TR')}
        </span>
        <span className="text-xs text-muted-foreground">kredi</span>
      </div>

      {/* Add Credits Button */}
      <Button
        onClick={onAddCredits}
        size="sm"
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="w-4 h-4 mr-1" />
        Kredi Ekle
      </Button>
    </div>
  );
};