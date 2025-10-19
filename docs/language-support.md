# Dil Desteği (i18n) - RADE Mobile App

## Genel Bakış

RADE mobil uygulamasına **Türkçe** ve **İngilizce** dil desteği eklendi. Kullanıcılar Profile sayfasındaki Preferences bölümünden dillerini değiştirebilirler.

## Kurulum ve Yapı

### 1. Dil Dosyaları

Çeviri dosyaları `src/locales/` klasöründe bulunur:

- `src/locales/en.ts` - İngilizce çeviriler
- `src/locales/tr.ts` - Türkçe çeviriler
- `src/locales/index.ts` - Export dosyası

### 2. Language Context

`src/utils/LanguageContext.tsx` dosyası dil yönetimi için React Context API kullanır:

- Seçilen dil AsyncStorage'da saklanır (`@rade_app_language` anahtarı)
- `useLanguage()` hook'u ile her yerden erişilebilir
- `LanguageProvider` App.tsx'te tüm uygulamayı sarar

### 3. Provider Entegrasyonu

`App.tsx` dosyasında provider hiyerarşisi:

```tsx
<SafeAreaProvider>
  <Provider store={store}>
    <LanguageProvider>  {/* ✅ Yeni eklendi */}
      <ReactQueryProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </ReactQueryProvider>
    </LanguageProvider>
  </Provider>
</SafeAreaProvider>
```

## Kullanım

### Component'lerde Dil Kullanımı

```tsx
import { useLanguage } from '../../utils/LanguageContext';

const MyComponent = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <View>
      <Text>{t.dashboard.title}</Text>
      <Text>{t.profile.personalInformation}</Text>
      
      {/* Koşullu metin için */}
      <Text>
        {language === 'tr' ? 'Merhaba' : 'Hello'}
      </Text>
      
      {/* Dil değiştirme */}
      <Button onPress={() => setLanguage('tr')} />
    </View>
  );
};
```

### Mevcut Hook API

```typescript
interface LanguageContextType {
  language: 'en' | 'tr';           // Aktif dil
  setLanguage: (lang: 'en' | 'tr') => Promise<void>; // Dil değiştir
  t: TranslationKeys;               // Çeviriler objesi
}
```

### Çeviri Anahtarları

Çeviri objesinin yapısı:

```typescript
t.common.confirm       // "Confirm" / "Onayla"
t.common.save          // "Save" / "Kaydet"
t.auth.login           // "Login" / "Giriş Yap"
t.auth.email           // "Email" / "E-posta"
t.dashboard.title      // "Dashboard" / "Kontrol Paneli"
t.profile.account      // "Account" / "Hesap"
t.profile.language     // "Language" / "Dil"
t.services.hosting     // "Hosting" / "Hosting"
t.servers.status       // "Status" / "Durum"
t.support.tickets      // "Tickets" / "Talepler"
t.invoices.paid        // "Paid" / "Ödenmiş"
t.languages.en         // "English"
t.languages.tr         // "Türkçe"
```

## Güncellenen Ekranlar

### ✅ ProfileScreen
- Preferences bölümüne "Language" toggle eklendi
- Switch ile TR/EN arası geçiş yapılabilir
- Seçilen dil switch'in yanında gösterilir
- Tüm menü başlıkları çevrildi

### ✅ DashboardScreen
- Tüm başlıklar ve metinler çevrildi
- Selamlama mesajları (Günaydın, İyi Günler, vb.)
- Metrik etiketleri
- Buton metinleri
- Kart başlıkları

## Yeni Çeviri Ekleme

### 1. İngilizce Çeviri Ekle (`src/locales/en.ts`)

```typescript
export const en = {
  // ... existing translations
  newSection: {
    title: 'My New Feature',
    description: 'Feature description',
    button: 'Click Me',
  },
};
```

### 2. Türkçe Çeviri Ekle (`src/locales/tr.ts`)

```typescript
export const tr: TranslationKeys = {
  // ... existing translations
  newSection: {
    title: 'Yeni Özelliğim',
    description: 'Özellik açıklaması',
    button: 'Tıkla',
  },
};
```

### 3. Component'te Kullan

```tsx
const MyScreen = () => {
  const { t } = useLanguage();
  
  return (
    <View>
      <Text>{t.newSection.title}</Text>
      <Text>{t.newSection.description}</Text>
      <Button label={t.newSection.button} />
    </View>
  );
};
```

## Diğer Ekranları Güncelleme

Aşağıdaki ekranlar da benzer şekilde güncellenebilir:

1. **Auth Ekranları** (`src/screens/auth/`)
   - LoginScreen
   - RegisterScreen
   - ForgotPasswordScreen
   - TwoFactorScreen

2. **Hosting Ekranları** (`src/screens/hosting/`)
   - HostingListScreen
   - HostingDetailsScreen
   - FileManagerScreen

3. **Server Ekranları** (`src/screens/server/`)
   - ServerListScreen
   - ServerDetailsScreen
   - ServerMonitoringScreen

4. **Support Ekranları** (`src/screens/support/`)
   - SupportTicketListScreen
   - TicketDetailsScreen

5. **Finance Ekranları** (`src/screens/finance/`)
   - InvoiceListScreen
   - InvoiceDetailsScreen
   - BillingMainScreen

Her ekran için:
1. `useLanguage` hook'unu import et
2. `const { t, language } = useLanguage();` ile context'i al
3. Sabit metinleri `t.section.key` ile değiştir
4. Koşullu metinler için `language === 'tr' ? 'Türkçe' : 'English'` kullan

## Best Practices

### ✅ Yapılması Gerekenler

- Her zaman `useLanguage()` hook'unu kullan
- Yeni özellikler eklerken her iki dil için de çeviri ekle
- Çeviri anahtarlarını mantıksal gruplara ayır (auth, dashboard, profile, vb.)
- Dinamik metinler için template literal kullan: `` `${t.common.total}: ${count}` ``

### ❌ Yapılmaması Gerekenler

- Çeviri dosyalarına hard-coded metin ekleme
- Context dışında dil bilgisini saklama
- Eksik çeviriler bırakma (TypeScript hata verir)
- İç içe geçmiş objelerde fazla derinlik oluşturma

## Test

Dil değişikliklerini test etmek için:

1. Uygulamayı başlat: `npm start`
2. Profile ekranına git
3. Preferences → Language switch'ini toggle et
4. Tüm ekranlarda metinlerin değiştiğini kontrol et
5. Uygulamayı kapat ve tekrar aç (AsyncStorage'dan yüklenmeli)

## TypeScript Desteği

Tüm çeviri anahtarları TypeScript ile tip güvenli:

```typescript
// ✅ Çalışır
t.profile.account

// ❌ Hata verir - böyle bir anahtar yok
t.profile.nonExistentKey

// ✅ Language tip güvenli
language // 'en' | 'tr'
```

## Sonraki Adımlar

1. Kalan ekranları güncelle (yukarıdaki liste)
2. Navigation başlıklarını çevir
3. Error mesajlarını çevir
4. Form validasyon mesajlarını çevir
5. İsteğe göre daha fazla dil ekle (örn: Almanca, Fransızca)

---

**Not:** Bu implementasyon hafif ve performanslı bir çözüm sunmak için external kütüphane kullanmadan (react-i18next, react-native-localize gibi) yazılmıştır. Daha gelişmiş özellikler (pluralization, date formatting, vb.) için i18next entegrasyonu düşünülebilir.
