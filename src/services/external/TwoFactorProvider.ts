// TwoFactorProvider.ts
// Arayüz: 2FA etkinleştirme, devre dışı bırakma, doğrulama kodu üretme veya doğrulama
// Gerçek implementasyon: Harici 2FA servisi (ör. Authy, Twilio Verify, TOTP) ile değiştirilecek

export interface TwoFactorSetupResult {
  secret?: string; // TOTP için
  qrCodeDataUrl?: string;
  recoveryCodes?: string[];
}

export interface VerifyResult {
  success: boolean;
  message?: string;
}

export interface ITwoFactorProvider {
  isEnabled(userId: string): Promise<boolean>;
  enable(userId: string): Promise<TwoFactorSetupResult>;
  disable(userId: string): Promise<void>;
  verify(userId: string, code: string): Promise<VerifyResult>;
  resend?(userId: string): Promise<void>; // SMS / Email senaryoları için opsiyonel
}

// Mock implementasyon (Frontend geliştirme sürecinde kullanılacak)
class MockTwoFactorProvider implements ITwoFactorProvider {
  private enabledUsers = new Set<string>();
  private tempSecrets: Record<string, string> = {};

  async isEnabled(userId: string): Promise<boolean> {
    return this.enabledUsers.has(userId);
  }

  async enable(userId: string): Promise<TwoFactorSetupResult> {
    const secret = 'MOCKSECRET-' + userId.slice(0, 6);
    const qrCodeDataUrl = 'data:image/png;base64,MOCKQRCODE==' ;
    const recoveryCodes = Array.from({ length: 5 }, (_, i) => `RC-${i + 1}-${userId.slice(0,4)}`);
    this.tempSecrets[userId] = secret;
    return { secret, qrCodeDataUrl, recoveryCodes };
  }

  async disable(userId: string): Promise<void> {
    this.enabledUsers.delete(userId);
    delete this.tempSecrets[userId];
  }

  async verify(userId: string, code: string): Promise<VerifyResult> {
    // Demo: herhangi bir 6 haneli kodu kabul et
    if (/^\d{6}$/.test(code)) {
      this.enabledUsers.add(userId);
      return { success: true };
    }
    return { success: false, message: 'Geçersiz kod' };
  }

  async resend(_userId: string): Promise<void> {
    // No-op (mock)
    return;
  }
}

export const twoFactorProvider: ITwoFactorProvider = new MockTwoFactorProvider();
