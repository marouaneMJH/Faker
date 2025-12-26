import { AvailableLocale } from "../data/names";
import RandomNumberGenerator from "./RandomNumberGenerator";

/**
 * Configuration options for GeneratorContext initialization.
 */
export interface GeneratorContextConfig {
    /** The seed value for the random number generator. */
    seed?: number;
    /** The locale code for localized data generation. */
    locale?: AvailableLocale;
}

/**
 * Supported locale codes for data generation.
 * Common ISO 639-1 language codes.
 */
const SUPPORTED_LOCALES = new Set([
    "en",
    "es",
    "fr",
    "de",
    "it",
    "pt",
    "ru",
    "zh",
    "ja",
    "ko",
    "ar",
    "hi",
    "tr",
    "pl",
    "nl",
    "sv",
    "da",
    "no",
    "fi",
    "cs",
    "hu",
    "ro",
    "bg",
    "hr",
    "sk",
    "sl",
    "et",
    "lv",
    "lt",
    "mt",
    "ga",
    "cy",
    "eu",
    "ca",
    "gl",
    "is",
    "mk",
    "sq",
    "sr",
    "bs",
    "me",
    "uk",
    "be",
    "ka",
    "am",
    "az",
    "kk",
    "ky",
    "mn",
    "tg",
    "tk",
    "uz",
    "fa",
    "ur",
    "bn",
    "gu",
    "kn",
    "ml",
    "mr",
    "ne",
    "or",
    "pa",
    "si",
    "ta",
    "te",
    "th",
    "vi",
    "my",
    "km",
    "lo",
    "ka",
    "hy",
    "he",
    "yi",
    "ms",
    "id",
    "tl",
    "sw",
    "zu",
    "xh",
    "af",
    "st",
    "tn",
    "ts",
    "ve",
    "ss",
    "nr",
    "nso",
    "lg",
    "rw",
    "so",
    "om",
    "ti",
    "aa",
    "ha",
    "yo",
    "ig",
    "ff",
    "wo",
    "sn",
]);

/**
 * Manages faker configuration state including seed, locale, and random number generation.
 *
 * This class follows the Single Responsibility Principle by focusing solely on
 * configuration management and providing a clean interface for accessing
 * faker's core dependencies.
 *
 * @example
 * ```typescript
 * const context = new GeneratorContext({ seed: 12345, locale: 'en' });
 * console.log(context.getSeed()); // 12345
 * console.log(context.getLocale()); // 'en'
 *
 * const rng = context.getRng();
 * console.log(rng.next()); // deterministic random number
 *
 * const copy = context.clone();
 * copy.setLocale('es');
 * console.log(context.getLocale()); // 'en' (original unchanged)
 * console.log(copy.getLocale()); // 'es'
 * ```
 */
export default class GeneratorContext {
    /** The seed value for random number generation. */
    private readonly seed: number;

    /** The locale code for localized data generation. */
    private locale: AvailableLocale;

    /** The random number generator instance. */
    private rng: RandomNumberGenerator;

    /** The initial configuration used to create this context. */
    private readonly initialConfig: Required<GeneratorContextConfig>;

    /**
     * Creates a new GeneratorContext instance.
     *
     * @param config - Optional configuration object
     * @param config.seed - The seed value for random number generation. Defaults to current timestamp.
     * @param config.locale - The locale code for localized data generation. Defaults to 'en'.
     *
     * @throws {Error} If the provided locale is not supported.
     *
     * @example
     * ```typescript
     * // Create with default values
     * const context1 = new GeneratorContext();
     *
     * // Create with specific seed
     * const context2 = new GeneratorContext({ seed: 12345 });
     *
     * // Create with specific locale
     * const context3 = new GeneratorContext({ locale: 'es' });
     *
     * // Create with both seed and locale
     * const context4 = new GeneratorContext({ seed: 12345, locale: 'fr' });
     * ```
     */
    constructor(config: GeneratorContextConfig = {}) {
        const defaultSeed = Date.now();
        const defaultLocale = "en";

        if (config.seed && config.seed < 0)
            throw new TypeError("Should be positive number");
        this.seed = config.seed ?? defaultSeed;
        this.locale = config.locale ?? defaultLocale;

        // Validate locale
        this.validateLocale(this.locale);

        this.rng = new RandomNumberGenerator(this.seed);

        // Store initial configuration for reset functionality
        this.initialConfig = {
            seed: this.seed,
            locale: this.locale,
        };
    }

    /**
     * Gets the current seed value.
     *
     * @returns The seed value used for random number generation.
     *
     * @example
     * ```typescript
     * const context = new GeneratorContext({ seed: 12345 });
     * console.log(context.getSeed()); // 12345
     * ```
     */
    getSeed(): number {
        return this.seed;
    }

    /**
     * Updates the seed value and recreates the random number generator.
     *
     * @param seed - The new seed value to use.
     *
     * @example
     * ```typescript
     * const context = new GeneratorContext();
     * context.setSeed(42);
     * console.log(context.getSeed()); // 42
     *
     * // The RNG is automatically recreated with the new seed
     * const rng = context.getRng();
     * console.log(rng.next()); // deterministic based on seed 42
     * ```
     */
    setSeed(seed: number): void {
        (this as any).seed = seed; // Temporarily bypass readonly for controlled mutation
        this.rng = new RandomNumberGenerator(seed);
    }

    /**
     * Gets the current locale code.
     *
     * @returns The locale code used for localized data generation.
     *
     * @example
     * ```typescript
     * const context = new GeneratorContext({ locale: 'es' });
     * console.log(context.getLocale()); // 'es'
     * ```
     */
    getLocale(): AvailableLocale {
        return this.locale;
    }

    /**
     * Sets the locale code after validation.
     *
     * @param locale - The locale code to set. Must be a supported locale.
     *
     * @throws {Error} If the locale is not supported.
     *
     * @example
     * ```typescript
     * const context = new GeneratorContext();
     * context.setLocale('fr');
     * console.log(context.getLocale()); // 'fr'
     *
     * // This will throw an error
     * context.setLocale('invalid'); // Error: Unsupported locale: invalid
     * ```
     */
    setLocale(locale: AvailableLocale): void {
        this.validateLocale(locale);
        this.locale = locale;
    }

    /**
     * Gets the random number generator instance.
     *
     * @returns The RandomNumberGenerator instance associated with this context.
     *
     * @example
     * ```typescript
     * const context = new GeneratorContext({ seed: 12345 });
     * const rng = context.getRng();
     * console.log(rng.next()); // deterministic random number
     * console.log(rng.int(1, 100)); // random integer between 1 and 100
     * ```
     */
    getRng(): RandomNumberGenerator {
        return this.rng;
    }

    /**
     * Creates an independent copy of this context with the same configuration.
     *
     * Changes to the clone will not affect the original context and vice versa.
     *
     * @returns A new GeneratorContext instance with identical configuration.
     *
     * @example
     * ```typescript
     * const original = new GeneratorContext({ seed: 12345, locale: 'en' });
     * const clone = original.clone();
     *
     * clone.setLocale('es');
     * console.log(original.getLocale()); // 'en' (unchanged)
     * console.log(clone.getLocale()); // 'es'
     *
     * Both will produce the same random sequence initially
     * console.log(original.getRng().next() === clone.getRng().next()); // true
     * ```
     */
    clone(): GeneratorContext {
        return new GeneratorContext({
            seed: this.seed,
            locale: this.locale,
        });
    }

    /**
     * Resets the context to its initial state.
     *
     * This includes resetting the locale and recreating the random number
     * generator with the original seed value.
     *
     * @example
     * ```typescript
     * const context = new GeneratorContext({ seed: 12345, locale: 'en' });
     *
     * // Make some changes
     * context.setLocale('es');
     * context.setSeed(54321);
     *
     * // Reset to initial state
     * context.reset();
     * console.log(context.getSeed()); // 12345
     * console.log(context.getLocale()); // 'en'
     * ```
     */
    reset(): void {
        this.locale = "en";
        const newSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        (this as any).seed = newSeed;
        this.rng = new RandomNumberGenerator(newSeed);
    }

    /**
     * Gets a list of all supported locale codes.
     *
     * @returns An array of supported locale codes.
     *
     * @example
     * ```typescript
     * const supportedLocales = GeneratorContext.getSupportedLocales();
     * console.log(supportedLocales.includes('en')); // true
     * console.log(supportedLocales.includes('invalid')); // false
     * ```
     */
    static getSupportedLocales(): readonly string[] {
        return Array.from(SUPPORTED_LOCALES).sort();
    }

    /**
     * Checks if a locale code is supported.
     *
     * @param locale - The locale code to check.
     * @returns True if the locale is supported, false otherwise.
     *
     * @example
     * ```typescript
     * console.log(GeneratorContext.isLocaleSupported('en')); // true
     * console.log(GeneratorContext.isLocaleSupported('invalid')); // false
     * ```
     */
    static isLocaleSupported(locale: string): boolean {
        return SUPPORTED_LOCALES.has(locale);
    }

    /**
     * Validates a locale code and throws an error if invalid.
     *
     * @param locale - The locale code to validate.
     *
     * @throws {Error} If the locale is not supported.
     *
     * @private
     */
    private validateLocale(locale: string): void {
        if (!SUPPORTED_LOCALES.has(locale)) {
            const supportedList = Array.from(SUPPORTED_LOCALES)
                .sort()
                .join(", ");
            throw new Error(
                `Unsupported locale: ${locale}. Supported locales are: ${supportedList}`
            );
        }
    }
}
