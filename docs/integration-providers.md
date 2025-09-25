# Dış Servis Entegrasyon Arayüzleri

Bu dosya; 2FA, faturalandırma (billing) ve monitoring için frontend tarafına eklenen soyutlama (provider) katmanlarının nasıl gerçek servislerle değiştirileceğini açıklar.

## Genel Tasarım
- `src/services/external/` altında her entegrasyon için bir arayüz (interface) ve mock implementasyon bulunur.
- Amaç: Backend hazır olmasa bile UI geliştirmesini sürdürmek ve sonradan gerçek servis SDK / REST çağrılarını kolayca eklemek.
- Değişim noktası: Sadece ilgili provider dosyasındaki mock sınıf gerçek implementasyonla değiştirilir veya yeni bir dosya eklenip index export güncellenir.

## 1. TwoFactorProvider
Dosya: `TwoFactorProvider.ts`

Arayüz Metodları:
- `isEnabled(userId)` : Kullanıcı için 2FA aktif mi?
- `enable(userId)` : 2FA aktivasyonu başlatır (TOTP ise secret + QR) -> `{ secret, qrCodeDataUrl, recoveryCodes }`
- `disable(userId)` : 2FA kapatır.
- `verify(userId, code)` : Girilen 2FA kodunu doğrular.
- `resend(userId)?` : SMS / Email tabanlı kod yenileme (opsiyonel).

Gerçek Entegrasyon Önerisi:
- TOTP: Sunucudan `otpauth://` URI alınır, frontend QR üretir veya server base64 QR verir.
- Twilio Verify / Authy: `enable` ile channel = sms/email kayıt, `verify` ile code doğrulama.

## 2. BillingProvider
Dosya: `BillingProvider.ts`

Arayüz Metodları:
- `listInvoices(userId)` : Fatura özet listesi.
- `getInvoice(userId, invoiceId)` : Detay (kalemler dahil).
- `listPaymentMethods(userId)` : Ödeme yöntemleri.
- `createPayment(userId, { invoiceId, methodId })` : Ödeme başlatır.

Gerçek Entegrasyon Önerileri:
- Stripe: Backend tarafında PaymentIntent oluşturulur; frontend result içinde `redirectUrl` varsa 3DS flow.
- Iyzico: Backend -> iyzico API; frontend’e sadece redirect token / url.

UI Tarafında Sonraki Adımlar:
- Fatura listesi ekranı mock datayı `useInvoices()` üzerinden alıyor olacak.
- Ödeme butonu tetiklediğinde: `payInvoice({ invoiceId, methodId })`.
- Gerekirse loader & success toast eklenir.

## 3. MonitoringProvider
Dosya: `MonitoringProvider.ts`

Arayüz Metodları:
- `getLatest(serverId)` : Son snapshot.
- `getHistory(serverId, from, to)` : Belirli aralık geçmiş veri.
- `stream(serverId, { intervalMs, onData })` : Canlı izleme için interval mock.

Gerçek Entegrasyon Örnekleri:
- Prometheus: Backend -> /query_range sonuçlarını normalize edip provider’a verir.
- Agent API: Sunucularda çalışan ajan periyodik metric gönderir; websocket veya polling.

## React Query Hookları
- `useTwoFactor()` : enable / disable / verify / status.
- `useInvoices()` : fatura listesi, detay, ödeme yöntemleri, ödeme oluşturma.
- `useServerMonitoring({ serverId })` : history + latest + canlı stream (mock interval) döner.

## Gerçeğe Geçiş Adımları
1. Mock sınıfları silmeyin, `Mock...` olarak bırakın ve yanına `Real...` ekleyin.
2. Ortam değişkeni (örn. `USE_MOCK_PROVIDERS=true/false`) ile seçim yapın.
3. `index.ts` içinde koşullu export:
```ts
// örnek pseudo kod
export const twoFactorProvider = process.env.USE_MOCK_PROVIDERS ? new MockTwoFactorProvider() : new RealTwoFactorProvider(apiClient);
```
4. Hata Yönetimi: Gerçek implementasyonlarda try/catch ile `throw new Error('...')` yerine tutarlı bir error shape oluşturun.
5. Authorization: Gerekirse provider constructor’ına token sağlayın veya merkezi axios instance kullanın.

## Tip Genişletme
Backend farklı alanlar eklerse:
- Örn. faturaya `taxAmount` geldi -> `InvoiceDetail` genişletin ve UI güncelleyin.
- Gerçek servis cardType büyük harf yerine küçük harf dönerse normalizasyon ekleyin.

## Test Senaryoları (Öneri)
- TwoFactor: enable -> verify(geçerli) -> isEnabled true -> disable -> isEnabled false.
- Billing: listInvoices -> getInvoice -> payInvoice -> invoice status paid.
- Monitoring: history uzunluğu sabit upper bound, stream stop çalışır mı.

## Güvenlik Notları
- 2FA secret veya recovery codes cihazda kalıcı saklanmamalı (sadece gösterim).
- Payment method yönetimi tamamen backend’de; frontend sadece masked data görmeli.
- Monitoring verisi yoğun ise pagination / downsampling stratejisi planlanmalı.

---
Sorular veya ek ihtiyaçlar için: Bu dosya güncellenebilir.
