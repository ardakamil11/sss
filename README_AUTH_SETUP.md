# 🔐 SODA.AI Authentication ve Kredi Sistemi Kurulumu

## 📋 Kurulum Adımları

### 1. Supabase Database Kurulumu

1. **Supabase Dashboard**'a gidin
2. **SQL Editor** sekmesine tıklayın
3. `src/database/schema.sql` dosyasındaki SQL kodunu kopyalayın ve çalıştırın

Bu SQL kodu şunları oluşturacak:
- ✅ `user_profiles` tablosu (kullanıcı profilleri ve kredi bakiyeleri)
- ✅ `credit_transactions` tablosu (kredi işlem geçmişi)
- ✅ Row Level Security (RLS) politikaları
- ✅ Otomatik tetikleyiciler (yeni kullanıcı kayıt bonusu)
- ✅ Real-time güncellemeler

### 2. Environment Variables (.env)

Projenizde `.env.local` dosyası oluşturun:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Bu değerleri Supabase Dashboard > Settings > API'den alabilirsiniz.

### 3. Email Authentication Ayarları

**Supabase Dashboard** > **Authentication** > **Settings**'te:

1. **Site URL**: `http://localhost:5173` (development için)
2. **Redirect URLs**: `http://localhost:5173/**`
3. **Email Templates**: İsterseniz özelleştirebilirsiniz

## 🎯 Özellikler

### ✨ Authentication Sistemi
- 📧 **Email/Password** ile kayıt ve giriş
- 🔒 **Şifremi unuttum** özelliği  
- 📱 **Responsive** modal tasarımları
- 🎨 **SODA.AI** temasına uygun UI

### 💳 Kredi Sistemi
- 🆓 **Yeni kullanıcılar 5 kredi** ile başlar
- 💰 **3 kredi paketi** (Başlangıç, Büyüme, Pro)
- 📊 **Real-time kredi güncellemeleri**
- 📈 **İşlem geçmişi** takibi
- 🎁 **Bonus kredi** sistemi

### 🔐 Güvenlik
- 🛡️ **Row Level Security** (RLS)
- 🔐 **JWT Authentication**
- 👤 **Kullanıcı bazlı veri izolasyonu**
- 🚀 **Real-time güncellemeler**

## 📱 Kullanıcı Arayüzü

### Giriş Yapmamış Kullanıcılar:
- "**Giriş Yap**" ve "**Kayıt Ol**" butonları
- Modern modal tasarımları
- Form validasyonları

### Giriş Yapmış Kullanıcılar:
- 📊 **Kredi bakiyesi** göstergesi
- ➕ "**Kredi Ekle**" butonu
- 👤 **Kullanıcı menüsü** (profil, ayarlar, çıkış)
- 📈 **İşlem geçmişi** erişimi

## 🎨 Kredi Paketleri

### 🟢 Başlangıç Paketi - $10
- **160 kredi**
- Kredi başına: **1.69 TL**
- İdeal: Yeni başlayanlar

### 🟡 Büyüme Paketi - $30 (En Popüler)
- **480 + 40 bonus kredi**
- Kredi başına: **1.41 TL** (%17 tasarruf)
- İdeal: Aktif kullanıcılar

### 🔵 Pro Paketi - $100 (En İyi Değer)
- **1600 + 300 bonus kredi**
- Kredi başına: **1.27 TL** (%24 tasarruf)
- İdeal: Ajanslar ve yüksek hacim

## 🔧 Teknik Detaylar

### Bağımlılıklar
- ✅ `@supabase/supabase-js` - Supabase client
- ✅ React Context API - State management
- ✅ Shadcn/ui - UI components
- ✅ Lucide Icons - İkonlar

### Dosya Yapısı
```
src/
├── hooks/
│   └── useAuth.tsx           # Auth context ve hooks
├── components/auth/
│   ├── AuthHeader.tsx        # Header auth bileşeni
│   ├── AuthModals.tsx        # Giriş/kayıt modalleri
│   ├── CreditDisplay.tsx     # Kredi göstergesi
│   ├── CreditPackagesModal.tsx # Kredi satın alma
│   └── UserMenu.tsx          # Kullanıcı dropdown menü
├── integrations/supabase/
│   └── client.ts             # Supabase client config
└── database/
    └── schema.sql            # Database şeması
```

## 🚀 Test Etme

1. **Kayıt Ol**: Yeni hesap oluşturun
2. **Email Doğrulama**: Email'inizi kontrol edin
3. **Giriş Yap**: Hesabınıza giriş yapın
4. **Kredi Kontrolü**: 5 başlangıç kredisini görün
5. **Kredi Ekle**: Kredi paketi satın almayı test edin

## 🎯 Sonraki Adımlar

1. **Stripe Integration**: Gerçek ödeme sistemi
2. **Email Templates**: Özelleştirilmiş email tasarımları  
3. **Analytics**: Kullanıcı davranış takibi
4. **Admin Panel**: Kredi yönetimi ve kullanıcı yönetimi

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Supabase logs'ları kontrol edin
2. Browser console'u kontrol edin
3. RLS politikalarının doğru çalıştığını kontrol edin

**🎉 Tebrikler! SODA.AI authentication ve kredi sisteminiz hazır!**