import type GeneratorContext from "../core/GeneratorContext";

/**
 * Generic interface that all faker generators must implement.
 *
 * This interface provides a standardized contract for all data generators,
 * ensuring consistent behavior and type safety across the faker library.
 *
 * @template TConfig - The configuration type specific to this generator
 * @template TOutput - The output type that this generator produces
 *
 * @example
 * ```typescript
 * // Simple string generator
 * interface NameConfig {
 *   firstName?: boolean;
 *   lastName?: boolean;
 *   prefix?: boolean;
 * }
 *
 * class NameGenerator implements IGenerator<NameConfig, string> {
 *   readonly name = 'name';
 *   readonly context: GeneratorContext;
 *
 *   constructor(context: GeneratorContext) {
 *     this.context = context;
 *   }
 *
 *   generate(config?: NameConfig): string {
 *     const cfg = { ...this.getDefaultConfig(), ...config };
 *     // Generate name based on config
 *     return 'John Doe';
 *   }
 *
 *   getDefaultConfig(): NameConfig {
 *     return { firstName: true, lastName: true, prefix: false };
 *   }
 *
 *   validateConfig(config: NameConfig): boolean {
 *     return typeof config === 'object' && config !== null;
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Complex object generator
 * interface PersonConfig {
 *   includeAddress?: boolean;
 *   includePhone?: boolean;
 *   ageRange?: [number, number];
 * }
 *
 * interface Person {
 *   name: string;
 *   age: number;
 *   email: string;
 *   address?: string;
 *   phone?: string;
 * }
 *
 * class PersonGenerator implements IGenerator<PersonConfig, Person> {
 *   readonly name = 'person';
 *   readonly context: GeneratorContext;
 *
 *   constructor(context: GeneratorContext) {
 *     this.context = context;
 *   }
 *
 *   generate(config?: PersonConfig): Person {
 *     const cfg = { ...this.getDefaultConfig(), ...config };
 *     const rng = this.context.getRng();
 *
 *     return {
 *       name: 'John Doe',
 *       age: rng.int(cfg.ageRange[0], cfg.ageRange[1]),
 *       email: 'john@example.com',
 *       address: cfg.includeAddress ? '123 Main St' : undefined,
 *       phone: cfg.includePhone ? '+1-555-0123' : undefined
 *     };
 *   }
 *
 *   getDefaultConfig(): PersonConfig {
 *     return {
 *       includeAddress: false,
 *       includePhone: false,
 *       ageRange: [18, 65]
 *     };
 *   }
 *
 *   validateConfig(config: PersonConfig): boolean {
 *     if (typeof config !== 'object' || config === null) return false;
 *
 *     if (config.ageRange) {
 *       const [min, max] = config.ageRange;
 *       if (typeof min !== 'number' || typeof max !== 'number' || min >= max) {
 *         return false;
 *       }
 *     }
 *
 *     return true;
 *   }
 * }
 * ```
 */
export interface IGenerator<TConfig = any, TOutput = any> {
    /**
     * Unique identifier for this generator.
     *
     * Used for registration, lookup, and debugging purposes.
     * Should be a descriptive, lowercase string that uniquely identifies
     * the type of data this generator produces.
     *
     * @example 'name', 'email', 'address', 'person', 'product'
     */
    readonly name: string;

    /**
     * Reference to the shared generator context.
     *
     * Provides access to the random number generator, locale settings,
     * and other shared configuration. This context is managed externally
     * and should not be modified by the generator.
     *
     * @example
     * ```typescript
     * generate(): string {
     *   const rng = this.context.getRng();
     *   const locale = this.context.getLocale();
     *   return this.generateLocalizedData(locale, rng);
     * }
     * ```
     */
    readonly context: GeneratorContext;

    /**
     * Generates data based on the provided configuration.
     *
     * This is the main method of the generator. It should produce
     * deterministic output when given the same configuration and
     * random seed through the context.
     *
     * @param config - Optional configuration to customize the output.
     *                If not provided, default configuration should be used.
     *
     * @returns The generated data of type TOutput.
     *
     * @throws {Error} If the provided configuration is invalid.
     * @throws {Error} If generation fails due to invalid state or dependencies.
     *
     * @example
     * ```typescript
     * // Generate with default config
     * const result1 = generator.generate();
     *
     * // Generate with custom config
     * const result2 = generator.generate({ length: 10, uppercase: true });
     *
     * // Type safety ensured by generics
     * const stringResult: string = stringGenerator.generate();
     * const personResult: Person = personGenerator.generate();
     * ```
     */
    generate(config?: TConfig): TOutput;

    /**
     * Returns the default configuration for this generator.
     *
     * Should provide sensible defaults that work for most use cases.
     * This configuration is merged with user-provided config in generate().
     *
     * @returns The default configuration object of type TConfig.
     *
     * @example
     * ```typescript
     * getDefaultConfig(): StringConfig {
     *   return {
     *     length: 10,
     *     charset: 'alphanumeric',
     *     uppercase: false,
     *     lowercase: false
     *   };
     * }
     * ```
     */
    getDefaultConfig(): TConfig;

    /**
     * Validates the provided configuration object.
     *
     * Should perform thorough validation of the configuration to ensure
     * it contains valid values and required properties. This method is
     * typically called before generate() to prevent runtime errors.
     *
     * @param config - The configuration object to validate.
     *
     * @returns True if the configuration is valid, false otherwise.
     *
     * @throws {Error} Optionally throw descriptive errors for invalid configurations
     *                instead of returning false. This provides better error messages
     *                to users but should be documented in the implementation.
     *
     * @example
     * ```typescript
     * validateConfig(config: NumberConfig): boolean {
     *   if (typeof config !== 'object' || config === null) {
     *     return false;
     *   }
     *
     *   if (config.min !== undefined && typeof config.min !== 'number') {
     *     return false;
     *   }
     *
     *   if (config.max !== undefined && typeof config.max !== 'number') {
     *     return false;
     *   }
     *
     *   if (config.min !== undefined && config.max !== undefined && config.min >= config.max) {
     *     return false;
     *   }
     *
     *   return true;
     * }
     * ```
     *
     * @example
     * ```typescript
     * // Alternative: Throw descriptive errors
     * validateConfig(config: NumberConfig): boolean {
     *   if (typeof config !== 'object' || config === null) {
     *     throw new Error('Config must be an object');
     *   }
     *
     *   if (config.min !== undefined && typeof config.min !== 'number') {
     *     throw new Error('Config.min must be a number');
     *   }
     *
     *   if (config.max !== undefined && typeof config.max !== 'number') {
     *     throw new Error('Config.max must be a number');
     *   }
     *
     *   if (config.min !== undefined && config.max !== undefined && config.min >= config.max) {
     *     throw new Error('Config.min must be less than config.max');
     *   }
     *
     *   return true;
     * }
     * ```
     */
    validateConfig(config: TConfig): boolean;
}

/**
 * Type guard to check if an object implements the IGenerator interface.
 *
 * Useful for runtime type checking and validation when working with
 * dynamic generator instances or plugin systems.
 *
 * @param obj - The object to check.
 *
 * @returns True if the object implements IGenerator interface.
 *
 * @example
 * ```typescript
 * function registerGenerator(generator: unknown) {
 *   if (!isGenerator(generator)) {
 *     throw new Error('Object does not implement IGenerator interface');
 *   }
 *
 *   // generator is now typed as IGenerator
 *   console.log(`Registering generator: ${generator.name}`);
 *   generators.set(generator.name, generator);
 * }
 * ```
 */
export function isGenerator(obj: any): obj is IGenerator {
    return (
        obj &&
        typeof obj === "object" &&
        typeof obj.name === "string" &&
        obj.context &&
        typeof obj.generate === "function" &&
        typeof obj.getDefaultConfig === "function" &&
        typeof obj.validateConfig === "function"
    );
}

/**
 * Utility type to extract the configuration type from a generator.
 *
 * @template T - A type that extends IGenerator
 *
 * @example
 * ```typescript
 * type NameConfig = GeneratorConfig<NameGenerator>;
 * type PersonConfig = GeneratorConfig<PersonGenerator>;
 * ```
 */
export type GeneratorConfig<T extends IGenerator> = T extends IGenerator<
    infer TConfig,
    any
>
    ? TConfig
    : never;

/**
 * Utility type to extract the output type from a generator.
 *
 * @template T - A type that extends IGenerator
 *
 * @example
 * ```typescript
 * type NameOutput = GeneratorOutput<NameGenerator>; // string
 * type PersonOutput = GeneratorOutput<PersonGenerator>; // Person
 * ```
 */
export type GeneratorOutput<T extends IGenerator> = T extends IGenerator<
    any,
    infer TOutput
>
    ? TOutput
    : never;
