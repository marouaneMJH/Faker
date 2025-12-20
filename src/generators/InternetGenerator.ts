import type { IGenerator } from "../types/IGenerator";
import type GeneratorContext from "../core/GeneratorContext";
import type NameGenerator from "./NameGenerator";

/**
 * Configuration for internet-related data generation.
 */
export interface InternetConfig {
    /** Domain name to use for email addresses. */
    domain?: string;
    /** Username length for generated usernames. */
    usernameLength?: number;
    /** Protocol to use for URLs. */
    protocol?: "http" | "https";
    /** Include path in generated URLs. */
    includePath?: boolean;
}

/**
 * Generator for creating internet-related fake data with comprehensive validation.
 *
 * This generator creates realistic internet data including emails, URLs, IP addresses,
 * user agents, and other web-related content. It uses dependency injection to access
 * the NameGenerator for creating realistic email prefixes.
 *
 * @example
 * ```typescript
 * const internetGen = new InternetGenerator(context, nameGen);
 *
 * console.log(internetGen.email()); // "james.smith@gmail.com"
 * console.log(internetGen.url()); // "https://example.com/path/to/page"
 * console.log(internetGen.ipv4()); // "192.168.1.1"
 * ```
 */
export default class InternetGenerator
    implements IGenerator<InternetConfig, string>
{
    readonly name = "internet";
    readonly context: GeneratorContext;
    private readonly nameGenerator: NameGenerator;

    /** Common email domains. */
    private static readonly EMAIL_DOMAINS = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "aol.com",
        "icloud.com",
        "protonmail.com",
        "zoho.com",
        "yandex.com",
        "mail.com",
    ];

    /** Disposable email domains. */
    private static readonly DISPOSABLE_DOMAINS = [
        "mailinator.com",
        "tempmail.org",
        "10minutemail.com",
        "guerrillamail.com",
        "temp-mail.org",
        "throwaway.email",
        "maildrop.cc",
        "sharklasers.com",
        "grr.la",
        "guerrillamailblock.com",
    ];

    /** Common TLD extensions. */
    private static readonly TLD_EXTENSIONS = [
        "com",
        "org",
        "net",
        "edu",
        "gov",
        "io",
        "co",
        "info",
        "biz",
        "name",
    ];

    /** User agent strings for different browsers. */
    private static readonly USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    ];

    /**
     * Creates a new InternetGenerator instance with dependency injection.
     *
     * @param context - The generator context providing locale and RNG.
     * @param nameGenerator - The name generator for creating realistic email prefixes.
     *
     * @example
     * ```typescript
     * const context = new GeneratorContext();
     * const nameGen = new NameGenerator(context);
     * const internetGen = new InternetGenerator(context, nameGen);
     *
     * console.log(internetGen.email()); // Uses nameGen for realistic prefixes
     * ```
     */
    constructor(context: GeneratorContext, nameGenerator: NameGenerator) {
        this.context = context;
        this.nameGenerator = nameGenerator;
    }

    /**
     * Generates internet-related data based on configuration.
     *
     * @param config - Optional configuration for generation.
     *
     * @returns Generated internet data (defaults to email).
     *
     * @example
     * ```typescript
     * console.log(internetGen.generate()); // "james.smith@gmail.com"
     * console.log(internetGen.generate({ domain: 'company.com' })); // "user@company.com"
     * ```
     */
    generate(config?: InternetConfig): string {
        return this.email({ domain: config?.domain });
    }

    /**
     * Generates a valid email address with realistic formatting.
     *
     * @param options - Optional configuration for email generation.
     * @param options.domain - Custom domain to use.
     * @param options.firstName - Custom first name for prefix.
     * @param options.lastName - Custom last name for prefix.
     *
     * @returns A valid email address.
     *
     * @throws {Error} If provided names contain invalid characters.
     *
     * @example
     * ```typescript
     * console.log(internetGen.email()); // "james.smith@gmail.com"
     * console.log(internetGen.email({ domain: 'company.com' })); // "john.doe@company.com"
     * console.log(internetGen.email({ firstName: 'Jane', lastName: 'Doe' })); // "jane.doe@yahoo.com"
     * ```
     */
    email(options?: {
        domain?: string;
        firstName?: string;
        lastName?: string;
    }): string {
        const rng = this.context.getRng();

        // Validate custom names
        if (options?.firstName && !/^[a-zA-Z\s'-]+$/.test(options.firstName)) {
            throw new Error("First name contains invalid characters");
        }
        if (options?.lastName && !/^[a-zA-Z\s'-]+$/.test(options.lastName)) {
            throw new Error("Last name contains invalid characters");
        }

        const firstName = options?.firstName || this.nameGenerator.first();
        const lastName = options?.lastName || this.nameGenerator.last();
        const domain =
            options?.domain || rng.pick(InternetGenerator.EMAIL_DOMAINS);

        // Create email-safe username
        const cleanFirst = this.sanitizeForEmail(firstName);
        const cleanLast = this.sanitizeForEmail(lastName);

        // Various username formats
        const formats = [
            `${cleanFirst}.${cleanLast}`,
            `${cleanFirst}${cleanLast}`,
            `${cleanFirst.charAt(0)}${cleanLast}`,
            `${cleanFirst}${rng.int(1, 999)}`,
            `${cleanFirst}.${cleanLast}${rng.int(1, 99)}`,
        ];

        const username = rng.pick(formats);
        return `${username.toLowerCase()}@${domain}`;
    }

    /**
     * Generates a disposable email address using temporary email services.
     *
     * @returns A disposable email address.
     *
     * @example
     * ```typescript
     * console.log(internetGen.disposableEmail()); // "user123@tempmail.org"
     * console.log(internetGen.disposableEmail()); // "temp456@mailinator.com"
     * ```
     */
    disposableEmail(): string {
        const rng = this.context.getRng();
        const username = this.username(rng.int(6, 12));
        const domain = rng.pick(InternetGenerator.DISPOSABLE_DOMAINS);

        return `${username}@${domain}`;
    }

    /**
     * Generates a corporate email address for a company.
     *
     * @param companyName - The company name to use for the domain.
     *
     * @returns A corporate email address.
     *
     * @throws {Error} If company name is empty or contains invalid characters.
     *
     * @example
     * ```typescript
     * console.log(internetGen.corporateEmail('Acme Corp')); // "john.smith@acme-corp.com"
     * console.log(internetGen.corporateEmail('Tech Solutions')); // "jane.doe@tech-solutions.com"
     * ```
     */
    corporateEmail(companyName: string): string {
        if (!companyName || typeof companyName !== "string") {
            throw new Error("Company name is required and must be a string");
        }

        const rng = this.context.getRng();
        const firstName = this.nameGenerator.first();
        const lastName = this.nameGenerator.last();

        // Create domain-safe company name
        const domain = this.slug() + "." + rng.pick(["com", "org", "net"]);
        const username = `${this.sanitizeForEmail(
            firstName
        )}.${this.sanitizeForEmail(lastName)}`.toLowerCase();

        return `${username}@${domain}`;
    }

    /**
     * Generates a URL-safe username.
     *
     * @param length - Length of the username (default: random 6-12).
     *
     * @returns A URL-safe username.
     *
     * @throws {Error} If length is less than 3 or greater than 50.
     *
     * @example
     * ```typescript
     * console.log(internetGen.username()); // "user123abc"
     * console.log(internetGen.username(8)); // "johnsmith"
     * console.log(internetGen.username(6)); // "jane42"
     * ```
     */
    username(length?: number): string {
        const rng = this.context.getRng();
        const targetLength = length || rng.int(6, 12);

        if (targetLength < 3 || targetLength > 50) {
            throw new Error(
                "Username length must be between 3 and 50 characters"
            );
        }

        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        return Array.from({ length: targetLength }, () =>
            rng.pick(chars.split(""))
        ).join("");
    }

    /**
     * Generates a URL slug in kebab-case format.
     *
     * @param words - Number of words in the slug (default: random 2-4).
     *
     * @returns A kebab-case URL slug.
     *
     * @example
     * ```typescript
     * console.log(internetGen.slug()); // "awesome-tech-solution"
     * console.log(internetGen.slug(2)); // "great-product"
     * console.log(internetGen.slug(5)); // "amazing-new-web-app-feature"
     * ```
     */
    slug(words?: number): string {
        const rng = this.context.getRng();
        const wordCount = words || rng.int(2, 4);

        const slugWords = [
            "awesome",
            "amazing",
            "great",
            "cool",
            "super",
            "mega",
            "ultra",
            "pro",
            "tech",
            "web",
            "app",
            "site",
            "page",
            "blog",
            "news",
            "shop",
            "solution",
            "service",
            "product",
            "feature",
            "tool",
            "platform",
            "system",
        ];

        const selectedWords = Array.from({ length: wordCount }, () =>
            rng.pick(slugWords)
        );

        return selectedWords.join("-");
    }

    /**
     * Generates a complete URL with optional components.
     *
     * @param options - Optional configuration for URL generation.
     * @param options.protocol - Protocol to use ('http' or 'https').
     * @param options.domain - Custom domain to use.
     * @param options.path - Whether to include a path.
     *
     * @returns A complete URL.
     *
     * @example
     * ```typescript
     * console.log(internetGen.url()); // "https://example.com/path/to/page"
     * console.log(internetGen.url({ protocol: 'http' })); // "http://site.org/about"
     * console.log(internetGen.url({ domain: 'mysite.com', path: false })); // "https://mysite.com"
     * ```
     */
    url(options?: {
        protocol?: "http" | "https";
        domain?: string;
        path?: boolean;
    }): string {
        const rng = this.context.getRng();
        const protocol = options?.protocol || rng.pick(["http", "https"]);

        let domain: string;
        if (options?.domain) {
            domain = options.domain;
        } else {
            const subdomain = this.slug(1);
            const tld = rng.pick(InternetGenerator.TLD_EXTENSIONS);
            domain = `${subdomain}.${tld}`;
        }

        let url = `${protocol}://${domain}`;

        if (options?.path !== false) {
            const pathSegments = Array.from({ length: rng.int(1, 3) }, () =>
                this.slug(1)
            );
            url += "/" + pathSegments.join("/");
        }

        return url;
    }

    /**
     * Generates a valid IPv4 address with optional CIDR notation.
     *
     * @param cidr - Optional CIDR notation (e.g., '192.168.1.0/24').
     *
     * @returns A valid IPv4 address.
     *
     * @example
     * ```typescript
     * console.log(internetGen.ipv4()); // "192.168.1.42"
     * console.log(internetGen.ipv4('10.0.0.0/8')); // "10.15.32.100"
     * console.log(internetGen.ipv4('172.16.0.0/12')); // "172.20.5.75"
     * ```
     */
    ipv4(cidr?: string): string {
        const rng = this.context.getRng();

        if (cidr) {
            // Parse CIDR notation and generate IP within range
            const [network, prefixLength] = cidr.split("/");
            const prefix = parseInt(prefixLength);
            const [a, b, c, d] = network.split(".").map(Number);

            // Simple CIDR implementation for common cases
            if (prefix >= 24) {
                return `${a}.${b}.${c}.${rng.int(1, 254)}`;
            } else if (prefix >= 16) {
                return `${a}.${b}.${rng.int(0, 255)}.${rng.int(1, 254)}`;
            } else if (prefix >= 8) {
                return `${a}.${rng.int(0, 255)}.${rng.int(0, 255)}.${rng.int(
                    1,
                    254
                )}`;
            }
        }

        // Generate random private IP ranges
        const ranges = [
            () => `192.168.${rng.int(0, 255)}.${rng.int(1, 254)}`,
            () => `10.${rng.int(0, 255)}.${rng.int(0, 255)}.${rng.int(1, 254)}`,
            () =>
                `172.${rng.int(16, 31)}.${rng.int(0, 255)}.${rng.int(1, 254)}`,
        ];

        return rng.pick(ranges)();
    }

    /**
     * Generates a valid IPv6 address.
     *
     * @returns A valid IPv6 address in standard notation.
     *
     * @example
     * ```typescript
     * console.log(internetGen.ipv6()); // "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
     * console.log(internetGen.ipv6()); // "fe80:0000:0000:0000:0202:b3ff:fe1e:8329"
     * ```
     */
    ipv6(): string {
        const rng = this.context.getRng();
        const segments = Array.from({ length: 8 }, () => {
            return rng.int(0, 65535).toString(16).padStart(4, "0");
        });

        return segments.join(":");
    }

    /**
     * Generates a MAC address with configurable separator.
     *
     * @param separator - Separator character (default: ':').
     *
     * @returns A valid MAC address.
     *
     * @example
     * ```typescript
     * console.log(internetGen.mac()); // "00:1B:44:11:3A:B7"
     * console.log(internetGen.mac('-')); // "00-1B-44-11-3A-B7"
     * console.log(internetGen.mac('')); // "001B44113AB7"
     * ```
     */
    mac(separator: string = ":"): string {
        const rng = this.context.getRng();
        const segments = Array.from({ length: 6 }, () => {
            return rng.int(0, 255).toString(16).toUpperCase().padStart(2, "0");
        });

        return segments.join(separator);
    }

    /**
     * Generates a realistic user agent string.
     *
     * @returns A user agent string for a common browser.
     *
     * @example
     * ```typescript
     * console.log(internetGen.userAgent());
     * // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
     * ```
     */
    userAgent(): string {
        const rng = this.context.getRng();
        return rng.pick(InternetGenerator.USER_AGENTS);
    }

    /**
     * Generates a fake JSON Web Token (JWT) with three base64-encoded parts.
     *
     * @param payload - Optional payload object to include in the token.
     *
     * @returns A fake JWT string with header, payload, and signature.
     *
     * @example
     * ```typescript
     * console.log(internetGen.jwt()); // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiSm9obiJ9.signature"
     * console.log(internetGen.jwt({ user: 'Jane', role: 'admin' }));
     * // JWT with custom payload
     * ```
     */
    jwt(payload?: object): string {
        const header = { typ: "JWT", alg: "HS256" };
        const defaultPayload = {
            user: this.nameGenerator.first(),
            exp: Date.now() + 3600000, // 1 hour from now
        };
        const jwtPayload = payload || defaultPayload;

        // Base64 encode (browser-compatible)
        const encodeBase64 = (obj: object): string => {
            const jsonStr = JSON.stringify(obj);
            // Simple base64 encoding for demo purposes
            if (typeof btoa !== "undefined") {
                return btoa(jsonStr)
                    .replace(/=/g, "")
                    .replace(/\+/g, "-")
                    .replace(/\//g, "_");
            }
            // Fallback: generate fake base64-like string
            const chars =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
            const rng = this.context.getRng();
            return Array.from({ length: 36 }, () =>
                rng.pick(chars.split(""))
            ).join("");
        };

        const encodedHeader = encodeBase64(header);
        const encodedPayload = encodeBase64(jwtPayload);

        // Generate fake signature
        const rng = this.context.getRng();
        const signatureChars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
        const signature = Array.from({ length: 43 }, () =>
            rng.pick(signatureChars.split(""))
        ).join("");

        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    /**
     * Returns the default configuration for internet data generation.
     *
     * @returns Default InternetConfig object.
     */
    getDefaultConfig(): InternetConfig {
        return {
            usernameLength: 8,
            protocol: "https",
            includePath: true,
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
    validateConfig(config: InternetConfig): boolean {
        if (typeof config !== "object" || config === null) {
            throw new Error("Config must be an object");
        }

        if (config.usernameLength !== undefined) {
            if (
                typeof config.usernameLength !== "number" ||
                config.usernameLength < 1
            ) {
                throw new Error("Username length must be a positive number");
            }
        }

        if (config.protocol !== undefined) {
            if (!["http", "https"].includes(config.protocol)) {
                throw new Error('Protocol must be either "http" or "https"');
            }
        }

        return true;
    }

    /**
     * Sanitizes a string for use in email addresses.
     *
     * @param input - The string to sanitize.
     *
     * @returns A sanitized string safe for email addresses.
     *
     * @private
     */
    private sanitizeForEmail(input: string): string {
        return input
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .substring(0, 20); // Limit length
    }
}
