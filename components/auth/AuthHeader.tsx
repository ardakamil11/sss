import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AuthModals } from './AuthModals';
import { CreditDisplay } from './CreditDisplay';
import { CreditPackagesModal } from './CreditPackagesModal';
import { UserMenu } from './UserMenu';
import { LogIn, UserPlus } from 'lucide-react';

export const AuthHeader: React.FC = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);  
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [showCreditModal, setShowCreditModal] = useState(false);

  // DEBUG: Render durumunu kontrol et
  console.log('🔍 AuthHeader Render:', {
    hasUser: !!user,
    userEmail: user?.email,
    loading,
    timestamp: new Date().toLocaleTimeString()
  });

  const handleSignInClick = () => {
    setAuthModalTab('signin');
    setShowAuthModal(true);
  };

  const handleSignUpClick = () => {
    setAuthModalTab('signup');
    setShowAuthModal(true);
  };

  const handleAddCreditsClick = () => {
    setShowCreditModal(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-20 h-8 bg-muted/50 rounded animate-pulse"></div>
        <div className="w-24 h-8 bg-muted/50 rounded animate-pulse"></div>
      </div>
    );
  }

  // Authenticated user
  if (user) {
    return (
      <>
        <div className="flex items-center gap-4">
          <CreditDisplay onAddCredits={handleAddCreditsClick} />
          <UserMenu onAddCredits={handleAddCreditsClick} />
        </div>

        <CreditPackagesModal
          isOpen={showCreditModal}
          onClose={() => setShowCreditModal(false)}
        />
      </>
    );
  }

  // Non-authenticated user - show login/signup buttons
  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSignInClick}
          variant="ghost"
          size="sm"
          className="text-foreground hover:text-primary"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Giriş Yap
        </Button>
        <Button
          onClick={handleSignUpClick}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Kayıt Ol
        </Button>
      </div>

      <AuthModals
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </>
  );
};