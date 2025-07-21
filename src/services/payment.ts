import { ofetch } from 'ofetch';
import type { 
  Payment, 
  PaymentFormData, 
  PaymentMethod, 
  PaymentProvider,
  PaymentStatus 
} from '@/types/carpark';
import { apiPost, apiGet, apiPut } from '@/services/api';

// Malaysian bank codes for FPX
export const FPX_BANKS = [
  { code: 'MB2U0227', name: 'Maybank2U', logo: '/images/banks/maybank.png' },
  { code: 'CIMB', name: 'CIMB Clicks', logo: '/images/banks/cimb.png' },
  { code: 'PBB0233', name: 'Public Bank', logo: '/images/banks/public-bank.png' },
  { code: 'RHB0218', name: 'RHB Bank', logo: '/images/banks/rhb.png' },
  { code: 'HLB0224', name: 'Hong Leong Bank', logo: '/images/banks/hong-leong.png' },
  { code: 'AMBB0209', name: 'AmBank', logo: '/images/banks/ambank.png' },
  { code: 'UOB0226', name: 'UOB Bank', logo: '/images/banks/uob.png' },
  { code: 'OCBC0229', name: 'OCBC Bank', logo: '/images/banks/ocbc.png' },
  { code: 'BSN0601', name: 'Bank Simpanan Nasional', logo: '/images/banks/bsn.png' },
  { code: 'BIMB0340', name: 'Bank Islam', logo: '/images/banks/bank-islam.png' }
] as const;

// eWallet providers
export const EWALLET_PROVIDERS = [
  { code: 'tng', name: 'Touch \'n Go eWallet', logo: '/images/ewallet/tng.png' },
  { code: 'grabpay', name: 'GrabPay', logo: '/images/ewallet/grabpay.png' },
  { code: 'boost', name: 'Boost', logo: '/images/ewallet/boost.png' },
  { code: 'shopeepay', name: 'ShopeePay', logo: '/images/ewallet/shopeepay.png' }
] as const;

interface PaymentIntentRequest {
  booking_id: number;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_provider: PaymentProvider;
  return_url: string;
  cancel_url: string;
  metadata?: Record<string, any>;
}

interface PaymentIntentResponse {
  payment_intent_id: string;
  client_secret?: string;
  redirect_url?: string;
  qr_code?: string;
  status: PaymentStatus;
  expires_at: string;
}

interface FPXPaymentRequest extends PaymentIntentRequest {
  bank_code: string;
}

interface CardPaymentRequest extends PaymentIntentRequest {
  card_details: {
    card_number: string;
    expiry_month: string;
    expiry_year: string;
    cvv: string;
    cardholder_name: string;
  };
}

interface EWalletPaymentRequest extends PaymentIntentRequest {
  ewallet_provider: string;
  phone_number?: string;
}

/**
 * Payment Service for handling various Malaysian payment methods
 */
export class PaymentService {
  
  /**
   * Get available payment methods based on amount and configuration
   */
  static async getAvailablePaymentMethods(amount: number): Promise<{
    fpx: { available: boolean; min_amount?: number; max_amount?: number };
    card: { available: boolean; min_amount?: number; max_amount?: number };
    ewallet: { available: boolean; providers: typeof EWALLET_PROVIDERS };
  }> {
    try {
      const response = await apiGet<any>(`/payment/methods?amount=${amount}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Return default availability
      return {
        fpx: { available: true, min_amount: 1, max_amount: 30000 },
        card: { available: true, min_amount: 1, max_amount: 50000 },
        ewallet: { available: true, providers: EWALLET_PROVIDERS }
      };
    }
  }
  
  /**
   * Create payment intent for FPX
   */
  static async createFPXPayment(request: FPXPaymentRequest): Promise<PaymentIntentResponse> {
    try {
      const response = await apiPost<PaymentIntentResponse>('/payment/fpx/create', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create FPX payment');
    }
  }
  
  /**
   * Create payment intent for credit/debit card
   */
  static async createCardPayment(request: CardPaymentRequest): Promise<PaymentIntentResponse> {
    try {
      const response = await apiPost<PaymentIntentResponse>('/payment/card/create', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create card payment');
    }
  }
  
  /**
   * Create payment intent for eWallet
   */
  static async createEWalletPayment(request: EWalletPaymentRequest): Promise<PaymentIntentResponse> {
    try {
      const response = await apiPost<PaymentIntentResponse>('/payment/ewallet/create', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create eWallet payment');
    }
  }
  
  /**
   * Check payment status
   */
  static async getPaymentStatus(paymentIntentId: string): Promise<{
    status: PaymentStatus;
    payment?: Payment;
    failure_reason?: string;
  }> {
    try {
      const response = await apiGet<any>(`/payment/status/${paymentIntentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get payment status');
    }
  }
  
  /**
   * Confirm payment (for certain payment methods that require confirmation)
   */
  static async confirmPayment(paymentIntentId: string, confirmationData?: any): Promise<{
    status: PaymentStatus;
    redirect_url?: string;
    success: boolean;
  }> {
    try {
      const response = await apiPost<any>(`/payment/confirm/${paymentIntentId}`, confirmationData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to confirm payment');
    }
  }
  
  /**
   * Cancel/refund payment
   */
  static async cancelPayment(paymentIntentId: string, reason?: string): Promise<{
    success: boolean;
    refund_id?: string;
  }> {
    try {
      const response = await apiPost<any>(`/payment/cancel/${paymentIntentId}`, { reason });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to cancel payment');
    }
  }
  
  /**
   * Get payment history for a booking
   */
  static async getBookingPayments(bookingId: number): Promise<Payment[]> {
    try {
      const response = await apiGet<Payment[]>(`/payment/booking/${bookingId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching booking payments:', error);
      return [];
    }
  }
  
  /**
   * Calculate payment fees
   */
  static async calculateFees(amount: number, paymentMethod: PaymentMethod, provider: PaymentProvider): Promise<{
    base_amount: number;
    processing_fee: number;
    total_amount: number;
    fee_percentage: number;
  }> {
    try {
      const response = await apiPost<any>('/payment/calculate-fees', {
        amount,
        payment_method: paymentMethod,
        payment_provider: provider
      });
      return response.data;
    } catch (error: any) {
      // Default fee calculation if API is not available
      console.warn('Using default fee calculation:', error.message);
      
      let feePercentage = 0;
      switch (paymentMethod) {
        case 'fpx':
          feePercentage = 0.85; // RM 0.85 flat rate for FPX
          break;
        case 'credit_card':
          feePercentage = 2.9; // 2.9% for credit cards
          break;
        case 'ewallet':
          feePercentage = 1.5; // 1.5% for eWallets
          break;
        default:
          feePercentage = 0;
      }
      
      const processingFee = paymentMethod === 'fpx' 
        ? 0.85 
        : (amount * feePercentage) / 100;
      
      return {
        base_amount: amount,
        processing_fee: processingFee,
        total_amount: amount + processingFee,
        fee_percentage: feePercentage
      };
    }
  }
}

/**
 * Utility functions for payment handling
 */
export class PaymentUtils {
  
  /**
   * Format amount in Malaysian Ringgit
   */
  static formatMYR(amount: number): string {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(amount);
  }
  
  /**
   * Validate credit card number using Luhn algorithm
   */
  static validateCardNumber(cardNumber: string): boolean {
    const num = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(num)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }
  
  /**
   * Get card type from card number
   */
  static getCardType(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'unknown' {
    const num = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    
    return 'unknown';
  }
  
  /**
   * Mask card number for display
   */
  static maskCardNumber(cardNumber: string): string {
    const num = cardNumber.replace(/\s/g, '');
    if (num.length < 4) return num;
    
    const lastFour = num.slice(-4);
    const masked = '*'.repeat(num.length - 4);
    
    return `${masked}${lastFour}`;
  }
  
  /**
   * Generate payment reference number
   */
  static generatePaymentReference(prefix: string = 'PAY'): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`.toUpperCase();
  }
  
  /**
   * Check if payment method is available for amount
   */
  static isPaymentMethodAvailable(
    paymentMethod: PaymentMethod, 
    amount: number, 
    limits: { min_amount?: number; max_amount?: number }
  ): boolean {
    if (limits.min_amount && amount < limits.min_amount) return false;
    if (limits.max_amount && amount > limits.max_amount) return false;
    return true;
  }
}

/**
 * Payment webhook verification
 */
export class PaymentWebhook {
  
  /**
   * Verify webhook signature (implementation depends on provider)
   */
  static verifySignature(payload: string, signature: string, secret: string): boolean {
    // Implementation would depend on the payment provider
    // This is a placeholder for webhook signature verification
    console.log('Verifying webhook signature:', { payload, signature, secret });
    return true;
  }
  
  /**
   * Process webhook payload
   */
  static async processWebhook(payload: any): Promise<void> {
    try {
      // Process the webhook based on event type
      switch (payload.event_type) {
        case 'payment.completed':
          await this.handlePaymentCompleted(payload.data);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(payload.data);
          break;
        case 'payment.cancelled':
          await this.handlePaymentCancelled(payload.data);
          break;
        default:
          console.log('Unhandled webhook event:', payload.event_type);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }
  
  private static async handlePaymentCompleted(data: any): Promise<void> {
    // Update payment status in database
    await apiPut(`/payment/webhook/completed`, data);
  }
  
  private static async handlePaymentFailed(data: any): Promise<void> {
    // Update payment status and handle failure
    await apiPut(`/payment/webhook/failed`, data);
  }
  
  private static async handlePaymentCancelled(data: any): Promise<void> {
    // Update payment status and handle cancellation
    await apiPut(`/payment/webhook/cancelled`, data);
  }
} 