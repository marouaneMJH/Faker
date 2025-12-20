import type { IGenerator } from "../types/IGenerator";

/**
 * Custom error thrown when attempting to register a generator with a duplicate name.
 */
export class DuplicateGeneratorError extends Error {
    /**
     * @param generatorName - The name of the generator that caused the conflict.
     */
    constructor(generatorName: string) {
        super(`Generator with name '${generatorName}' is already registered`);
        this.name = "DuplicateGeneratorError";
    }
}

/**
 * Custom error thrown when attempting to access a generator that doesn't exist.
 */
export class GeneratorNotFoundError extends Error {
    /**
     * @param generatorName - The name of the generator that was not found.
     */
    constructor(generatorName: string) {
        super(`Generator with name '${generatorName}' is not registered`);
        this.name = "GeneratorNotFoundError";
    }
}

/**
 * A thread-safe registry for managing faker generators using the Singleton pattern.
 *
 * This class provides a centralized registry for all generators in the faker library,
 * ensuring that generators can be registered once and accessed from anywhere in the
 * application. The singleton pattern ensures there's only one registry instance,
 * while the Map-based storage provides efficient lookup operations.
 *
 * Thread safety is ensured through synchronous operations and immutable return values.
 *
 * @example
 * ```typescript
 * // Get the singleton instance
 * const registry = GeneratorRegistry.getInstance();
 *
 * // Register generators
 * const nameGenerator = new NameGenerator(context);
 * const emailGenerator = new EmailGenerator(context);
 *
 * registry.register(nameGenerator);
 * registry.register(emailGenerator);
 *
 * // Retrieve and use generators
 * const name = registry.get('name');
 * if (name) {
 *   console.log(name.generate()); // "John Doe"
 * }
 *
 * // List all registered generators
 * console.log(registry.list()); // ['name', 'email']
 *
 * // Check if generator exists
 * if (registry.has('email')) {
 *   const email = registry.get('email')!;
 *   console.log(email.generate()); // "john@example.com"
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Error handling
 * try {
 *   registry.register(duplicateGenerator); // Same name as existing
 * } catch (error) {
 *   if (error instanceof DuplicateGeneratorError) {
 *     console.log('Generator already exists:', error.message);
 *   }
 * }
 *
 * // Safe retrieval
 * const generator = registry.get('nonexistent');
 * if (!generator) {
 *   console.log('Generator not found');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Testing scenario
 * describe('GeneratorRegistry', () => {
 *   beforeEach(() => {
 *     const registry = GeneratorRegistry.getInstance();
 *     registry.clear(); // Clean state for each test
 *   });
 *
 *   it('should register and retrieve generators', () => {
 *     const registry = GeneratorRegistry.getInstance();
 *     const generator = new TestGenerator(context);
 *
 *     registry.register(generator);
 *     expect(registry.has('test')).toBe(true);
 *     expect(registry.get('test')).toBe(generator);
 *   });
 * });
 * ```
 */
export default class GeneratorRegistry {
    /** The singleton instance of the registry. */
    private static instance: GeneratorRegistry | null = null;

    /** Thread-safe lock for singleton initialization. */
    private static readonly initializationLock = {};

    /** Internal storage for registered generators. */
    private readonly generators: Map<string, IGenerator<any, any>>;

    /**
     * Private constructor to enforce singleton pattern.
     * Use getInstance() to get the singleton instance.
     */
    private constructor() {
        this.generators = new Map<string, IGenerator<any, any>>();
    }

    /**
     * Gets the singleton instance of the GeneratorRegistry.
     *
     * This method ensures thread-safe initialization of the singleton instance.
     * Multiple concurrent calls will return the same instance.
     *
     * @returns The singleton GeneratorRegistry instance.
     *
     * @example
     * ```typescript
     * const registry1 = GeneratorRegistry.getInstance();
     * const registry2 = GeneratorRegistry.getInstance();
     *
     * console.log(registry1 === registry2); // true - same instance
     * ```
     */
    static getInstance(): GeneratorRegistry {
        if (GeneratorRegistry.instance === null) {
            // Thread-safe singleton initialization
            synchronized: {
                if (GeneratorRegistry.instance === null) {
                    GeneratorRegistry.instance = new GeneratorRegistry();
                }
            }
        }
        return GeneratorRegistry.instance;
    }

    /**
     * Registers a new generator in the registry.
     *
     * Each generator must have a unique name. Attempting to register a generator
     * with a name that already exists will throw a DuplicateGeneratorError.
     *
     * @template T - The specific generator type extending IGenerator.
     * @param generator - The generator instance to register.
     *
     * @throws {DuplicateGeneratorError} If a generator with the same name is already registered.
     * @throws {Error} If the generator is null, undefined, or invalid.
     *
     * @example
     * ```typescript
     * const registry = GeneratorRegistry.getInstance();
     * const nameGenerator = new NameGenerator(context);
     *
     * registry.register(nameGenerator);
     * console.log(registry.has('name')); // true
     * ```
     *
     * @example
     * ```typescript
     * // Error handling
     * try {
     *   registry.register(nameGenerator);
     *   registry.register(anotherNameGenerator); // Same name
     * } catch (error) {
     *   if (error instanceof DuplicateGeneratorError) {
     *     console.log('Cannot register duplicate generator');
     *   }
     * }
     * ```
     */
    register<T extends IGenerator<any, any>>(generator: T): void {
        if (!generator) {
            throw new Error("Generator cannot be null or undefined");
        }

        if (!generator.name || typeof generator.name !== "string") {
            throw new Error("Generator must have a valid string name");
        }

        if (this.generators.has(generator.name)) {
            throw new DuplicateGeneratorError(generator.name);
        }

        this.generators.set(generator.name, generator);
    }

    /**
     * Unregisters a generator from the registry.
     *
     * Removes the generator with the specified name from the registry.
     * Returns true if the generator was found and removed, false otherwise.
     *
     * @param name - The name of the generator to unregister.
     *
     * @returns True if the generator was successfully removed, false if not found.
     *
     * @example
     * ```typescript
     * const registry = GeneratorRegistry.getInstance();
     *
     * registry.register(nameGenerator);
     * console.log(registry.has('name')); // true
     *
     * const removed = registry.unregister('name');
     * console.log(removed); // true
     * console.log(registry.has('name')); // false
     *
     * const removedAgain = registry.unregister('name');
     * console.log(removedAgain); // false - already removed
     * ```
     */
    unregister(name: string): boolean {
        if (!name || typeof name !== "string") {
            return false;
        }

        return this.generators.delete(name);
    }

    /**
     * Retrieves a generator by name.
     *
     * Returns the generator instance if found, or undefined if no generator
     * with the specified name is registered.
     *
     * @template T - The expected generator type extending IGenerator.
     * @param name - The name of the generator to retrieve.
     *
     * @returns The generator instance if found, undefined otherwise.
     *
     * @example
     * ```typescript
     * const registry = GeneratorRegistry.getInstance();
     *
     * // Type-safe retrieval
     * const nameGenerator = registry.get<NameGenerator>('name');
     * if (nameGenerator) {
     *   const name = nameGenerator.generate(); // TypeScript knows this returns string
     * }
     * ```
     *
     * @example
     * ```typescript
     * // Safe retrieval pattern
     * const generator = registry.get('email');
     * if (generator) {
     *   const email = generator.generate();
     *   console.log('Generated email:', email);
     * } else {
     *   console.log('Email generator not found');
     * }
     * ```
     */
    get<T extends IGenerator<any, any>>(name: string): T | undefined {
        if (!name || typeof name !== "string") {
            return undefined;
        }

        return this.generators.get(name) as T | undefined;
    }

    /**
     * Checks if a generator with the specified name is registered.
     *
     * @param name - The name of the generator to check.
     *
     * @returns True if the generator exists, false otherwise.
     *
     * @example
     * ```typescript
     * const registry = GeneratorRegistry.getInstance();
     *
     * if (registry.has('name')) {
     *   const generator = registry.get('name')!; // Safe to use ! operator
     *   console.log(generator.generate());
     * }
     * ```
     *
     * @example
     * ```typescript
     * // Conditional registration
     * if (!registry.has('email')) {
     *   registry.register(new EmailGenerator(context));
     * }
     * ```
     */
    has(name: string): boolean {
        if (!name || typeof name !== "string") {
            return false;
        }

        return this.generators.has(name);
    }

    /**
     * Returns an array of all registered generator names.
     *
     * The returned array is a snapshot of the current state and is safe to modify
     * without affecting the registry. The names are returned in insertion order.
     *
     * @returns An array of generator names sorted alphabetically.
     *
     * @example
     * ```typescript
     * const registry = GeneratorRegistry.getInstance();
     *
     * registry.register(nameGenerator);
     * registry.register(emailGenerator);
     * registry.register(addressGenerator);
     *
     * console.log(registry.list()); // ['address', 'email', 'name'] - sorted alphabetically
     * ```
     *
     * @example
     * ```typescript
     * // Iterate over all generators
     * const generatorNames = registry.list();
     * for (const name of generatorNames) {
     *   const generator = registry.get(name)!;
     *   console.log(`${name}: ${generator.generate()}`);
     * }
     * ```
     */
    list(): string[] {
        return Array.from(this.generators.keys()).sort();
    }

    /**
     * Removes all registered generators from the registry.
     *
     * This method is particularly useful for testing scenarios where you need
     * a clean registry state between tests. In production, use this method
     * with caution as it will remove all registered generators.
     *
     * @example
     * ```typescript
     * // Testing scenario
     * describe('Generator tests', () => {
     *   let registry: GeneratorRegistry;
     *
     *   beforeEach(() => {
     *     registry = GeneratorRegistry.getInstance();
     *     registry.clear(); // Start with clean state
     *   });
     *
     *   it('should register generators', () => {
     *     expect(registry.list()).toHaveLength(0);
     *     registry.register(testGenerator);
     *     expect(registry.list()).toHaveLength(1);
     *   });
     * });
     * ```
     *
     * @example
     * ```typescript
     * // Runtime cleanup
     * const registry = GeneratorRegistry.getInstance();
     *
     * console.log(registry.list().length); // 5
     * registry.clear();
     * console.log(registry.list().length); // 0
     * ```
     */
    clear(): void {
        this.generators.clear();
    }

    /**
     * Gets the current number of registered generators.
     *
     * @returns The number of generators currently registered.
     *
     * @example
     * ```typescript
     * const registry = GeneratorRegistry.getInstance();
     *
     * console.log(registry.size()); // 0
     *
     * registry.register(nameGenerator);
     * registry.register(emailGenerator);
     *
     * console.log(registry.size()); // 2
     * ```
     */
    size(): number {
        return this.generators.size;
    }

    /**
     * Creates a snapshot of the current registry state.
     *
     * Returns a read-only map of all registered generators. This is useful
     * for debugging, logging, or creating backups of the registry state.
     *
     * @returns A read-only map of generator names to generator instances.
     *
     * @example
     * ```typescript
     * const registry = GeneratorRegistry.getInstance();
     * const snapshot = registry.snapshot();
     *
     * // Safe to iterate without affecting registry
     * for (const [name, generator] of snapshot) {
     *   console.log(`${name}: ${generator.constructor.name}`);
     * }
     * ```
     */
    snapshot(): ReadonlyMap<string, IGenerator<any, any>> {
        return new Map(this.generators);
    }

    /**
     * Resets the singleton instance (for testing purposes only).
     *
     * WARNING: This method should only be used in test environments.
     * It completely destroys the singleton instance, which may cause
     * issues if other parts of the application are holding references.
     *
     * @internal
     */
    static resetInstance(): void {
        GeneratorRegistry.instance = null;
    }
}
