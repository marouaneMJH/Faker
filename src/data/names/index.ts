/**
 * Centralized exports for all locale-specific name data.
 *
 * This index file provides a single point of access to all supported locales,
 * making it easy to import and use locale data throughout the application.
 *
 * @example
 * ```typescript
 * import { AR_LOCALE_DATA, EN_LOCALE_DATA, FR_LOCALE_DATA } from './data/names';
 * 
 * // Use specific locale data
 * console.log(EN_LOCALE_DATA.maleFirstNames);
 * console.log(FR_LOCALE_DATA.femaleFirstNames);
 * ```
 */

// Import all locale data
import arNames from './ar';
import deNames from './de';
import enNames from './en';
import esNames from './es';
import frNames from './fr';
import itNames from './it';
import ruNames from './ru';
import zhNames from './zh';

// Export with consistent naming
export const AR_LOCALE_DATA = arNames;
export const DE_LOCALE_DATA = deNames;
export const EN_LOCALE_DATA = enNames;
export const ES_LOCALE_DATA = esNames;
export const FR_LOCALE_DATA = frNames;
export const IT_LOCALE_DATA = itNames;
export const RU_LOCALE_DATA = ruNames;
export const ZH_LOCALE_DATA = zhNames;

/**
 * Array of all available locale codes for easy iteration and validation.
 *
 * @example
 * ```typescript
 * import { AVAILABLE_LOCALES } from './data/names';
 * 
 * AVAILABLE_LOCALES.forEach(locale => {
 *   console.log(`Supported locale: ${locale}`);
 * });
 * ```
 */
export const AVAILABLE_LOCALES = [
    'ar', 'de', 'en', 'es', 'fr', 'it', 'ru', 'zh'
] as const;

/**
 * Type representing all available locale codes.
 */
export type AvailableLocale = typeof AVAILABLE_LOCALES[number];