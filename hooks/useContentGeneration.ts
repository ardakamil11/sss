import { useState } from 'react';
import { FormData, ContentGenerationParams } from '@/types/content';
import { analyzeAudience, buildPrompt } from '@/utils/promptEngineering';
import { generateContent } from '@/utils/falai';

export const useContentGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const generateContentFromForm = async (formData: FormData): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Check if API key exists
      const apiKey = localStorage.getItem('fal_api_key');
      
      if (!apiKey) {
        // Show API key modal for real generation
        setShowApiKeyModal(true);
        setIsGenerating(false);
        // Continue with demo for now
      }

      // Analyze audience based on form data
      const audienceSegment = analyzeAudience(formData);

      // Build generation parameters
      const params: ContentGenerationParams = {
        niche: formData.niche,
        audience: audienceSegment,
        contentType: formData.contentType,
        platform: formData.platform,
        style: formData.contentStyle,
        language: 'tr'
      };

      // Build the AI prompt
      const prompt = buildPrompt(params);

      // Generate content using FAL.AI
      const generatedContent = await generateContent(prompt, apiKey || undefined);

      return generatedContent;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'İçerik üretimi sırasında bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApiKeySave = (apiKey: string) => {
    setShowApiKeyModal(false);
    // Optionally restart generation with the new API key
  };

  return {
    generateContentFromForm,
    isGenerating,
    error,
    showApiKeyModal,
    setShowApiKeyModal,
    handleApiKeySave,
    clearError: () => setError(null)
  };
};