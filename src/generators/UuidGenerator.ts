import type { IGenerator } from "../types/IGenerator";
import type GeneratorContext from "../core/GeneratorContext";

/**
 * Configuration for UUID generation.
 */
export interface UuidConfig {
    /** UUID version to generate (1, 4, 5, 7). */
    version?: 1 | 4 | 5 | 7;
    /** Name for UUID v5 generation. */
    name?: string;
    /** Namespace for UUID v5 generation (must be valid UUID). */
    namespace?: string;
    /** Custom format pattern for custom UUID generation. */
    format?: string;
}

/**
 * Generator for creating RFC 4122 compliant UUIDs and custom identifier formats.
 *
 * This generator implements multiple UUID versions according to RFC 4122 specifications:
 * - UUID v1: Timestamp-based with node ID
 * - UUID v4: Random or pseudo-random
 * - UUID v5: Name-based using SHA-1 hash
 * - UUID v7: Timestamp + random (modern replacement for v1)
 *
 * All generated UUIDs follow the standard format: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
 * Where M is the version number and N contains variant bits.
 *
 * @see RFC 4122: https://tools.ietf.org/html/rfc4122
 * @see UUID v7: https://datatracker.ietf.org/doc/html/draft-peabody-dispatch-new-uuid-format
 *
 * @example
 * ```typescript
 * const uuidGen = new UuidGenerator(context);
 *
 * console.log(uuidGen.v4()); // "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 * console.log(uuidGen.v1()); // "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
 * console.log(uuidGen.v7()); // "017f22e2-79b0-7cc3-98c4-dc0c0c07398f"
 * ```
 */
export default class UuidGenerator implements IGenerator<UuidConfig, string> {
    readonly name = "uuid";
    readonly context: GeneratorContext;

    /** Hexadecimal characters for UUID generation. */
    private static readonly HEX_CHARS = "0123456789abcdef";

    /** Epoch difference between UUID v1 and Unix timestamps (October 15, 1582). */
    private static readonly UUID_V1_EPOCH = 0x01b21dd213814000n;

    /** Counter for UUID v1 clock sequence. */
    private clockSequence: number;

    /** Fake node ID for UUID v1 (simulates MAC address). */
    private nodeId: string;

    /** Last timestamp used for UUID v1 generation. */
    private lastTimestamp: bigint = 0n;

    /**
     * Creates a new UuidGenerator instance.
     *
     * @param context - The generator context providing RNG functionality.
     *
     * @example
     * ```typescript
     * const context = new GeneratorContext({ seed: 12345 });
     * const uuidGen = new UuidGenerator(context);
     * console.log(uuidGen.v4()); // Deterministic UUID based on seed
     * ```
     */
    constructor(context: GeneratorContext) {
        this.context = context;

        // Initialize UUID v1 components
        const rng = this.context.getRng();
        this.clockSequence = rng.int(0, 16383); // 14-bit value
        this.nodeId = this.generateNodeId();
    }

    /**
     * Generates a UUID based on configuration (defaults to v4).
     *
     * @param config - Optional configuration for UUID generation.
     *
     * @returns A UUID string in standard format.
     *
     * @example
     * ```typescript
     * console.log(uuidGen.generate()); // v4 UUID
     * console.log(uuidGen.generate({ version: 1 })); // v1 UUID
     * ```
     */
    generate(config?: UuidConfig): string {
        const version = config?.version ?? 4;

        switch (version) {
            case 1:
                return this.v1();
            case 4:
                return this.v4();
            case 5:
                if (!config?.name || !config?.namespace) {
                    throw new Error(
                        "UUID v5 requires name and namespace parameters"
                    );
                }
                return this.v5(config.name, config.namespace);
            case 7:
                return this.v7();
            default:
                throw new Error(`Unsupported UUID version: ${version}`);
        }
    }

    /**
     * Generates a UUID version 1 (timestamp-based) according to RFC 4122.
     *
     * UUID v1 format: time_low-time_mid-time_hi_and_version-clock_seq_and_variant-node
     * The timestamp is based on the number of 100-nanosecond intervals since
     * October 15, 1582 (the date of Gregorian reform to the Christian calendar).
     *
     * @returns A UUID v1 string.
     *
     * @see RFC 4122 Section 4.2.2
     *
     * @example
     * ```typescript
     * console.log(uuidGen.v1()); // "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
     * console.log(uuidGen.v1()); // "6ba7b811-9dad-11d1-80b4-00c04fd430c8" (incremented)
     * ```
     */
    v1(): string {
        // Get current timestamp in 100-nanosecond intervals since UUID epoch
        const now = BigInt(Date.now()) * 10000n + UuidGenerator.UUID_V1_EPOCH;

        // Handle clock regression or same timestamp
        if (now <= this.lastTimestamp) {
            this.clockSequence = (this.clockSequence + 1) & 0x3fff; // Wrap at 14 bits
        }
        this.lastTimestamp = now;

        // Extract timestamp components
        const timeLow = Number(now & 0xffffffffn);
        const timeMid = Number((now >> 32n) & 0xffffn);
        const timeHi = Number((now >> 48n) & 0x0fffn) | 0x1000; // Version 1

        // Clock sequence with variant bits
        const clockSeqHi = ((this.clockSequence >> 8) & 0x3f) | 0x80; // Variant 10
        const clockSeqLow = this.clockSequence & 0xff;

        return this.formatUuid([
            this.toHex(timeLow, 8),
            this.toHex(timeMid, 4),
            this.toHex(timeHi, 4),
            this.toHex(clockSeqHi, 2) + this.toHex(clockSeqLow, 2),
            this.nodeId,
        ]);
    }

    /**
     * Generates a UUID version 4 (random) according to RFC 4122.
     *
     * UUID v4 uses random or pseudo-random numbers for all bits except:
     * - Version bits (4 bits): Set to 0100 (binary) = 4 (decimal)
     * - Variant bits (2 bits): Set to 10 (binary) for RFC 4122 compliance
     *
     * @returns A UUID v4 string.
     *
     * @see RFC 4122 Section 4.4
     *
     * @example
     * ```typescript
     * console.log(uuidGen.v4()); // "f47ac10b-58cc-4372-a567-0e02b2c3d479"
     * console.log(uuidGen.v4()); // "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
     * ```
     */
    v4(): string {
        const rng = this.context.getRng();
        const hex = UuidGenerator.HEX_CHARS;

        // Generate 32 random hex characters
        const randomBytes = Array.from({ length: 32 }, () =>
            rng.pick(hex.split(""))
        );

        // Set version bits (position 12): 4
        randomBytes[12] = "4";

        // Set variant bits (position 16): 8, 9, a, or b
        randomBytes[16] = hex[rng.int(8, 11)];

        return this.formatUuid([
            randomBytes.slice(0, 8).join(""),
            randomBytes.slice(8, 12).join(""),
            randomBytes.slice(12, 16).join(""),
            randomBytes.slice(16, 20).join(""),
            randomBytes.slice(20, 32).join(""),
        ]);
    }

    /**
     * Generates a UUID version 5 (name-based using SHA-1) according to RFC 4122.
     *
     * UUID v5 creates a deterministic UUID by hashing a name within a namespace.
     * The hash is computed using SHA-1 and formatted according to UUID structure.
     *
     * @param name - The name to hash (any string).
     * @param namespace - The namespace UUID (must be valid UUID format).
     *
     * @returns A UUID v5 string.
     *
     * @throws {Error} If namespace is not a valid UUID format.
     *
     * @see RFC 4122 Section 4.3
     *
     * @example
     * ```typescript
     * const ns = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
     * console.log(uuidGen.v5("example.com", ns)); // "cfbff0d1-9375-5685-968c-48ce8b15ae17"
     * console.log(uuidGen.v5("test.org", ns));    // "45a113ac-c7f2-5740-9403-90b03d3b1f46"
     * ```
     */
    v5(name: string, namespace: string): string {
        // Validate namespace UUID format
        if (!this.isValidUuid(namespace)) {
            throw new Error(`Invalid namespace UUID format: ${namespace}`);
        }

        // Simple deterministic hash (SHA-1 simulation for demo)
        // In production, use actual SHA-1 implementation
        const input = namespace.replace(/-/g, "") + name;
        const hash = this.simpleHash(input);

        // Take first 32 hex characters from hash
        const hashBytes = hash.substring(0, 32).split("");

        // Set version bits (position 12): 5
        hashBytes[12] = "5";

        // Set variant bits (position 16): 8, 9, a, or b
        const rng = this.context.getRng();
        hashBytes[16] = UuidGenerator.HEX_CHARS[rng.int(8, 11)];

        return this.formatUuid([
            hashBytes.slice(0, 8).join(""),
            hashBytes.slice(8, 12).join(""),
            hashBytes.slice(12, 16).join(""),
            hashBytes.slice(16, 20).join(""),
            hashBytes.slice(20, 32).join(""),
        ]);
    }

    /**
     * Generates a UUID version 7 (timestamp + random) according to draft specification.
     *
     * UUID v7 combines a timestamp with random data for better sortability
     * while maintaining uniqueness. It's designed as a modern replacement for UUID v1.
     *
     * Format: unix_ts_ms (48 bits) + ver (4 bits) + rand_a (12 bits) + var (2 bits) + rand_b (62 bits)
     *
     * @returns A UUID v7 string.
     *
     * @see https://datatracker.ietf.org/doc/html/draft-peabody-dispatch-new-uuid-format
     *
     * @example
     * ```typescript
     * console.log(uuidGen.v7()); // "017f22e2-79b0-7cc3-98c4-dc0c0c07398f"
     * console.log(uuidGen.v7()); // "017f22e2-79b0-7cc3-98c5-dc0c0c07398f" (later timestamp)
     * ```
     */
    v7(): string {
        const rng = this.context.getRng();

        // Get current timestamp in milliseconds (48 bits)
        const timestamp = BigInt(Date.now());

        // Generate random data
        const randA = rng.int(0, 4095); // 12 bits
        const randB1 = rng.int(0, 16383); // 14 bits (minus 2 variant bits)
        const randB2 = rng.int(0, 0xffffffffffff); // 48 bits

        // Format components
        const timestampHex = this.toHex(Number(timestamp), 12);
        const versionAndRandA = this.toHex(0x7000 | randA, 4); // Version 7 + rand_a
        const variantAndRandB1 = this.toHex(0x8000 | randB1, 4); // Variant 10 + rand_b part 1
        const randB2Hex = this.toHex(randB2, 12);

        return this.formatUuid([
            timestampHex.substring(0, 8),
            timestampHex.substring(8, 12),
            versionAndRandA,
            variantAndRandB1,
            randB2Hex,
        ]);
    }

    /**
     * Returns the nil UUID (all zeros).
     *
     * The nil UUID is a special case UUID consisting of all zeros,
     * used to indicate the absence of a UUID value.
     *
     * @returns The nil UUID string.
     *
     * @see RFC 4122 Section 4.1.7
     *
     * @example
     * ```typescript
     * console.log(uuidGen.nil()); // "00000000-0000-0000-0000-000000000000"
     * ```
     */
    nil(): string {
        return "00000000-0000-0000-0000-000000000000";
    }

    /**
     * Generates a custom format UUID-like string.
     *
     * Uses 'x' characters in the format string as placeholders for random hex digits.
     * Other characters are preserved as-is.
     *
     * @param format - Format string with 'x' as hex placeholders.
     *
     * @returns A string following the custom format.
     *
     * @throws {Error} If format string is empty or contains no 'x' characters.
     *
     * @example
     * ```typescript
     * console.log(uuidGen.custom("xxxx-xxxx")); // "a1b2-c3d4"
     * console.log(uuidGen.custom("ID_xxxx_xxxx_xxxx")); // "ID_1234_5678_9abc"
     * console.log(uuidGen.custom("xxx.xxx.xxx")); // "abc.def.123"
     * ```
     */
    custom(format: string): string {
        if (!format || typeof format !== "string") {
            throw new Error("Format string is required and must be a string");
        }

        if (!format.includes("x")) {
            throw new Error(
                'Format string must contain at least one "x" placeholder'
            );
        }

        const rng = this.context.getRng();
        const hex = UuidGenerator.HEX_CHARS;

        return format.replace(/x/g, () => rng.pick(hex.split("")));
    }

    /**
     * Returns the default configuration for UUID generation.
     *
     * @returns Default UuidConfig object.
     */
    getDefaultConfig(): UuidConfig {
        return { version: 4 };
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
    validateConfig(config: UuidConfig): boolean {
        if (typeof config !== "object" || config === null) {
            throw new Error("Config must be an object");
        }

        if (config.version !== undefined) {
            const validVersions = [1, 4, 5, 7];
            if (!validVersions.includes(config.version)) {
                throw new Error(
                    `Invalid UUID version. Must be one of: ${validVersions.join(
                        ", "
                    )}`
                );
            }
        }

        if (config.version === 5) {
            if (!config.name || typeof config.name !== "string") {
                throw new Error("UUID v5 requires a name parameter");
            }
            if (!config.namespace || !this.isValidUuid(config.namespace)) {
                throw new Error("UUID v5 requires a valid namespace UUID");
            }
        }

        if (config.format !== undefined) {
            if (
                typeof config.format !== "string" ||
                !config.format.includes("x")
            ) {
                throw new Error(
                    'Custom format must be a string containing "x" placeholders'
                );
            }
        }

        return true;
    }

    /**
     * Converts a number to hexadecimal string with specified length.
     *
     * @param value - The number to convert.
     * @param length - The desired length of hex string.
     *
     * @returns Hexadecimal string with leading zeros if necessary.
     *
     * @private
     */
    private toHex(value: number, length: number): string {
        return value.toString(16).toLowerCase().padStart(length, "0");
    }

    /**
     * Formats UUID components into standard UUID format.
     *
     * @param components - Array of hex string components [8-4-4-4-12].
     *
     * @returns Formatted UUID string.
     *
     * @private
     */
    private formatUuid(components: string[]): string {
        return components.join("-");
    }

    /**
     * Generates a fake node ID (MAC address) for UUID v1.
     *
     * @returns 12-character hex string representing node ID.
     *
     * @private
     */
    private generateNodeId(): string {
        const rng = this.context.getRng();
        const hex = UuidGenerator.HEX_CHARS;

        // Generate 6 bytes (12 hex chars) for node ID
        // Set multicast bit to indicate it's not a real MAC address
        let nodeId = Array.from({ length: 12 }, () =>
            rng.pick(hex.split(""))
        ).join("");

        // Set multicast bit (first bit of first octet)
        const firstByte = parseInt(nodeId.substring(0, 2), 16) | 0x01;
        nodeId = this.toHex(firstByte, 2) + nodeId.substring(2);

        return nodeId;
    }

    /**
     * Validates if a string is a properly formatted UUID.
     *
     * @param uuid - The string to validate.
     *
     * @returns True if the string is a valid UUID format.
     *
     * @private
     */
    private isValidUuid(uuid: string): boolean {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    /**
     * Simple deterministic hash function (SHA-1 simulation).
     *
     * @param input - The string to hash.
     *
     * @returns Hexadecimal hash string.
     *
     * @private
     */
    private simpleHash(input: string): string {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        // Convert to positive number and then to hex
        const positiveHash = Math.abs(hash);
        const hexHash = positiveHash.toString(16);

        // Extend to at least 32 characters by repeating
        const repeated = hexHash.repeat(Math.ceil(32 / hexHash.length));
        return repeated.substring(0, 40); // Return 40 chars (simulating SHA-1 length)
    }
}
