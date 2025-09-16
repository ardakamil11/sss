import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateCredits: (amount: number, type: 'purchase' | 'usage' | 'bonus', description?: string) => Promise<void>;
  deductCredit: () => Promise<{ success: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const createProfile = async (userId: string, fullName: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: userId,
            full_name: fullName,
            credits: 10, // Starting credits updated to 10
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      // Add welcome credits transaction
      await supabase
        .from('credit_transactions')
        .insert([
          {
            user_id: userId,
            amount: 10,
            transaction_type: 'bonus',
            description: 'Hoş geldin bonusu - 10 ücretsiz kredi!'
          }
        ]);

      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  };

  const deductCredit = async () => {
    if (!user || !profile) {
      throw new Error('Kullanıcı girişi gerekli');
    }

    if (profile.credits < 1) {
      throw new Error('Yetersiz kredi bakiyesi');
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ credits: profile.credits - 1 })
        .eq('user_id', user.id);

      if (error) throw error;

      // Add transaction record
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: -1,
          transaction_type: 'usage',
          description: 'İçerik üretimi için kredi kullanımı'
        });

      // Update local state
      setProfile(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
      
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Kredi düşürülürken hata oluştu');
    }
  };

  const updateCredits = async (amount: number, type: 'purchase' | 'usage' | 'bonus', description?: string) => {
    if (!user || !profile) return;

    try {
      // Update user profile credits
      const newCredits = type === 'usage' ? profile.credits - amount : profile.credits + amount;
      
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          credits: newCredits,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Add transaction record
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert([
          {
            user_id: user.id,
            amount: amount,
            transaction_type: type,
            description: description || `${type} - ${amount} kredi`
          }
        ]);

      if (transactionError) throw transactionError;

      // Refresh profile to get updated credits
      await refreshProfile();

      toast({
        title: "Kredi Güncellemesi",
        description: `${amount} kredi ${type === 'usage' ? 'kullanıldı' : 'eklendi'}. Güncel bakiye: ${newCredits}`,
      });

    } catch (error) {
      console.error('Error updating credits:', error);
      toast({
        title: "Hata",
        description: "Kredi güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile with initial credits
        await createProfile(data.user.id, fullName);
        
        toast({
          title: "Kayıt Başarılı! 🎉",
          description: "Hesabınız oluşturuldu ve 10 ücretsiz kredi kazandınız! Email adresinizi doğrulamayı unutmayın.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Kayıt Hatası",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Giriş Başarılı! 👋",
        description: "Hoş geldiniz! SODA.AI'ya başarıyla giriş yaptınız.",
      });
    } catch (error: any) {
      toast({
        title: "Giriş Hatası",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all local state and reload page
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Çıkış Yapıldı",
        description: "Başarıyla çıkış yaptınız. Görüşmek üzere! 👋",
      });

      // Reload page to reset all states and stop any ongoing processes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      toast({
        title: "Çıkış Hatası",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Şifre Sıfırlama",
        description: "Şifre sıfırlama bağlantısı email adresinize gönderildi.",
      });
    } catch (error: any) {
      toast({
        title: "Şifre Sıfırlama Hatası", 
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          if (isMounted) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        if (!profileData && event === 'SIGNED_IN') {
          // Create profile if it doesn't exist (for existing users)
          const newProfile = await createProfile(
            session.user.id, 
            session.user.user_metadata?.full_name || ''
          );
          if (isMounted) setProfile(newProfile);
        } else {
          if (isMounted) setProfile(profileData);
        }
      } else {
        if (isMounted) setProfile(null);
      }
      
      if (isMounted) setLoading(false);
    });

    // Set up real-time subscription for profile updates
    const profileSubscription = supabase
      .channel('user_profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: user ? `user_id=eq.${user.id}` : undefined,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            setProfile(payload.new as UserProfile);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      profileSubscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    refreshProfile,
    updateCredits,
    deductCredit,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};