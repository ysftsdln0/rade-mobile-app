import { en, TranslationKeys } from './en';
import { tr } from './tr';

export type Language = 'en' | 'tr';

export const translations: Record<Language, TranslationKeys> = {
  en,
  tr,
};

export { en, tr };
export type { TranslationKeys };
