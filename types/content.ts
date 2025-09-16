export interface FormData {
  niche: string;
  businessType: string;
  ageGroup: string;
  gender: string;
  incomeLevel: string;
  platform: string;
  contentStyle: string;
  contentType: string;
}

export interface AudienceSegment {
  demographic: string;
  psychographic: string;
  painPoints: string[];
  motivations: string[];
  preferredTone: string;
  keywords: string[];
}

export interface ContentGenerationParams {
  niche: string;
  audience: AudienceSegment;
  contentType: string;
  platform: string;
  style: string;
  language: 'tr' | 'en';
}

export interface GeneratedContent {
  title: string;
  body: string;
  hashtags: string[];
  callToAction: string;
  platform: string;
  timestamp: string;
}

export interface VideoGenerationRequest {
  audienceData: FormData;
  productImage: File;
  textContent: string;
}

export interface VideoGenerationResult {
  videoUrl: string;
  prompt: string;
  processedImageUrl?: string;
  duration: number;
  status: 'processing' | 'completed' | 'failed';
}