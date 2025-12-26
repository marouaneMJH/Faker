import {
    AVAILABLE_CALLING_CODE,
    AVAILABLE_COUNTRIES,
    AvailableCallingCode,
    AvailableCountry,
    CALLING_CODE_MAPPING,
    COUNTRY_PHONE_REGISTRY,
    MA_PHONE_DATA,
} from "./../data/countries/index";
import { AvailableLocale } from "./../data/names/index";

/**
 * Phone number configuration for a specific country.
 */
export interface CountryPhoneData {
    /** Country name. */
    name: string;
    /** ISO 3166-1 alpha-2 code (e.g., 'MA', 'US'). */
    code: string;
    /** International calling code (e.g., 212 for Morocco, 1 for US). */
    callingCode: string;
    /** Mobile number prefixes for the country. */
    mobilePrefixes: string[];
    /** Landline number prefixes for the country. */
    landlinePrefixes: string[];
    /** National format pattern (X = digit placeholder). */
    nationalFormat: string;
    /** International format pattern. */
    internationalFormat: string;
    /** E.164 format pattern. */
    e164Format: string;
    /** Total number length (including country code). */
    totalLength: number;
    /** National number length (excluding country code). */
    nationalLength: number;
}

/**
 * Phone number validation error.
 */
export class InvalidPhoneNumberError extends Error {
    constructor(number: string, country: string) {
        super(`Invalid phone number "${number}" for country: ${country}`);
        this.name = "InvalidPhoneNumberError";
    }
}

/**
 * Provider for country-specific phone number data and validation.
 *
 * Supports international phone number generation with authentic formats
 * for different countries. Morocco is prioritized as the primary country
 * for demonstration of international capabilities.
 *
 * @example
 * ```typescript
 * const provider = new CountryProvider();
 * const moroccoData = provider.getCountryData('MA');
 * console.log(moroccoData?.callingCode); // "212"
 * console.log(moroccoData?.mobilePrefixes); // ["6", "7"]
 *
 * const usData = provider.getCountryData('US');
 * console.log(usData?.nationalFormat); // "(XXX) XXX-XXXX"
 * ```
 */
export class CountryProvider {
    /**
     * Gets phone number data for a specific country.
     *
     * @param countryCode - The ISO alpha-2 country code (e.g., 'MA', 'US').
     *
     * @returns Country phone data or undefined if not supported.
     *
     * @example
     * ```typescript
     * const provider = new CountryProvider();
     * const moroccoData = provider.getCountryData('MA');
     * console.log(moroccoData?.name); // "Morocco"
     * console.log(moroccoData?.callingCode); // "212"
     * ```
     */
    getCountryData(
        countryCode: AvailableCountry
    ): CountryPhoneData | undefined {
        return COUNTRY_PHONE_REGISTRY.get(countryCode);
    }

    /**
     * Gets country data by calling code.
     *
     * @param callingCode - The international calling code (e.g., '212', '1').
     *
     * @returns Country phone data or undefined if not found.
     *
     * @example
     * ```typescript
     * const provider = new CountryProvider();
     * const data = provider.getCountryByCallingCode('212');
     * console.log(data?.name); // "Morocco"
     * ```
     */
    getCountryByCallingCode(
        callingCode: AvailableCallingCode
    ): CountryPhoneData | undefined {
        const countryCode = CALLING_CODE_MAPPING.get(callingCode);
        return countryCode ? this.getCountryData(countryCode) : undefined;
    }

    /**
     * Gets all supported country codes.
     *
     * @returns Array of supported ISO alpha-2 country codes, with Morocco first.
     *
     * @example
     * ```typescript
     * const provider = new CountryProvider();
     * console.log(provider.getSupportedCountries()); // ['MA', 'US', 'FR', 'GB', 'DE', 'JP']
     * ```
     */
    getSupportedCountries(): AvailableCountry[] {
        return Array.from(COUNTRY_PHONE_REGISTRY.keys());
    }

    /**
     * Gets all supported calling codes.
     *
     * @returns Array of international calling codes.
     *
     * @example
     * ```typescript
     * const provider = new CountryProvider();
     * console.log(provider.getSupportedCallingCodes()); // ['212', '1', '33', '44', '49', '81']
     * ```
     */
    getSupportedCallingCodes(): AvailableCallingCode[] {
        return AVAILABLE_CALLING_CODE.slice();
    }

    /**
     * Gets country data by locale.
     *
     * @param locale - The locale string (e.g., 'ar-MA', 'en-US', 'fr-FR').
     *
     * @returns Country phone data, defaulting to Morocco if locale not recognized.
     *
     * @example
     * ```typescript
     * const provider = new CountryProvider();
     * const data = provider.getCountryByLocale('ar-MA');
     * console.log(data.name); // "Morocco"
     * ```
     */
    getCountryByLocale(locale: AvailableLocale): CountryPhoneData {
        const localeMap: Record<string, string> = {
            ar: "MA",
            en: "US",
            fr: "FR",
            de: "DE",
            ja: "JP",
        };

        const countryCode = localeMap[locale]; // Default to Morocco
        return (
            this.getCountryData(countryCode as AvailableCountry) ||
            MA_PHONE_DATA
        );
    }

    /**
     * Validates a calling code.
     *
     * @param callingCode - The calling code to validate.
     *
     * @returns True if the calling code is valid and supported.
     *
     * @example
     * ```typescript
     * const provider = new CountryProvider();
     * console.log(provider.isValidCallingCode('212')); // true
     * console.log(provider.isValidCallingCode('999')); // false
     * ```
     */
    isValidCallingCode(callingCode: string): boolean {
        const code = parseInt(callingCode, 10);
        return (
            code >= 1 &&
            code <= 999 &&
            AVAILABLE_CALLING_CODE.includes(callingCode as AvailableCallingCode)
        );
    }

    /**
     * Checks if a country is supported.
     *
     * @param countryCode - The ISO alpha-2 country code to check.
     *
     * @returns True if the country is supported.
     *
     * @example
     * ```typescript
     * const provider = new CountryProvider();
     * console.log(provider.isCountrySupported('MA')); // true
     * console.log(provider.isCountrySupported('XX')); // false
     * ```
     */
    isCountrySupported(countryCode: string): boolean {
        return AVAILABLE_COUNTRIES.includes(
            countryCode.toUpperCase() as AvailableCountry
        );
    }
}

export default CountryProvider;
