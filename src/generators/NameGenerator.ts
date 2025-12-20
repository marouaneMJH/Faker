import type { IGenerator } from "../types/IGenerator";
import type GeneratorContext from "../core/GeneratorContext";
import { LocaleProvider } from "../core/LocaleProvider";

/**
 * Configuration for name generation.
 */
export interface NameConfig {
    /** Include first name in the result. */
    firstName?: boolean;
    /** Include last name in the result. */
    lastName?: boolean;
    /** Include name prefix (Mr., Ms., etc.). */
    prefix?: boolean;
    /** Include name suffix (Jr., Sr., etc.). */
    suffix?: boolean;
    /** Gender for name generation. */
    gender?: "male" | "female" | "neutral";
    /** Format for full name generation. */
    format?: "firstName lastName" | "lastName firstName";
}

/**
 * Generator for creating fake names with locale support.
 *
 * This generator provides comprehensive name generation capabilities including
 * first names, last names, full names, titles, usernames, and nicknames.
 * All names are generated based on the current locale with fallback to English.
 *
 * @example
 * ```typescript
 * const nameGen = new NameGenerator(context);
 *
 * console.log(nameGen.first('male')); // "James"
 * console.log(nameGen.last()); // "Smith"
 * console.log(nameGen.full()); // "James Smith"
 * console.log(nameGen.title()); // "Mr."
 * ```
 */
export default class NameGenerator implements IGenerator<NameConfig, string> {
    readonly name = "name";
    readonly context: GeneratorContext;
    private readonly localeProvider: LocaleProvider;

    /**
     * Creates a new NameGenerator instance.
     *
     * @param context - The generator context providing locale and RNG.
     *
     * @example
     * ```typescript
     * const context = new GeneratorContext({ locale: 'es' });
     * const nameGen = new NameGenerator(context);
     * console.log(nameGen.first('male')); // Spanish male name
     * ```
     */
    constructor(context: GeneratorContext) {
        this.context = context;
        this.localeProvider = new LocaleProvider();
    }

    /**
     * Generates a name based on configuration.
     *
     * @param config - Optional configuration for name generation.
     *
     * @returns A generated name string.
     *
     * @example
     * ```typescript
     * console.log(nameGen.generate()); // "James Smith"
     * console.log(nameGen.generate({ prefix: true, suffix: true })); // "Dr. James Smith Jr."
     * ```
     */
    generate(config?: NameConfig): string {
        const cfg = { ...this.getDefaultConfig(), ...config };
        const rng = this.context.getRng();
        const locale = this.context.getLocale();
        const localeData = this.localeProvider.getLocaleData(locale);

        const parts: string[] = [];

        if (cfg.prefix) {
            parts.push(rng.pick(localeData.titles));
        }

        if (cfg.firstName) {
            const gender = cfg.gender || "neutral";
            let names: string[] = [];

            if (gender === "male") {
                names = localeData.maleFirstNames;
            } else if (gender === "female") {
                names = localeData.femaleFirstNames;
            } else {
                names = [
                    ...localeData.maleFirstNames,
                    ...localeData.femaleFirstNames,
                    ...localeData.neutralFirstNames,
                ];
            }

            parts.push(rng.pick(names));
        }

        if (cfg.lastName) {
            parts.push(rng.pick(localeData.lastNames));
        }

        if (cfg.suffix) {
            parts.push(rng.pick(localeData.suffixes));
        }

        return parts.join(" ");
    }

    /**
     * Generates a first name.
     *
     * @param gender - Optional gender specification for the name.
     *
     * @returns A first name string.
     *
     * @example
     * ```typescript
     * console.log(nameGen.first()); // "James" (random gender)
     * console.log(nameGen.first('male')); // "Robert"
     * console.log(nameGen.first('female')); // "Mary"
     * console.log(nameGen.first('neutral')); // "Alex"
     * ```
     */
    first(gender?: "male" | "female" | "neutral"): string {
        const rng = this.context.getRng();
        const locale = this.context.getLocale();
        const localeData = this.localeProvider.getLocaleData(locale);

        if (gender === "male") {
            return rng.pick(localeData.maleFirstNames);
        } else if (gender === "female") {
            return rng.pick(localeData.femaleFirstNames);
        } else if (gender === "neutral") {
            return rng.pick(localeData.neutralFirstNames);
        }

        // Random gender if not specified
        const allNames = [
            ...localeData.maleFirstNames,
            ...localeData.femaleFirstNames,
            ...localeData.neutralFirstNames,
        ];
        return rng.pick(allNames);
    }

    /**
     * Generates a last name.
     *
     * @returns A last name string.
     *
     * @example
     * ```typescript
     * console.log(nameGen.last()); // "Smith"
     * console.log(nameGen.last()); // "Johnson"
     * ```
     */
    last(): string {
        const rng = this.context.getRng();
        const locale = this.context.getLocale();
        const localeData = this.localeProvider.getLocaleData(locale);

        return rng.pick(localeData.lastNames);
    }

    /**
     * Generates a full name with optional formatting.
     *
     * @param options - Optional configuration for full name generation.
     * @param options.gender - Gender for first name selection.
     * @param options.format - Format for name arrangement.
     *
     * @returns A full name string.
     *
     * @example
     * ```typescript
     * console.log(nameGen.full()); // "James Smith"
     * console.log(nameGen.full({ gender: 'female' })); // "Mary Johnson"
     * console.log(nameGen.full({ format: 'lastName firstName' })); // "Smith James"
     * console.log(nameGen.full({ gender: 'male', format: 'lastName firstName' })); // "Brown Robert"
     * ```
     */
    full(options?: {
        gender?: "male" | "female";
        format?: "firstName lastName" | "lastName firstName";
    }): string {
        const firstName = this.first(options?.gender);
        const lastName = this.last();

        if (options?.format === "lastName firstName") {
            return `${lastName} ${firstName}`;
        }

        return `${firstName} ${lastName}`;
    }

    /**
     * Generates initials.
     *
     * @param length - Number of initials to generate (default: 2).
     *
     * @returns A string of initials separated by periods.
     *
     * @example
     * ```typescript
     * console.log(nameGen.initials()); // "J.S."
     * console.log(nameGen.initials(3)); // "J.M.S."
     * console.log(nameGen.initials(1)); // "J."
     * ```
     */
    initials(length: number = 2): string {
        const rng = this.context.getRng();
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        const initials = Array.from({ length }, () =>
            rng.pick(letters.split(""))
        );
        return initials.map((initial) => `${initial}.`).join("");
    }

    /**
     * Generates a name title or prefix.
     *
     * @returns A title string.
     *
     * @example
     * ```typescript
     * console.log(nameGen.title()); // "Mr."
     * console.log(nameGen.title()); // "Dr."
     * console.log(nameGen.title()); // "Prof."
     * ```
     */
    title(): string {
        const rng = this.context.getRng();
        const locale = this.context.getLocale();
        const localeData = this.localeProvider.getLocaleData(locale);

        return rng.pick(localeData.titles);
    }

    /**
     * Generates a username based on names.
     *
     * @param options - Optional configuration for username generation.
     * @param options.format - Format for username construction.
     * @param options.separator - Separator character for name parts.
     *
     * @returns A username string.
     *
     * @example
     * ```typescript
     * console.log(nameGen.username()); // "johnsmith"
     * console.log(nameGen.username({ format: 'lastFirst' })); // "smithjohn"
     * console.log(nameGen.username({ separator: '.' })); // "john.smith"
     * console.log(nameGen.username({ format: 'random' })); // "user123"
     * console.log(nameGen.username({ format: 'firstLast', separator: '_' })); // "john_smith"
     * ```
     */
    username(options?: {
        format?: "firstLast" | "lastFirst" | "random";
        separator?: string;
    }): string {
        const rng = this.context.getRng();
        const separator = options?.separator || "";
        const format = options?.format || "firstLast";

        if (format === "random") {
            const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            const length = rng.int(6, 12);
            return Array.from({ length }, () => rng.pick(chars.split(""))).join(
                ""
            );
        }

        const firstName = this.first().toLowerCase();
        const lastName = this.last().toLowerCase();

        if (format === "lastFirst") {
            return `${lastName}${separator}${firstName}`;
        }

        return `${firstName}${separator}${lastName}`;
    }

    /**
     * Generates a nickname.
     *
     * @returns A nickname string.
     *
     * @example
     * ```typescript
     * console.log(nameGen.nickname()); // "Ace"
     * console.log(nameGen.nickname()); // "Buddy"
     * console.log(nameGen.nickname()); // "Flash"
     * ```
     */
    nickname(): string {
        const rng = this.context.getRng();
        const locale = this.context.getLocale();
        const localeData = this.localeProvider.getLocaleData(locale);

        return rng.pick(localeData.nicknames);
    }

    /**
     * Returns the default configuration for name generation.
     *
     * @returns Default NameConfig object.
     */
    getDefaultConfig(): NameConfig {
        return {
            firstName: true,
            lastName: true,
            prefix: false,
            suffix: false,
            gender: "neutral",
            format: "firstName lastName",
        };
    }

    /**
     * Validates the provided configuration object.
     *
     * @param config - The configuration to validate.
     *
     * @returns True if the configuration is valid.
     *
     * @throws {Error} If the configuration contains invalid values.
     */
    validateConfig(config: NameConfig): boolean {
        if (typeof config !== "object" || config === null) {
            throw new Error("Config must be an object");
        }

        if (config.gender !== undefined) {
            const validGenders = ["male", "female", "neutral"];
            if (!validGenders.includes(config.gender)) {
                throw new Error(
                    `Invalid gender. Must be one of: ${validGenders.join(", ")}`
                );
            }
        }

        if (config.format !== undefined) {
            const validFormats = ["firstName lastName", "lastName firstName"];
            if (!validFormats.includes(config.format)) {
                throw new Error(
                    `Invalid format. Must be one of: ${validFormats.join(", ")}`
                );
            }
        }

        return true;
    }
}
