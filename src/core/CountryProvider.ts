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
 * Phone number data for Morocco (prioritized).
 */
const MA_PHONE_DATA: CountryPhoneData = {
    name: "Morocco",
    code: "MA",
    callingCode: "212",
    mobilePrefixes: ["6", "7"], // Morocco mobile starts with 6 or 7
    landlinePrefixes: ["5"], // Morocco landline starts with 5
    nationalFormat: "XXX-XXXXXX", // 6XX-XXXXXX or 7XX-XXXXXX
    internationalFormat: "+212 XXX-XXXXXX",
    e164Format: "+212XXXXXXXXX",
    totalLength: 12, // +212 + 9 digits
    nationalLength: 9,
};

/**
 * Phone number data for United States.
 */
const US_PHONE_DATA: CountryPhoneData = {
    name: "United States",
    code: "US",
    callingCode: "1",
    mobilePrefixes: ["2", "3", "4", "5", "6", "7", "8", "9"], // US mobile/landline same prefixes
    landlinePrefixes: ["2", "3", "4", "5", "6", "7", "8", "9"],
    nationalFormat: "(XXX) XXX-XXXX",
    internationalFormat: "+1 (XXX) XXX-XXXX",
    e164Format: "+1XXXXXXXXXX",
    totalLength: 11, // +1 + 10 digits
    nationalLength: 10,
};

/**
 * Phone number data for France.
 */
const FR_PHONE_DATA: CountryPhoneData = {
    name: "France",
    code: "FR",
    callingCode: "33",
    mobilePrefixes: ["6", "7"], // France mobile starts with 6 or 7
    landlinePrefixes: ["1", "2", "3", "4", "5", "8", "9"], // France landline
    nationalFormat: "XX XX XX XX XX",
    internationalFormat: "+33 X XX XX XX XX",
    e164Format: "+33XXXXXXXXX",
    totalLength: 11, // +33 + 9 digits
    nationalLength: 9,
};

/**
 * Phone number data for United Kingdom.
 */
const GB_PHONE_DATA: CountryPhoneData = {
    name: "United Kingdom",
    code: "GB",
    callingCode: "44",
    mobilePrefixes: ["7"], // UK mobile starts with 7
    landlinePrefixes: ["1", "2"], // UK landline starts with 1 or 2
    nationalFormat: "XXXX XXXXXX",
    internationalFormat: "+44 XXXX XXXXXX",
    e164Format: "+44XXXXXXXXXX",
    totalLength: 13, // +44 + 10 digits
    nationalLength: 10,
};

/**
 * Phone number data for Germany.
 */
const DE_PHONE_DATA: CountryPhoneData = {
    name: "Germany",
    code: "DE",
    callingCode: "49",
    mobilePrefixes: ["15", "16", "17"], // Germany mobile prefixes
    landlinePrefixes: ["2", "3", "4", "5", "6", "7", "8", "9"], // Germany landline
    nationalFormat: "XXX XXXXXXXX",
    internationalFormat: "+49 XXX XXXXXXXX",
    e164Format: "+49XXXXXXXXXXX",
    totalLength: 13, // +49 + 11 digits
    nationalLength: 11,
};

/**
 * Phone number data for Japan.
 */
const JP_PHONE_DATA: CountryPhoneData = {
    name: "Japan",
    code: "JP",
    callingCode: "81",
    mobilePrefixes: ["70", "80", "90"], // Japan mobile prefixes
    landlinePrefixes: ["3", "4", "5", "6"], // Japan landline prefixes
    nationalFormat: "XX-XXXX-XXXX",
    internationalFormat: "+81 XX-XXXX-XXXX",
    e164Format: "+81XXXXXXXXXX",
    totalLength: 12, // +81 + 10 digits
    nationalLength: 10,
};

/**
 * Registry of country phone data, with Morocco prioritized first.
 */
const COUNTRY_PHONE_REGISTRY: Map<string, CountryPhoneData> = new Map([
    // Morocco first (prioritized)
    ["MA", MA_PHONE_DATA],
    ["US", US_PHONE_DATA],
    ["FR", FR_PHONE_DATA],
    ["GB", GB_PHONE_DATA],
    ["DE", DE_PHONE_DATA],
    ["JP", JP_PHONE_DATA],
]);

/**
 * Calling code to country code mapping.
 */
const CALLING_CODE_MAPPING: Map<string, string> = new Map([
    ["212", "MA"], // Morocco
    ["1", "US"], // US/Canada
    ["33", "FR"], // France
    ["44", "GB"], // UK
    ["49", "DE"], // Germany
    ["81", "JP"], // Japan
]);

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
    getCountryData(countryCode: string): CountryPhoneData | undefined {
        return COUNTRY_PHONE_REGISTRY.get(countryCode.toUpperCase());
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
    getCountryByCallingCode(callingCode: string): CountryPhoneData | undefined {
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
    getSupportedCountries(): string[] {
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
    getSupportedCallingCodes(): string[] {
        return Array.from(CALLING_CODE_MAPPING.keys());
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
    getCountryByLocale(locale: string): CountryPhoneData {
        const localeMap: Record<string, string> = {
            ar: "MA", // Arabic -> Morocco (prioritized)
            "ar-MA": "MA",
            en: "US",
            "en-US": "US",
            "en-GB": "GB",
            fr: "FR",
            "fr-FR": "FR",
            "fr-MA": "MA", // French Morocco -> Morocco
            de: "DE",
            "de-DE": "DE",
            ja: "JP",
            "ja-JP": "JP",
        };

        const countryCode = localeMap[locale] || "MA"; // Default to Morocco
        return this.getCountryData(countryCode) || MA_PHONE_DATA;
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
            code >= 1 && code <= 999 && CALLING_CODE_MAPPING.has(callingCode)
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
        return COUNTRY_PHONE_REGISTRY.has(countryCode.toUpperCase());
    }
}

export default CountryProvider;
