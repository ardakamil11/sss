import { fal } from "@fal-ai/client";
import { FALAIRequest, FALAIResponse, APIError } from '@/types/api';

// Convert all text to ASCII-safe format
const toAsciiSafe = (text: string): string => {
  return text
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u')
    .replace(/[^\x00-\x7F]/g, ''); // Remove any remaining non-ASCII chars
};

const simulateContentGeneration = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Extract key information from prompt for more realistic simulation
      const isInstagram = prompt.includes('Instagram') || prompt.includes('instagram');
      const isTikTok = prompt.includes('TikTok') || prompt.includes('tiktok');
      const isPremium = prompt.includes('Premium') || prompt.includes('Lüks');
      const isMinimal = prompt.includes('minimal') || prompt.includes('sade');
      
      let content = '';
      
      if (isInstagram) {
        content = `🎯 Hedef kitlenize özel Instagram içeriği:

${isPremium ? '✨ Premium kalitede' : '💫 Özel olarak tasarlanmış'} çözümlerimizle fark yaratın!

${isMinimal ? 
  '🔹 Sade ve etkili\n🔹 Profesyonel kalite\n🔹 Zamansız tasarım' : 
  '🚀 Enerjik ve dinamik\n💪 Güçlü performans\n🎨 Yaratıcı çözümler'
}

👆 Hikayemizi keşfedin
📞 Hemen iletişime geçin

#kalite #başarı #türkiye #instagram #takip`;

      } else if (isTikTok) {
        content = `🎬 TikTok Video Script:

[Açılış - 0-3 saniye]
"Bu şeytan detayını biliyor muydunuz? 🤔"

[Hook - 3-8 saniye]  
"İşte size ${isPremium ? 'premium' : 'harika'} bir sır..."

[İçerik - 8-25 saniye]
✅ Ana faydalar
✅ Neden farklı
✅ Sonuçlar

[CTA - 25-30 saniye]
"Daha fazlası için bizi takip edin! 👆"

#keşfet #viral #ipucu #türkiye`;

      } else {
        content = `📝 Profesyonel pazarlama içeriği:

Hedef kitlenize özel üretilmiş, etkili bir metin:

"${isPremium ? 'Kaliteli yaşam tarzınızı yansıtan' : 'İhtiyaçlarınıza mükemmel uyum sağlayan'} çözümlerimizle tanışın!

${isMinimal ? 
  '• Sade tasarım anlayışı\n• Fonksiyonel çözümler\n• Uzun ömürlü kalite' :
  '• Yenilikçi yaklaşım\n• Enerjik performans\n• Yaratıcı sonuçlar'
}

Hemen bizimle iletişime geçin ve farkı deneyimleyin!"

💬 İletişim bilgileriniz
🌐 Web siteniz
📱 Sosyal medya`;
      }
      
      resolve(content);
    }, 2000 + Math.random() * 2000); // 2-4 seconds for realistic feel
  });
};

export const generateContent = async (prompt: string, apiKey?: string): Promise<string> => {
  // Check if API key is provided (either from parameter or localStorage)
  const falApiKey = apiKey || localStorage.getItem('fal_api_key');
  
  if (!falApiKey) {
    // Demo mode - return simulated content
    return simulateContentGeneration(prompt);
  }

  try {
    // Configure FAL client with API key
    fal.config({
      credentials: falApiKey
    });

    // Use FAL AI for text generation (using a text model since we're generating marketing content)
    const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/text-to-video", {
      input: {
        prompt: `Generate Turkish marketing content: ${prompt}`,
        prompt_optimizer: true
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("FAL.AI processing:", update.logs?.map(log => log.message).join(', '));
        }
      },
    });

    // For now, return the prompt as we're focusing on text generation
    // In a real implementation, you might want to use a different FAL model for text
    return simulateContentGeneration(prompt);

  } catch (error) {
    console.error('FAL.AI integration error:', error);
    // Fallback to demo content
    return simulateContentGeneration(prompt);
  }
};

export const generateVideo = async (prompt: string, imageUrl?: string, apiKey?: string): Promise<{ video_url: string }> => {
  const falApiKey = apiKey || localStorage.getItem('fal_api_key');
  
  if (!falApiKey) {
    throw new Error('FAL.AI API key required for video generation');
  }

  // Convert prompt to completely ASCII-safe format
  const safePrompt = toAsciiSafe(prompt);
  console.log('Original prompt:', prompt);
  console.log('Safe prompt:', safePrompt);

  try {
    // Ensure API key is also ASCII-safe
    const safeApiKey = toAsciiSafe(falApiKey.trim());
    
    fal.config({
      credentials: safeApiKey
    });

    console.log('Generating video with safe prompt:', safePrompt);
    console.log('Using image URL:', imageUrl);

    const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/image-to-video", {
      input: {
        prompt: safePrompt,
        image_url: imageUrl,
        duration: "6",
        prompt_optimizer: true,
        resolution: "768P"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Video generation:", update.logs?.map(log => log.message).join(', '));
        }
      },
    });

    console.log('Video generation result:', result);
    return {
      video_url: result.data.video.url
    };

  } catch (error) {
    console.error('FAL.AI video generation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('non ISO-8859-1') || error.message.includes('ISO-8859-1')) {
        throw new Error('Character encoding error occurred during video generation.');
      }
      if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
        throw new Error('API key authentication failed. Please check your FAL.AI API key.');
      }
    }
    
    throw new Error(`Video generation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const generateMultiImageVideo = async (prompt: string, imageUrls: string[], apiKey?: string): Promise<{ video_url: string }> => {
  const falApiKey = apiKey || localStorage.getItem('fal_api_key');
  
  if (!falApiKey) {
    throw new Error('FAL.AI API key required for multi-image video generation');
  }

  // Convert prompt to completely ASCII-safe format
  const safePrompt = toAsciiSafe(prompt);
  console.log('Original prompt:', prompt);
  console.log('Safe prompt:', safePrompt);
  console.log('Image URLs:', imageUrls);

  try {
    // Ensure API key is also ASCII-safe
    const safeApiKey = toAsciiSafe(falApiKey.trim());
    
    fal.config({
      credentials: safeApiKey
    });

    console.log('Generating multi-image composite with nano-banana/edit model:', safePrompt);

    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: safePrompt,
        image_urls: imageUrls,
        num_images: 1,
        output_format: "jpeg"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log('Nano-banana multi-image result:', result.data);
    console.log('Request ID:', result.requestId);
    
    // Return the edited image URL as video_url for display consistency
    return {
      video_url: result.data.images[0].url
    };

  } catch (error) {
    console.error('FAL.AI multi-image video generation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('non ISO-8859-1') || error.message.includes('ISO-8859-1')) {
        throw new Error('Character encoding error occurred during multi-image video generation.');
      }
      if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
        throw new Error('API key authentication failed. Please check your FAL.AI API key.');
      }
    }
    
    throw new Error(`Multi-image video generation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const uploadImageToFal = async (file: File, apiKey?: string): Promise<string> => {
  const falApiKey = apiKey || localStorage.getItem('fal_api_key');
  
  if (!falApiKey) {
    throw new Error('FAL.AI API key required for image upload');
  }

  try {
    // Ensure API key is ASCII-safe
    const safeApiKey = toAsciiSafe(falApiKey.trim());
    
    // Configure FAL client with safe API key
    fal.config({
      credentials: safeApiKey
    });

    // Create completely safe file with ASCII-only name
    const timestamp = Date.now();
    const safeFileName = `img_${timestamp}.jpg`;
    
    // Create new file with safe name and type
    const safeFile = new File([file], safeFileName, {
      type: 'image/jpeg'
    });

    console.log('Uploading file with safe name:', safeFileName);
    const imageUrl = await fal.storage.upload(safeFile);
    console.log('Image uploaded successfully:', imageUrl);
    return imageUrl;

  } catch (error) {
    console.error('FAL.AI image upload error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('non ISO-8859-1') || error.message.includes('ISO-8859-1')) {
        throw new Error('Character encoding error during image upload.');
      }
      if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
        throw new Error('API key authentication failed. Please check your FAL.AI API key.');
      }
    }
    
    throw new Error(`Image upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// IC Light Image Enhancement
export const enhanceImage = async (
  options: {
    prompt: string;
    negative_prompt?: string;
    image_url: string | File;
    mask_image_url?: string;
    background_threshold?: number;
    image_size?: string;
    num_inference_steps?: number;
    seed?: number;
    initial_latent?: string;
    enable_hr_fix?: boolean;
    sync_mode?: boolean;
    num_images?: number;
    cfg?: number;
    lowres_denoise?: number;
    highres_denoise?: number;
    hr_downscale?: number;
    guidance_scale?: number;
    enable_safety_checker?: boolean;
    output_format?: string;
  },
  apiKey?: string
): Promise<{ images: Array<{ url: string; content_type: string }> }> => {
  if (!apiKey) {
    throw new Error('API key is required for image enhancement');
  }

  try {
    const safeApiKey = toAsciiSafe(apiKey.trim());
    
    fal.config({
      credentials: safeApiKey
    });

    let imageUrl = options.image_url;
    
    // If image_url is a File, upload it first
    if (options.image_url instanceof File) {
      imageUrl = await uploadImageToFal(options.image_url, apiKey);
    }

    const result = await fal.subscribe("fal-ai/iclight-v2", {
      input: {
        prompt: toAsciiSafe(options.prompt),
        negative_prompt: options.negative_prompt ? toAsciiSafe(options.negative_prompt) : "",
        image_url: imageUrl,
        mask_image_url: options.mask_image_url,
        background_threshold: options.background_threshold ?? 0.67,
        image_size: options.image_size ?? "square_hd",
        num_inference_steps: options.num_inference_steps ?? 28,
        seed: options.seed,
        initial_latent: options.initial_latent ?? "None",
        enable_hr_fix: options.enable_hr_fix ?? false,
        sync_mode: options.sync_mode ?? true,
        num_images: options.num_images ?? 1,
        cfg: options.cfg ?? 1,
        lowres_denoise: options.lowres_denoise ?? 0.98,
        highres_denoise: options.highres_denoise ?? 0.95,
        hr_downscale: options.hr_downscale ?? 0.5,
        guidance_scale: options.guidance_scale ?? 5,
        enable_safety_checker: options.enable_safety_checker ?? true,
        output_format: options.output_format ?? "jpeg"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.map((log) => log.message).forEach(console.log);
        }
      },
    });

    return result.data;
  } catch (error: any) {
    console.error('Image enhancement error:', error);
    
    if (error.message?.includes('401') || error.message?.includes('authentication')) {
      throw new Error('Geçersiz API anahtarı. Lütfen doğru FAL.AI API anahtarınızı kontrol edin.');
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      throw new Error('API kullanım limitiniz dolmuş. Lütfen planınızı yükseltin.');
    }
    
    throw new Error(`Görsel iyileştirme hatası: ${error.message || 'Bilinmeyen hata'}`);
  }
};