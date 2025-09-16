export interface IyzicoPaymentRequest {
  packageId: string;
  conversationId?: string;
}

export interface IyzicoPaymentResponse {
  success: boolean;
  checkoutFormUrl?: string;
  token?: string;
  error?: string;
}

export interface IyzicoCallbackRequest {
  token: string;
}

export interface IyzicoCallbackResponse {
  success: boolean;
  paymentStatus?: string;
  credits?: number;
  message?: string;
  error?: string;
}

export interface PaymentSession {
  id: string;
  user_id: string;
  package_id: string;
  conversation_id: string;
  token: string;
  payment_page_url: string;
  credits: number;
  bonus_credits: number;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  payment_id?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}