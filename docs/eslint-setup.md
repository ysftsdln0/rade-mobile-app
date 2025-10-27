# ESLint Konfigürasyonu

Bu proje ESLint 9 ile yapılandırılmıştır. Hem frontend hem backend için ayrı konfigürasyonlar mevcuttur.

## Kurulum

ESLint ve tüm gerekli plugin'ler projeye eklenmiştir:

### Frontend

- `eslint`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-native`

### Backend

- `eslint`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`

## Kullanım

### Frontend için ESLint kontrolü

```bash
npm run lint
```

### Frontend için otomatik düzeltme

```bash
npm run lint:fix
```

### Backend için ESLint kontrolü

```bash
cd backend
npm run lint
```

### Backend için otomatik düzeltme

```bash
cd backend
npm run lint:fix
```

## Konfigürasyon Dosyaları

- **Frontend:** `eslint.config.js` - React Native projeleri için optimize edilmiş kurallar
- **Backend:** `backend/eslint.config.mjs` - Node.js/Express projeleri için kurallar

## VS Code Entegrasyonu

`.vscode/settings.json` dosyası ESLint'i otomatik olarak çalıştırmak için yapılandırılmıştır:

- Dosya kaydedildiğinde otomatik düzeltme yapılır
- Hem frontend hem backend klasörleri için çalışır
- Prettier ile entegre çalışır

## Kurallar

### TypeScript Kuralları

- `@typescript-eslint/no-unused-vars`: Kullanılmayan değişkenler için uyarı
- `@typescript-eslint/no-explicit-any`: `any` kullanımı için uyarı
- `@typescript-eslint/no-non-null-assertion`: Non-null assertion için uyarı

### React/React Native Kuralları (Frontend)

- `react/react-in-jsx-scope`: Kapalı (React Native'de gerekli değil)
- `react/prop-types`: Kapalı (TypeScript kullanıyoruz)
- `react-hooks/rules-of-hooks`: Hook kuralları için hata
- `react-hooks/exhaustive-deps`: useEffect bağımlılıkları için uyarı
- `react-native/no-unused-styles`: Kullanılmayan stiller için uyarı
- `react-native/no-inline-styles`: Inline stiller için uyarı

### Genel Kurallar

- `no-console`: Uyarı (frontend), Kapalı (backend)
- `prefer-const`: Uyarı
- `no-var`: Hata

## Not

ESLint 9, flat config formatını kullanır. Eski `.eslintrc.*` formatı artık desteklenmemektedir.
