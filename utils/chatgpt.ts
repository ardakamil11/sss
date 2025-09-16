import { FormData } from '@/types/content';

export interface ChatGPTRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model: string;
  max_tokens?: number;
  temperature?: number;
}

export interface ChatGPTResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const generateVideoPrompt = async (
  audienceData: FormData,
  productDescription: string,
  apiKey?: string
): Promise<string> => {
  const chatGPTKey = apiKey || localStorage.getItem('openai_api_key');
  
  if (!chatGPTKey) {
    // Fallback to predefined prompts based on audience
    return generateFallbackVideoPrompt(audienceData, productDescription);
  }

  try {
    const systemPrompt = `Sen profesyonel bir video reklam senaryosu uzmanısın. Türkiye pazarı için Minimax Hailio AI video modeli ile kullanılacak video promptları yazıyorsun. 

Görevin:
1. Hedef kitle analizine göre video prompt'u oluştur
2. Ürün/hizmet açıklamasını dikkate al
3. Platform özelliklerine uygun dinamik öneriler yap
4. Minimax Hailio modeli için optimize et

Prompt kuralları:
- Kısa ve açık olmalı (max 200 karakter)
- Kamera hareketi belirt: [Pan left], [Zoom in], [Tracking shot] gibi
- Görsel stili belirt: modern, minimal, energetic vb.
- Türk kültürüne uygun olmalı`;

    const userPrompt = `Hedef Kitle Bilgileri:
- Yaş Grubu: ${audienceData.ageGroup}
- Cinsiyet: ${audienceData.gender}
- Gelir Seviyesi: ${audienceData.incomeLevel}
- Platform: ${audienceData.platform}
- İçerik Stili: ${audienceData.contentStyle}
- Sektör: ${audienceData.niche}

Ürün/Hizmet: ${productDescription}

Bu bilgilere göre Minimax Hailio modeli için video reklam prompt'u oluştur. Hedef kitleye uygun, dinamik ve etkileyici olsun.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${chatGPTKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.status}`);
    }

    const data: ChatGPTResponse = await response.json();
    return data.choices[0]?.message?.content || generateFallbackVideoPrompt(audienceData, productDescription);

  } catch (error) {
    console.error('ChatGPT API error:', error);
    return generateFallbackVideoPrompt(audienceData, productDescription);
  }
};

const generateFallbackVideoPrompt = (audienceData: FormData, productDescription: string): string => {
  const { ageGroup, gender, contentStyle, platform } = audienceData;
  
  // Age-based prompts
  const agePrompts: Record<string, string> = {
    '18-25': '[Zoom in] Modern and trendy showcase of {product}, dynamic camera movement, vibrant colors, social media style',
    '26-35': '[Pan right] Professional presentation of {product}, clean aesthetic, business-like atmosphere, confident mood',
    '36-45': '[Tracking shot] Family-friendly display of {product}, warm lighting, trustworthy presentation, quality focus',
    '46-55': '[Static shot] Traditional showcase of {product}, classic presentation, premium quality emphasis',
    '55+': '[Slow pan] Elegant presentation of {product}, sophisticated styling, reliability focus, calm atmosphere'
  };

  // Style-based modifications
  const styleModifiers: Record<string, string> = {
    'minimal': 'clean, minimalist background, simple composition',
    'energetic': 'dynamic movement, bright colors, fast-paced transitions',
    'professional': 'corporate setting, clean lines, professional lighting',
    'friendly': 'warm colors, inviting atmosphere, approachable styling',
    'luxury': 'premium materials, elegant presentation, sophisticated mood'
  };

  // Platform-specific adjustments
  const platformAdjustments: Record<string, string> = {
    'instagram': '[Vertical composition] Instagram-ready format',
    'tiktok': '[Quick cuts] TikTok-style dynamic presentation',
    'youtube': '[Cinematic] YouTube-quality production value',
    'trendyol': '[Product focus] E-commerce showcase style'
  };

  let basePrompt = agePrompts[ageGroup] || agePrompts['26-35'];
  basePrompt = basePrompt.replace('{product}', productDescription);
  
  if (styleModifiers[contentStyle]) {
    basePrompt += `, ${styleModifiers[contentStyle]}`;
  }
  
  if (platformAdjustments[platform]) {
    basePrompt = `${platformAdjustments[platform]} ${basePrompt}`;
  }

  return basePrompt;
};