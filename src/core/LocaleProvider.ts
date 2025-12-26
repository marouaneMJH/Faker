import {
    AvailableLocale,
    EN_LOCALE_DATA,
    ES_LOCALE_DATA,
    FR_LOCALE_DATA,
    DE_LOCALE_DATA,
    IT_LOCALE_DATA,
    RU_LOCALE_DATA,
    AR_LOCALE_DATA,
    ZH_LOCALE_DATA,
} from "../data/names";

/**
 * Interface for locale-specific data.
 */
export interface LocaleData {
    /** Male first names for the locale. */
    maleFirstNames: string[];
    /** Female first names for the locale. */
    femaleFirstNames: string[];
    /** Gender-neutral first names for the locale. */
    neutralFirstNames: string[];
    /** Last names for the locale. */
    lastNames: string[];
    /** Name titles/prefixes for the locale. */
    titles: string[];
    /** Name suffixes for the locale. */
    suffixes: string[];
    /** Common nicknames for the locale. */
    nicknames: string[];
}

/**
 * Registry of locale data by locale code.
 */
const LOCALE_REGISTRY: Map<AvailableLocale, LocaleData> = new Map([
    ["en", EN_LOCALE_DATA],
    ["es", ES_LOCALE_DATA],
    ["fr", FR_LOCALE_DATA],
    ["de", DE_LOCALE_DATA],
    ["it", IT_LOCALE_DATA],
    ["ru", RU_LOCALE_DATA],
    ["ar", AR_LOCALE_DATA],
    ["zh", ZH_LOCALE_DATA],
]);

/**
 * Provider for locale-specific name data.
 *
 * This class manages locale-specific datasets for name generation,
 * providing fallback mechanisms for unsupported locales.
 *
 * @example
 * ```typescript
 * const provider = new LocaleProvider();
 * const data = provider.getLocaleData('es');
 * console.log(data.maleFirstNames); // Spanish male names
 *
 * // Fallback for unsupported locale
 * const fallback = provider.getLocaleData('xyz');
 * console.log(fallback === provider.getLocaleData('en')); // true
 * ```
 */
export class LocaleProvider {
    /**
     * Gets locale data for the specified locale code.
     *
     * @param locale - The locale code (e.g., 'en', 'es', 'fr').
     *
     * @returns Locale data for the specified locale, or English data as fallback.
     *
     * @example
     * ```typescript
     * const provider = new LocaleProvider();
     *
     * // Get Spanish locale data
     * const esData = provider.getLocaleData('es');
     * console.log(esData.maleFirstNames[0]); // "Antonio"
     *
     * // Fallback to English for unsupported locale
     * const unknownData = provider.getLocaleData('unknown');
     * console.log(unknownData.maleFirstNames[0]); // "James"
     * ```
     */
    getLocaleData(locale: AvailableLocale): LocaleData {
        return LOCALE_REGISTRY.get(locale) || LOCALE_REGISTRY.get("en")!;
    }

    /**
     * Checks if a locale is supported.
     *
     * @param locale - The locale code to check.
     *
     * @returns True if the locale is supported, false otherwise.
     *
     * @example
     * ```typescript
     * const provider = new LocaleProvider();
     * console.log(provider.isLocaleSupported('en')); // true
     * console.log(provider.isLocaleSupported('xyz')); // false
     * ```
     */
    isLocaleSupported(locale: AvailableLocale): boolean {
        return LOCALE_REGISTRY.has(locale);
    }

    /**
     * Gets a list of all supported locale codes.
     *
     * @returns An array of supported locale codes.
     *
     * @example
     * ```typescript
     * const provider = new LocaleProvider();
     * console.log(provider.getSupportedLocales()); // ['en', 'es', 'fr']
     * ```
     */
    getSupportedLocales(): string[] {
        return Array.from(LOCALE_REGISTRY.keys()).sort();
    }
}

export default LocaleProvider;
