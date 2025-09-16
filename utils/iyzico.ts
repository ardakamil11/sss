import { supabase } from '@/integrations/supabase/client';
import type { IyzicoPaymentRequest, IyzicoPaymentResponse, IyzicoCallbackRequest, IyzicoCallbackResponse } from '@/types/iyzico';

export const initiateIyzicoPayment = async (packageId: string): Promise<IyzicoPaymentResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('iyzico-payment', {
      body: { 
        packageId,
        conversationId: `conv_${Date.now()}`
      } as IyzicoPaymentRequest
    });

    if (error) throw error;

    return data as IyzicoPaymentResponse;
  } catch (error) {
    console.error('Error initiating iyzico payment:', error);
    throw new Error('Ödeme başlatılırken bir hata oluştu');
  }
};

export const verifyIyzicoPayment = async (token: string): Promise<IyzicoCallbackResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('iyzico-callback', {
      body: { token } as IyzicoCallbackRequest
    });

    if (error) throw error;

    return data as IyzicoCallbackResponse;
  } catch (error) {
    console.error('Error verifying iyzico payment:', error);
    throw new Error('Ödeme doğrulanırken bir hata oluştu');
  }
};

export const openIyzicoCheckout = (checkoutFormUrl: string) => {
  // Create a modal-like overlay with iframe for iyzico checkout
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const container = document.createElement('div');
  container.style.cssText = `
    width: 90%;
    max-width: 800px;
    height: 90%;
    background: white;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
  `;

  const closeButton = document.createElement('button');
  closeButton.innerHTML = '✕';
  closeButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 15px;
    background: #ff4444;
    color: white;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10000;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const iframe = document.createElement('iframe');
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
  `;
  iframe.srcdoc = checkoutFormUrl;

  closeButton.onclick = () => {
    document.body.removeChild(overlay);
  };

  container.appendChild(closeButton);
  container.appendChild(iframe);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  // Handle message from iframe (payment completion)
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'iyzico-payment-success') {
      document.body.removeChild(overlay);
      // Trigger a custom event for payment success
      window.dispatchEvent(new CustomEvent('iyzico-payment-completed', { 
        detail: { token: event.data.token }
      }));
    }
  });
};