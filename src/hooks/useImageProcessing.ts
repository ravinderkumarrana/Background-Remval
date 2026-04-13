import { useState } from 'react';
import { removeBackground, Config } from '@imgly/background-removal';

export function useImageProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeImageBackground = async (imageSource: string | File | Blob) => {
    setIsProcessing(true);
    setError(null);
    try {
      const config: Config = {
        output: {
          format: 'image/png',
          quality: 0.8,
        },
        debug: false,
      };

      const blob = await removeBackground(imageSource, config);
      const url = URL.createObjectURL(blob);
      
      // Convert blob to base64 for easier handling if needed
      const reader = new FileReader();
      return new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error('Background removal failed:', err);
      setError('Failed to remove background. Please try again.');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    removeImageBackground,
    isProcessing,
    error,
  };
}
