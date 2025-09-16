export interface FALAIRequest {
  prompt: string;
  image_url?: string;
  duration?: "6" | "10";
  prompt_optimizer?: boolean;
  resolution?: "512P" | "768P";
}

export interface FALAIResponse {
  video: {
    url: string;
  };
}

export interface FALVideoResult {
  video_url: string;
}

export interface APIError {
  message: string;
  code: string;
  status: number;
}