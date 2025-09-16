import { FormData, AudienceSegment, ContentGenerationParams } from '@/types/content';

export const analyzeAudience = (formData: FormData): AudienceSegment => {
  const { ageGroup, gender, incomeLevel } = formData;
  
  const demographic = `${ageGroup} yaş ${gender}`;
  
  const psychographicMap: Record<string, string> = {
    '18-25': 'Sosyal medya odaklı, trend takipçisi, spontane karar verici',
    '26-35': 'Kariyer odaklı, marka bilinçli, araştırmacı',
    '36-45': 'Aile odaklı, güvenilirlik arayan, deneyim değeri veren',
    '46-55': 'Kalite odaklı, geleneksel değerlere sahip, uzun vadeli düşünen',
    '55+': 'Güven odaklı, deneyimli, istikrar arayan'
  };

  const painPointsMap: Record<string, string[]> = {
    'Ekonomik': ['Bütçe kısıtları', 'Değer arayışı', 'Fiyat hassasiyeti'],
    'Orta': ['Kalite-fiyat dengesi', 'Güvenilirlik', 'Pratiklik'],
    'Premium': ['Kalite standartları', 'Hizmet beklentisi', 'Prestij'],
    'Lüks': ['Exclusivity', 'Mükemmellik', 'Statü']
  };

  const motivationsMap: Record<string, string[]> = {
    'Kadın': ['Kendini ifade etme', 'Güzellik', 'Sosyal onay', 'Aile refahı'],
    'Erkek': ['Başarı', 'Prestij', 'Güç', 'Pratiklik'],
    'Karma': ['Başarı', 'Mutluluk', 'Güvenlik', 'Sosyal bağlantı']
  };

  return {
    demographic,
    psychographic: psychographicMap[ageGroup] || 'Genel hedef kitle',
    painPoints: painPointsMap[incomeLevel] || ['Genel endişeler'],
    motivations: motivationsMap[gender] || ['Genel motivasyonlar'],
    preferredTone: incomeLevel === 'Lüks' ? 'Sofistike ve prestijli' : 
                   incomeLevel === 'Premium' ? 'Profesyonel ve güvenilir' :
                   incomeLevel === 'Orta' ? 'Samimi ve güvenilir' : 'Samimi ve erişilebilir',
    keywords: generateKeywords(formData)
  };
};

const generateKeywords = (formData: FormData): string[] => {
  const baseKeywords = [formData.niche.toLowerCase()];
  
  const platformKeywords: Record<string, string[]> = {
    'instagram': ['#insta', '#instadaily', '#photooftheday'],
    'tiktok': ['#viral', '#keşfet', '#trend'],
    'trendyol': ['#alışveriş', '#indirim', '#kampanya'],
    'email': ['özel', 'kişiye özel', 'kampanya'],
    'blog': ['rehber', 'ipuçları', 'uzman'],
    'youtube': ['video', 'tutorial', 'nasıl yapılır']
  };

  const styleKeywords: Record<string, string[]> = {
    'minimal': ['sade', 'temiz', 'minimalist'],
    'energetic': ['enerjik', 'dinamik', 'heyecanlı'],
    'professional': ['profesyonel', 'uzman', 'güvenilir'],
    'friendly': ['samimi', 'dostane', 'sıcak'],
    'luxury': ['lüks', 'premium', 'özel'],
    'funny': ['eğlenceli', 'komik', 'yaratıcı']
  };

  return [
    ...baseKeywords,
    ...(platformKeywords[formData.platform] || []),
    ...(styleKeywords[formData.contentStyle] || [])
  ];
};

export const buildPrompt = (params: ContentGenerationParams): string => {
  const { niche, audience, contentType, platform, style } = params;
  
  return `Sen profesyonel bir Türkçe pazarlama içeriği uzmanısın. Aşağıdaki bilgilere göre hedef kitleye uygun, etkileyici bir ${contentType} içeriği oluştur:

İŞ ALANI: ${niche}
PLATFORM: ${platform}
İÇERİK TÜRÜ: ${contentType}
STIL: ${style}

HEDEF KİTLE ANALİZİ:
- Demografik: ${audience.demographic}
- Psikografik: ${audience.psychographic}
- Ana Endişeler: ${audience.painPoints.join(', ')}
- Motivasyonlar: ${audience.motivations.join(', ')}
- Tercih Edilen Ton: ${audience.preferredTone}

GEREKSINIMLER:
1. Türkçe dilinde yazılmalı
2. Hedef kitleye uygun ton ve dil kullanılmalı
3. Platform özelliklerine uygun format (karakter limiti, hashtag kullanımı vb.)
4. Etkileyici başlık/açılış
5. Net call-to-action
6. Uygun emoji kullanımı
7. İlgili hashtag önerileri

YASAKLANAN:
- Abartılı vaatler
- Yanıltıcı bilgiler
- Spamsi içerik
- Kopyala-yapıştır hissi veren jenerik metinler

Lütfen orijinal, yaratıcı ve hedef kitleyi harekete geçirecek bir içerik üret.`;
};