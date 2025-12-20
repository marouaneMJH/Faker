import type { IGenerator } from "../types/IGenerator";
import type GeneratorContext from "../core/GeneratorContext";
import {
    CountryProvider,
    type CountryPhoneData,
} from "../core/CountryProvider";

/**
 * Configuration options for phone number generation.
 */
export interface PhoneConfig {
    /** Output format: 'e164', 'national', or 'international'. */
    format?: "e164" | "national" | "international";
    /** Country code for locale-specific phone numbers (ISO 3166-1 alpha-2). */
    country?: string;
}

/**
 * Options for mobile phone generation.
 */
export interface MobileOptions {
    /** Country code for locale-specific mobile numbers. */
    country?: string;
    /** Output format for the mobile number. */
    format?: "e164" | "national" | "international";
}

/**
 * Options for landline phone generation.
 */
export interface LandlineOptions {
    /** Country code for locale-specific landline numbers. */
    country?: string;
}

/**
 * Custom error for unsupported country codes.
 */
export class UnsupportedCountryError extends Error {
    constructor(countryCode: string) {
        super(`Unsupported country code for phone generation: ${countryCode}`);
        this.name = "UnsupportedCountryError";
    }
}

/**
 * Custom error for invalid calling codes.
 */
export class InvalidCallingCodeError extends Error {
    constructor(callingCode: string) {
        super(`Invalid calling code (must be 1-999): ${callingCode}`);
        this.name = "InvalidCallingCodeError";
    }
}

/**
 * Phone number generator for creating realistic international phone numbers.
 *
 * Generates authentic phone numbers in various international formats with
 * comprehensive support for mobile, landline, and formatted numbers. Morocco
 * is prioritized as the primary example of international capabilities.
 *
 * Features:
 * - International calling codes and formats
 * - Mobile vs landline number differentiation
 * - E.164, national, and international formatting
 * - Country-specific number patterns
 * - Phone number masking and extensions
 * - Validation and error handling
 *
 * @example
 * ```typescript
 * const generator = new PhoneGenerator(context);
 *
 * // Morocco mobile (prioritized)
 * console.log(generator.mobile({ country: 'MA' })); // "+212 6XX-XXXXXX"
 * console.log(generator.landline({ country: 'MA' })); // "+212 5XX-XXXXXX"
 *
 * // Different formats
 * console.log(generator.e164('MA')); // "+212612345678"
 * console.log(generator.international()); // "+212 612-345678"
 * console.log(generator.masked(4)); // "+212 XXX-XXX678"
 *
 * // US examples
 * console.log(generator.mobile({ country: 'US' })); // "+1 (555) 123-4567"
 * console.log(generator.withExtension()); // "+1 (555) 123-4567 x123"
 * ```
 */
export class PhoneGenerator implements IGenerator<PhoneConfig, string> {
    /** Generator identifier. */
    readonly name = "phone";

    private readonly countryProvider: CountryProvider;

    constructor(
        public readonly context: GeneratorContext,
        countryProvider?: CountryProvider
    ) {
        this.countryProvider = countryProvider || new CountryProvider();
    }

    /**
     * Generates a phone number based on the provided configuration.
     *
     * @param config - Configuration options for phone number generation.
     *
     * @returns Generated phone number in the specified format.
     *
     * @throws {UnsupportedCountryError} When the specified country code is not supported.
     *
     * @example
     * ```typescript
     * const generator = new PhoneGenerator(context);
     *
     * // Morocco examples (prioritized)
     * console.log(generator.generate({ country: 'MA', format: 'e164' })); // "+212612345678"
     * console.log(generator.generate({ country: 'MA', format: 'international' })); // "+212 612-345678"
     *
     * // US examples
     * console.log(generator.generate({ country: 'US', format: 'national' })); // "(555) 123-4567"
     * ```
     */
    generate(config: PhoneConfig = {}): string {
        const { format = "international", country } = config;
        const countryData = this.resolveCountryData(country);

        // Generate mobile number by default
        const digits = this.generateMobileDigits(countryData);

        switch (format) {
            case "e164":
                return `+${countryData.callingCode}${digits}`;
            case "national":
                return this.formatNumber(digits, countryData.nationalFormat);
            case "international":
            default:
                return this.formatNumber(
                    digits,
                    countryData.internationalFormat
                );
        }
    }

    /**
     * Generates a mobile phone number.
     *
     * @param options - Options for mobile number generation.
     *
     * @returns Mobile phone number in the specified format.
     *
     * @example
     * ```typescript
     * const generator = new PhoneGenerator(context);
     *
     * // Morocco mobile numbers (prioritized)
     * console.log(generator.mobile({ country: 'MA' })); // "+212 6XX-XXXXXX"
     * console.log(generator.mobile({ country: 'MA', format: 'e164' })); // "+212612345678"
     * console.log(generator.mobile({ country: 'MA', format: 'national' })); // "6XX-XXXXXX"
     *
     * // US mobile numbers
     * console.log(generator.mobile({ country: 'US' })); // "+1 (555) 123-4567"
     * console.log(generator.mobile({ country: 'US', format: 'national' })); // "(555) 123-4567"
     *
     * // French mobile numbers
     * console.log(generator.mobile({ country: 'FR' })); // "+33 6 12 34 56 78"
     * ```
     */
    mobile(options: MobileOptions = {}): string {
        const { country, format = "international" } = options;
        const countryData = this.resolveCountryData(country);
        const digits = this.generateMobileDigits(countryData);

        return this.formatPhoneNumber(digits, countryData, format);
    }

    /**
     * Generates a landline phone number.
     *
     * @param options - Options for landline number generation.
     *
     * @returns Landline phone number in international format.
     *
     * @example
     * ```typescript
     * const generator = new PhoneGenerator(context);
     *
     * // Morocco landline numbers (prioritized)
     * console.log(generator.landline({ country: 'MA' })); // "+212 5XX-XXXXXX"
     *
     * // US landline numbers
     * console.log(generator.landline({ country: 'US' })); // "+1 (555) 123-4567"
     *
     * // French landline numbers
     * console.log(generator.landline({ country: 'FR' })); // "+33 1 12 34 56 78"
     * ```
     */
    landline(options: LandlineOptions = {}): string {
        const { country } = options;
        const countryData = this.resolveCountryData(country);
        const digits = this.generateLandlineDigits(countryData);

        return this.formatPhoneNumber(digits, countryData, "international");
    }

    /**
     * Generates an international phone number in full E.164 format.
     *
     * @param countryCode - Optional country code. Uses locale if not specified.
     *
     * @returns Phone number in strict E.164 format.
     *
     * @example
     * ```typescript
     * const generator = new PhoneGenerator(context);
     *
     * // Morocco E.164 format (prioritized)
     * console.log(generator.international('MA')); // "+212 612-345678"
     *
     * // US E.164 format
     * console.log(generator.international('US')); // "+1 (555) 123-4567"
     *
     * // Default (based on locale)
     * console.log(generator.international()); // "+212 612-345678" (if locale is ar-MA)
     * ```
     */
    international(countryCode?: string): string {
        const countryData = this.resolveCountryData(countryCode);
        const digits = this.generateMobileDigits(countryData);

        return this.formatNumber(digits, countryData.internationalFormat);
    }

    /**
     * Generates a masked phone number with hidden digits.
     *
     * @param visibleDigits - Number of digits to keep visible at the end.
     *
     * @returns Masked phone number with 'X' characters.
     *
     * @example
     * ```typescript
     * const generator = new PhoneGenerator(context);
     *
     * // Morocco masked numbers (prioritized)
     * console.log(generator.masked(4)); // "+212 XXX-XXX678"
     * console.log(generator.masked(3)); // "+212 XXX-XX567"
     *
     * // US masked numbers
     * console.log(generator.masked(4)); // "+1 (XXX) XXX-1234"
     * ```
     */
    masked(visibleDigits: number = 4): string {
        const countryData = this.resolveCountryData();
        const digits = this.generateMobileDigits(countryData);
        const fullNumber = this.formatPhoneNumber(
            digits,
            countryData,
            "international"
        );

        // Extract digits from the formatted number
        const digitMatches = fullNumber.match(/\d/g) || [];
        const totalDigits = digitMatches.length;

        if (visibleDigits >= totalDigits) {
            return fullNumber;
        }

        // Replace digits with X, keeping the last N digits visible
        let maskedNumber = fullNumber;
        let digitCount = 0;
        let visibleCount = 0;

        for (let i = maskedNumber.length - 1; i >= 0; i--) {
            if (/\d/.test(maskedNumber[i])) {
                digitCount++;
                if (visibleCount < visibleDigits) {
                    visibleCount++;
                } else {
                    maskedNumber =
                        maskedNumber.substring(0, i) +
                        "X" +
                        maskedNumber.substring(i + 1);
                }
            }
        }

        return maskedNumber;
    }

    /**
     * Generates a phone number in strict E.164 format.
     *
     * @param countryCode - Optional country code. Uses locale if not specified.
     *
     * @returns Phone number in strict E.164 format (no spaces or formatting).
     *
     * @example
     * ```typescript
     * const generator = new PhoneGenerator(context);
     *
     * // Morocco E.164 format (prioritized)
     * console.log(generator.e164('MA')); // "+212612345678"
     *
     * // US E.164 format
     * console.log(generator.e164('US')); // "+15551234567"
     *
     * // French E.164 format
     * console.log(generator.e164('FR')); // "+33612345678"
     * ```
     */
    e164(countryCode?: string): string {
        const countryData = this.resolveCountryData(countryCode);
        const digits = this.generateMobileDigits(countryData);

        return `+${countryData.callingCode}${digits}`;
    }

    /**
     * Generates a phone number with an extension.
     *
     * @param baseNumber - Optional base number. Generates one if not provided.
     *
     * @returns Phone number with extension (e.g., "x123" or "ext. 456").
     *
     * @example
     * ```typescript
     * const generator = new PhoneGenerator(context);
     *
     * // Morocco with extension (prioritized)
     * console.log(generator.withExtension()); // "+212 612-345678 x123"
     *
     * // US with extension
     * console.log(generator.withExtension()); // "+1 (555) 123-4567 ext. 456"
     *
     * // Custom base number
     * console.log(generator.withExtension("+212 612-345678")); // "+212 612-345678 x789"
     * ```
     */
    withExtension(baseNumber?: string): string {
        const base = baseNumber || this.international();
        const extension = this.context.getRng().int(100, 9999);
        const extensionFormats = ["x", "ext.", "extension"];
        const format = this.context.getRng().pick(extensionFormats);

        return `${base} ${format} ${extension}`;
    }

    /**
     * Gets the default configuration for phone generation.
     *
     * @returns Default configuration object.
     */
    getDefaultConfig(): PhoneConfig {
        return {
            format: "international",
        };
    }

    /**
     * Validates the provided configuration.
     *
     * @param config - Configuration to validate.
     *
     * @returns True if configuration is valid, false otherwise.
     */
    validateConfig(config: PhoneConfig): boolean {
        if (!config || typeof config !== "object") {
            return false;
        }

        const { format, country } = config;

        // Validate format
        if (
            format !== undefined &&
            !["e164", "national", "international"].includes(format)
        ) {
            return false;
        }

        // Validate country code
        if (country !== undefined) {
            if (
                typeof country !== "string" ||
                !this.countryProvider.isCountrySupported(country)
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Resolves country data based on country code or current locale.
     *
     * @param countryCode - Optional country code to resolve.
     *
     * @returns Country data for the specified or locale-based country.
     *
     * @throws {UnsupportedCountryError} When the country code is not supported.
     *
     * @private
     */
    private resolveCountryData(countryCode?: string): CountryPhoneData {
        if (countryCode) {
            if (!this.countryProvider.isCountrySupported(countryCode)) {
                throw new UnsupportedCountryError(countryCode);
            }
            return this.countryProvider.getCountryData(countryCode)!;
        }

        return this.countryProvider.getCountryByLocale(
            this.context.getLocale()
        );
    }

    /**
     * Generates mobile phone digits for a specific country.
     *
     * @param countryData - Country data for digit generation.
     *
     * @returns Generated mobile phone digits.
     *
     * @private
     */
    private generateMobileDigits(countryData: CountryPhoneData): string {
        const prefix = this.context.getRng().pick(countryData.mobilePrefixes);
        const remainingDigits = countryData.nationalLength - prefix.length;

        let digits = prefix;
        for (let i = 0; i < remainingDigits; i++) {
            digits += this.context.getRng().int(0, 9).toString();
        }

        return digits;
    }

    /**
     * Generates landline phone digits for a specific country.
     *
     * @param countryData - Country data for digit generation.
     *
     * @returns Generated landline phone digits.
     *
     * @private
     */
    private generateLandlineDigits(countryData: CountryPhoneData): string {
        const prefix = this.context.getRng().pick(countryData.landlinePrefixes);
        const remainingDigits = countryData.nationalLength - prefix.length;

        let digits = prefix;
        for (let i = 0; i < remainingDigits; i++) {
            digits += this.context.getRng().int(0, 9).toString();
        }

        return digits;
    }

    /**
     * Formats phone number according to country and format specifications.
     *
     * @param digits - The phone number digits.
     * @param countryData - Country data for formatting.
     * @param format - The desired format.
     *
     * @returns Formatted phone number.
     *
     * @private
     */
    private formatPhoneNumber(
        digits: string,
        countryData: CountryPhoneData,
        format: "e164" | "national" | "international"
    ): string {
        switch (format) {
            case "e164":
                return `+${countryData.callingCode}${digits}`;
            case "national":
                return this.formatNumber(digits, countryData.nationalFormat);
            case "international":
            default:
                return this.formatNumber(
                    digits,
                    countryData.internationalFormat
                );
        }
    }

    /**
     * Formats a string of digits according to a pattern.
     *
     * @param digits - The digits to format.
     * @param pattern - The pattern string (X = digit placeholder).
     *
     * @returns Formatted number string.
     *
     * @private
     *
     * @example
     * ```typescript
     * formatNumber("212612345678", "+XXX XXX-XXXXXX"); // "+212 612-345678"
     * formatNumber("15551234567", "+X (XXX) XXX-XXXX"); // "+1 (555) 123-4567"
     * ```
     */
    private formatNumber(digits: string, pattern: string): string {
        let digitIndex = 0;
        let result = "";

        for (const char of pattern) {
            if (char === "X" && digitIndex < digits.length) {
                result += digits[digitIndex++];
            } else if (char !== "X") {
                result += char;
            }
        }

        return result;
    }
}

export default PhoneGenerator;
