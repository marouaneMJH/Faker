import type { IGenerator } from "../types/IGenerator";
import type GeneratorContext from "../core/GeneratorContext";

/**
 * Configuration for number generation.
 */
export interface NumberConfig {
    /** Minimum value (inclusive). */
    min?: number;
    /** Maximum value (inclusive for integers, exclusive for floats). */
    max?: number;
    /** Number of decimal places for floating-point numbers. */
    precision?: number;
}

/**
 * Generator for creating various types of numerical data with comprehensive validation.
 *
 * This generator provides methods for creating integers, floats, BigInts, and formatted
 * number strings in different bases (binary, octal, hexadecimal). All methods include
 * proper range validation and edge case handling.
 *
 * Mathematical notation used:
 * - [min, max] for inclusive ranges (integers)
 * - [min, max) for half-open ranges (floats)
 * - ℕ for natural numbers (0, 1, 2, ...)
 * - ℤ for integers (..., -2, -1, 0, 1, 2, ...)
 * - ℝ for real numbers (floating-point)
 *
 * @example
 * ```typescript
 * const numberGen = new NumberGenerator(context);
 *
 * console.log(numberGen.int()); // 42
 * console.log(numberGen.float({ precision: 2 })); // 73.45
 * console.log(numberGen.hex(8)); // "A1B2C3D4"
 * ```
 */
export default class NumberGenerator
    implements IGenerator<NumberConfig, number | string>
{
    readonly name = "number";
    readonly context: GeneratorContext;

    /** Maximum safe integer value for validation. */
    private static readonly MAX_SAFE_INT = Number.MAX_SAFE_INTEGER;

    /** Minimum safe integer value for validation. */
    private static readonly MIN_SAFE_INT = Number.MIN_SAFE_INTEGER;

    /**
     * Creates a new NumberGenerator instance.
     *
     * @param context - The generator context providing RNG functionality.
     *
     * @example
     * ```typescript
     * const context = new GeneratorContext({ seed: 12345 });
     * const numberGen = new NumberGenerator(context);
     * console.log(numberGen.int({ min: 1, max: 10 })); // Deterministic result
     * ```
     */
    constructor(context: GeneratorContext) {
        this.context = context;
    }

    /**
     * Generates a number based on configuration (defaults to integer).
     *
     * @param config - Optional configuration for number generation.
     *
     * @returns A generated number within the specified range.
     *
     * @example
     * ```typescript
     * console.log(numberGen.generate()); // 42 (0-100 range)
     * console.log(numberGen.generate({ min: -50, max: 50 })); // -23
     * ```
     */
    generate(config?: NumberConfig): number {
        const cfg = { ...this.getDefaultConfig(), ...config };
        return this.int({ min: cfg.min, max: cfg.max });
    }

    /**
     * Generates a random integer within the specified range [min, max].
     *
     * Range: min ≤ result ≤ max (both inclusive)
     *
     * @param options - Optional configuration for integer generation.
     * @param options.min - Minimum value (inclusive, default: 0).
     * @param options.max - Maximum value (inclusive, default: 100).
     *
     * @returns An integer ∈ ℤ within the specified range.
     *
     * @throws {Error} If min > max, or if values exceed safe integer limits.
     * @throws {Error} If min or max are not finite numbers.
     *
     * @example
     * ```typescript
     * console.log(numberGen.int()); // 42 (range [0, 100])
     * console.log(numberGen.int({ min: 1, max: 6 })); // 4 (dice roll)
     * console.log(numberGen.int({ min: -100, max: -1 })); // -23 (negative range)
     * console.log(numberGen.int({ min: 0, max: 0 })); // 0 (single value)
     * ```
     */
    int(options?: { min?: number; max?: number }): number {
        const min = options?.min ?? 0;
        const max = options?.max ?? 100;

        this.validateRange(min, max, "int");

        const rng = this.context.getRng();
        return rng.int(min, max);
    }

    /**
     * Generates a random floating-point number within the specified range [min, max).
     *
     * Range: min ≤ result < max (min inclusive, max exclusive)
     *
     * @param options - Optional configuration for float generation.
     * @param options.min - Minimum value (inclusive, default: 0).
     * @param options.max - Maximum value (exclusive, default: 100).
     * @param options.precision - Number of decimal places (default: no rounding).
     *
     * @returns A float ∈ ℝ within the specified range.
     *
     * @throws {Error} If min >= max, or if values are not finite.
     * @throws {Error} If precision is negative or not an integer.
     *
     * @example
     * ```typescript
     * console.log(numberGen.float()); // 42.7834912 (range [0, 100))
     * console.log(numberGen.float({ precision: 2 })); // 73.45
     * console.log(numberGen.float({ min: -1, max: 1, precision: 4 })); // -0.2847
     * console.log(numberGen.float({ min: 0, max: 1 })); // 0.618033988 (no precision limit)
     * ```
     */
    float(options?: {
        min?: number;
        max?: number;
        precision?: number;
    }): number {
        const min = options?.min ?? 0;
        const max = options?.max ?? 100;
        const precision = options?.precision;

        this.validateRange(min, max, "float");

        if (precision !== undefined) {
            if (
                !Number.isInteger(precision) ||
                precision < 0 ||
                precision > 20
            ) {
                throw new Error(
                    "Precision must be an integer between 0 and 20"
                );
            }
        }

        const rng = this.context.getRng();
        return rng.float(min, max, precision);
    }

    /**
     * Generates a random BigInt within the specified range [min, max].
     *
     * Range: min ≤ result ≤ max (both inclusive)
     *
     * @param options - Optional configuration for BigInt generation.
     * @param options.min - Minimum BigInt value (inclusive, default: 0n).
     * @param options.max - Maximum BigInt value (inclusive, default: 100n).
     *
     * @returns A BigInt within the specified range.
     *
     * @throws {Error} If min > max, or if values are not BigInt.
     *
     * @example
     * ```typescript
     * console.log(numberGen.bigInt()); // 42n (range [0n, 100n])
     * console.log(numberGen.bigInt({ min: 1000000n, max: 9999999n })); // 5847392n
     * console.log(numberGen.bigInt({ min: -100n, max: -1n })); // -23n
     * ```
     */
    bigInt(options?: { min?: bigint; max?: bigint }): bigint {
        const min = options?.min ?? 0n;
        const max = options?.max ?? 100n;

        if (typeof min !== "bigint" || typeof max !== "bigint") {
            throw new Error("Min and max must be BigInt values");
        }

        if (min > max) {
            throw new Error(
                `Min value (${min}) cannot be greater than max value (${max})`
            );
        }

        // Convert to regular numbers for RNG, then back to BigInt
        const minNum = Number(min);
        const maxNum = Number(max);

        // Check if conversion is safe
        if (!Number.isSafeInteger(minNum) || !Number.isSafeInteger(maxNum)) {
            throw new Error("BigInt values are too large for safe conversion");
        }

        const rng = this.context.getRng();
        const result = rng.int(minNum, maxNum);

        return BigInt(result);
    }

    /**
     * Generates a hexadecimal string of the specified length.
     *
     * Format: [0-9A-F]* (uppercase hexadecimal digits)
     *
     * @param length - Length of the hex string (default: 8).
     *
     * @returns A hexadecimal string of the specified length.
     *
     * @throws {Error} If length is not a positive integer.
     *
     * @example
     * ```typescript
     * console.log(numberGen.hex()); // "A1B2C3D4" (8 characters)
     * console.log(numberGen.hex(4)); // "F0E1" (4 characters)
     * console.log(numberGen.hex(16)); // "0123456789ABCDEF" (16 characters)
     * console.log(numberGen.hex(1)); // "A" (single digit)
     * ```
     */
    hex(length: number = 8): string {
        if (!Number.isInteger(length) || length < 1 || length > 1000) {
            throw new Error(
                "Length must be a positive integer between 1 and 1000"
            );
        }

        const rng = this.context.getRng();
        const hexChars = "0123456789ABCDEF";

        return Array.from({ length }, () => rng.pick(hexChars.split(""))).join(
            ""
        );
    }

    /**
     * Generates a binary string of the specified length.
     *
     * Format: [01]* (binary digits)
     *
     * @param length - Length of the binary string (default: 8).
     *
     * @returns A binary string of the specified length.
     *
     * @throws {Error} If length is not a positive integer.
     *
     * @example
     * ```typescript
     * console.log(numberGen.binary()); // "10110101" (8 bits)
     * console.log(numberGen.binary(4)); // "1011" (4 bits)
     * console.log(numberGen.binary(16)); // "1010111100001111" (16 bits)
     * console.log(numberGen.binary(1)); // "1" (single bit)
     * ```
     */
    binary(length: number = 8): string {
        if (!Number.isInteger(length) || length < 1 || length > 1000) {
            throw new Error(
                "Length must be a positive integer between 1 and 1000"
            );
        }

        const rng = this.context.getRng();

        return Array.from({ length }, () => rng.pick(["0", "1"])).join("");
    }

    /**
     * Generates an octal string of the specified length.
     *
     * Format: [0-7]* (octal digits)
     *
     * @param length - Length of the octal string (default: 8).
     *
     * @returns An octal string of the specified length.
     *
     * @throws {Error} If length is not a positive integer.
     *
     * @example
     * ```typescript
     * console.log(numberGen.octal()); // "12345670" (8 digits)
     * console.log(numberGen.octal(4)); // "7654" (4 digits)
     * console.log(numberGen.octal(3)); // "123" (3 digits)
     * ```
     */
    octal(length: number = 8): string {
        if (!Number.isInteger(length) || length < 1 || length > 1000) {
            throw new Error(
                "Length must be a positive integer between 1 and 1000"
            );
        }

        const rng = this.context.getRng();
        const octalChars = "01234567";

        return Array.from({ length }, () =>
            rng.pick(octalChars.split(""))
        ).join("");
    }

    /**
     * Generates a percentage value between 0 and 100 with optional precision.
     *
     * Range: [0, 100] ⊂ ℝ
     *
     * @param precision - Number of decimal places (default: 2).
     *
     * @returns A percentage value as a number.
     *
     * @throws {Error} If precision is negative or not an integer.
     *
     * @example
     * ```typescript
     * console.log(numberGen.percentage()); // 73.45 (2 decimal places)
     * console.log(numberGen.percentage(0)); // 87 (integer percentage)
     * console.log(numberGen.percentage(4)); // 42.7834 (4 decimal places)
     * console.log(numberGen.percentage(1)); // 15.8 (1 decimal place)
     * ```
     */
    percentage(precision: number = 2): number {
        if (!Number.isInteger(precision) || precision < 0 || precision > 10) {
            throw new Error("Precision must be an integer between 0 and 10");
        }

        return this.float({ min: 0, max: 100, precision });
    }

    /**
     * Generates a random number between min and max (alias for int with required parameters).
     *
     * Range: min ≤ result ≤ max (both inclusive)
     * This method provides a more explicit API for range specification.
     *
     * @param min - Minimum value (inclusive).
     * @param max - Maximum value (inclusive).
     *
     * @returns An integer within the specified range.
     *
     * @throws {Error} If min > max, or if values are not finite.
     *
     * @example
     * ```typescript
     * console.log(numberGen.between(1, 10)); // 7 (dice-like range)
     * console.log(numberGen.between(-50, 50)); // -23 (centered around zero)
     * console.log(numberGen.between(100, 200)); // 157 (shifted range)
     * ```
     */
    between(min: number, max: number): number {
        return this.int({ min, max });
    }

    /**
     * Returns the default configuration for number generation.
     *
     * @returns Default NumberConfig object.
     */
    getDefaultConfig(): NumberConfig {
        return {
            min: 0,
            max: 100,
            precision: undefined,
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
    validateConfig(config: NumberConfig): boolean {
        if (typeof config !== "object" || config === null) {
            throw new Error("Config must be an object");
        }

        if (config.min !== undefined) {
            if (
                typeof config.min !== "number" ||
                !Number.isFinite(config.min)
            ) {
                throw new Error("Min must be a finite number");
            }
        }

        if (config.max !== undefined) {
            if (
                typeof config.max !== "number" ||
                !Number.isFinite(config.max)
            ) {
                throw new Error("Max must be a finite number");
            }
        }

        if (config.min !== undefined && config.max !== undefined) {
            if (config.min > config.max) {
                throw new Error(
                    `Min value (${config.min}) cannot be greater than max value (${config.max})`
                );
            }
        }

        if (config.precision !== undefined) {
            if (!Number.isInteger(config.precision) || config.precision < 0) {
                throw new Error("Precision must be a non-negative integer");
            }
        }

        return true;
    }

    /**
     * Validates a numeric range for different generation methods.
     *
     * @param min - Minimum value.
     * @param max - Maximum value.
     * @param method - The method name for error context.
     *
     * @throws {Error} If the range is invalid.
     *
     * @private
     */
    private validateRange(
        min: number,
        max: number,
        method: "int" | "float"
    ): void {
        // Check for finite numbers
        if (!Number.isFinite(min) || !Number.isFinite(max)) {
            throw new Error(
                `${method}(): Min and max must be finite numbers (got min: ${min}, max: ${max})`
            );
        }

        // Check range validity
        if (method === "int" && min > max) {
            throw new Error(
                `${method}(): Min value (${min}) cannot be greater than max value (${max})`
            );
        } else if (method === "float" && min >= max) {
            throw new Error(
                `${method}(): Min value (${min}) must be less than max value (${max}) for floats`
            );
        }

        // Check safe integer limits for integers
        if (method === "int") {
            if (
                min < NumberGenerator.MIN_SAFE_INT ||
                max > NumberGenerator.MAX_SAFE_INT
            ) {
                throw new Error(
                    `${method}(): Values must be within safe integer range ` +
                        `[${NumberGenerator.MIN_SAFE_INT}, ${NumberGenerator.MAX_SAFE_INT}]`
                );
            }
        }

        // Additional validation for edge cases
        if (min === max && method === "float") {
            throw new Error(
                `${method}(): Min and max cannot be equal for float generation`
            );
        }
    }
}
