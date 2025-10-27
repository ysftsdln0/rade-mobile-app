// BillingProvider.ts
// Faturalandırma & ödeme harici servis entegrasyonu için soyutlama
// Gerçek sistem: Stripe / Iyzico / Paddle / Internal Billing API

export interface InvoiceSummary {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
  date: string;
  dueDate: string;
}

export interface InvoiceDetail extends InvoiceSummary {
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export interface PaymentMethodSummary {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'paypal';
  lastFour?: string;
  expiryDate?: string;
  cardType?: string;
  isDefault: boolean;
}

export interface PaymentResult {
  success: boolean;
  redirectUrl?: string; // 3DS vb. durumlar
  message?: string;
}

export interface CreatePaymentInput {
  invoiceId: string;
  methodId: string;
}

export interface IBillingProvider {
  listInvoices(userId: string): Promise<InvoiceSummary[]>;
  getInvoice(userId: string, invoiceId: string): Promise<InvoiceDetail | null>;
  listPaymentMethods(userId: string): Promise<PaymentMethodSummary[]>;
  createPayment(userId: string, input: CreatePaymentInput): Promise<PaymentResult>;
}

class MockBillingProvider implements IBillingProvider {
  private invoices: InvoiceDetail[] = [];
  private paymentMethods: PaymentMethodSummary[] = [];

  constructor() {
    // Mock veri
    for (let i = 1; i <= 4; i++) {
      this.invoices.push({
        id: `inv-${i}`,
        number: `INV-2025-00${i}`,
        amount: 100 * i,
        currency: 'USD',
        status: i % 2 === 0 ? 'paid' : 'unpaid',
        date: new Date(Date.now() - i * 86400000).toISOString(),
        dueDate: new Date(Date.now() + i * 86400000).toISOString(),
        items: [
          {
            id: `item-${i}-1`,
            description: `Hosting Paket ${i}`,
            quantity: 1,
            unitPrice: 100 * i,
            total: 100 * i,
          },
        ],
      });
    }

    this.paymentMethods = [
      {
        id: 'pm-1',
        type: 'credit_card',
        lastFour: '4242',
        expiryDate: '12/28',
        cardType: 'VISA',
        isDefault: true,
      },
      {
        id: 'pm-2',
        type: 'paypal',
        isDefault: false,
      },
    ];
  }

  async listInvoices(): Promise<InvoiceSummary[]> {
    return this.invoices.map(({ items: _items, ...rest }) => rest);
  }

  async getInvoice(_userId: string, invoiceId: string): Promise<InvoiceDetail | null> {
    return this.invoices.find((i) => i.id === invoiceId) || null;
  }

  async listPaymentMethods(): Promise<PaymentMethodSummary[]> {
    return this.paymentMethods;
  }

  async createPayment(_userId: string, input: CreatePaymentInput): Promise<PaymentResult> {
    const invoice = this.invoices.find((i) => i.id === input.invoiceId);
    if (!invoice) return { success: false, message: 'Invoice not found' };
    // Mock: invoice'u paid yap
    invoice.status = 'paid';
    return { success: true };
  }
}

export const billingProvider: IBillingProvider = new MockBillingProvider();
