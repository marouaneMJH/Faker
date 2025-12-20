import GeneratorContext from "./core/GeneratorContext";
import GeneratorRegistry from "./core/GeneratorRegistry";
import type { Plugin, FakerConfig } from "./types/Plugin";

// Import all generator types
import NameGenerator from "./generators/NameGenerator";
import InternetGenerator from "./generators/InternetGenerator";
import NumberGenerator from "./generators/NumberGenerator";
import UuidGenerator from "./generators/UuidGenerator";
import PhoneGenerator from "./generators/PhoneGenerator";
import AddressGenerator from "./generators/AddressGenerator";
import CompanyGenerator from "./generators/CompanyGenerator";
import FinanceGenerator from "./generators/FinanceGenerator";
import DateTimeGenerator from "./generators/DateTimeGenerator";
import TextGenerator from "./generators/TextGenerator";
import MediaGenerator from "./generators/MediaGenerator";

/**
 * Main Faker class implementing the Facade pattern for simplified access to all generators.
 *
 * This class provides a unified interface to all faker generators while managing
 * the underlying complexity of generator registration, context management, and
 * lazy initialization. It follows SOLID principles through dependency injection
 * and separation of concerns.
 *
 * The Facade pattern simplifies the interface by:
 * - Hiding the complexity of generator registry and context management
 * - Providing a fluent API for configuration changes
 * - Lazy loading generators only when accessed
 * - Offering convenient access to all generator categories
 *
 * @example
 * ```typescript
 * // Basic usage with defaults
 * const faker = new Faker();
 * console.log(faker.name.generate()); // "John Smith"
 * console.log(faker.internet.email()); // "user@example.com"
 *
 * // With configuration
 * const faker = new Faker({ seed: 12345, locale: 'en' });
 * console.log(faker.name.generate({ prefix: true })); // "Dr. John Smith"
 * ```
 *
 * @example
 * ```typescript
 * // Method chaining
 * const faker = new Faker()
 *   .setSeed(12345)
 *   .setLocale('es')
 *   .use(customPlugin);
 *
 * console.log(faker.name.generate()); // Spanish name
 * ```
 *
 * @example
 * ```typescript
 * // Factory method
 * const faker1 = Faker.create({ seed: 12345 });
 * const faker2 = Faker.create({ locale: 'fr' });
 *
 * // Independent instances
 * console.log(faker1.number.generate() !== faker2.number.generate()); // true
 * ```
 *
 * @example
 * ```typescript
 * // Cloning for isolation
 * const original = new Faker({ seed: 12345 });
 * const clone = original.clone();
 *
 * clone.setSeed(54321);
 *
 * // Original is unchanged
 * console.log(original.context.getSeed()); // 12345
 * console.log(clone.context.getSeed()); // 54321
 * ```
 */
export default class Faker {
    /** The generator context managing seed, locale, and RNG. */
    private readonly context: GeneratorContext;

    /** The generator registry for managing all generators. */
    private readonly registry: GeneratorRegistry;

    /** Cache for lazy-loaded generators. */
    private readonly generatorCache = new Map<string, any>();

    /** List of installed plugins for cloning purposes. */
    private readonly installedPlugins: Plugin[] = [];

    /**
     * Creates a new Faker instance.
     *
     * @param config - Optional configuration for seed and locale.
     *
     * @example
     * ```typescript
     * // Default configuration
     * const faker1 = new Faker();
     *
     * // With seed for reproducible results
     * const faker2 = new Faker({ seed: 12345 });
     *
     * // With specific locale
     * const faker3 = new Faker({ locale: 'es' });
     *
     * // With both seed and locale
     * const faker4 = new Faker({ seed: 12345, locale: 'fr' });
     * ```
     */
    constructor(config: FakerConfig = {}) {
        this.context = new GeneratorContext(config);
        this.registry = GeneratorRegistry.getInstance();

        // Register default generators if not already registered
        this.registerDefaultGenerators();
    }

    /**
     * Name generator for creating fake names.
     *
     * Provides methods for generating various types of names including
     * first names, last names, full names with prefixes/suffixes.
     *
     * @example
     * ```typescript
     * console.log(faker.name.generate()); // "John Smith"
     * console.log(faker.name.generate({ prefix: true })); // "Dr. John Smith"
     * console.log(faker.name.generate({ firstName: true, lastName: false })); // "John"
     * ```
     */
    get name(): NameGenerator {
        return this.getOrCreateGenerator(
            "name",
            () => new NameGenerator(this.context)
        );
    }

    /**
     * Internet generator for creating internet-related data.
     *
     * Provides methods for generating emails, usernames, URLs, and other
     * internet-related fake data with customizable domains and formats.
     *
     * @example
     * ```typescript
     * console.log(faker.internet.email()); // "user123@gmail.com"
     * console.log(faker.internet.username()); // "user123abc"
     * console.log(faker.internet.email({ domain: 'company.com' })); // "user123@company.com"
     * ```
     */
    get internet(): InternetGenerator {
        return this.getOrCreateGenerator(
            "internet",
            () => new InternetGenerator(this.context)
        );
    }

    /**
     * Number generator for creating random numbers.
     *
     * Provides methods for generating integers, floats, and numbers
     * within specific ranges with configurable precision.
     *
     * @example
     * ```typescript
     * console.log(faker.number.generate()); // 42.15
     * console.log(faker.number.generate({ min: 1, max: 100, precision: 0 })); // 73
     * console.log(faker.number.generate({ min: 0, max: 1, precision: 3 })); // 0.847
     * ```
     */
    get number(): NumberGenerator {
        return this.getOrCreateGenerator(
            "number",
            () => new NumberGenerator(this.context)
        );
    }

    /**
     * UUID generator for creating unique identifiers.
     *
     * Provides methods for generating RFC 4122 compliant UUIDs
     * for use as unique identifiers in applications.
     *
     * @example
     * ```typescript
     * console.log(faker.uuid.generate()); // "f47ac10b-58cc-4372-a567-0e02b2c3d479"
     * console.log(faker.uuid.generate({ version: 4 })); // "550e8400-e29b-41d4-a716-446655440000"
     * ```
     */
    get uuid(): UuidGenerator {
        return this.getOrCreateGenerator(
            "uuid",
            () => new UuidGenerator(this.context)
        );
    }

    /**
     * Phone generator for creating fake phone numbers.
     *
     * Provides methods for generating phone numbers in various
     * formats and international standards.
     *
     * @example
     * ```typescript
     * console.log(faker.phone.generate()); // "(555) 123-4567"
     * console.log(faker.phone.generate({ format: 'XXX-XXX-XXXX' })); // "555-123-4567"
     * ```
     */
    get phone(): PhoneGenerator {
        return this.getOrCreateGenerator(
            "phone",
            () => new PhoneGenerator(this.context)
        );
    }

    /**
     * Address generator for creating fake addresses.
     *
     * Provides methods for generating street addresses, cities,
     * states, postal codes, and complete address strings.
     *
     * @example
     * ```typescript
     * console.log(faker.address.generate()); // "1234 Main St, New York, NY 10001"
     * console.log(faker.address.generate({ includeCountry: true })); // "1234 Main St, New York, NY 10001, USA"
     * ```
     */
    get address(): AddressGenerator {
        return this.getOrCreateGenerator(
            "address",
            () => new AddressGenerator(this.context)
        );
    }

    /**
     * Company generator for creating fake company data.
     *
     * Provides methods for generating company names, business
     * suffixes, and other corporate-related information.
     *
     * @example
     * ```typescript
     * console.log(faker.company.generate()); // "Tech Solutions Inc."
     * console.log(faker.company.generate({ includeSuffix: false })); // "Tech Solutions"
     * ```
     */
    get company(): CompanyGenerator {
        return this.getOrCreateGenerator(
            "company",
            () => new CompanyGenerator(this.context)
        );
    }

    /**
     * Finance generator for creating financial data.
     *
     * Provides methods for generating monetary amounts, account
     * numbers, transaction data, and other financial information.
     *
     * @example
     * ```typescript
     * console.log(faker.finance.generate()); // "$123.45"
     * console.log(faker.finance.generate({ currency: '€', min: 100, max: 1000 })); // "€567.89"
     * ```
     */
    get finance(): FinanceGenerator {
        return this.getOrCreateGenerator(
            "finance",
            () => new FinanceGenerator(this.context)
        );
    }

    /**
     * DateTime generator for creating fake dates and times.
     *
     * Provides methods for generating dates, times, timestamps,
     * and formatted date strings within specified ranges.
     *
     * @example
     * ```typescript
     * console.log(faker.dateTime.generate()); // 2023-05-15T14:30:00.000Z
     * console.log(faker.dateTime.generate({ min: new Date(2020, 0, 1) })); // Date between 2020-2024
     * ```
     */
    get dateTime(): DateTimeGenerator {
        return this.getOrCreateGenerator(
            "dateTime",
            () => new DateTimeGenerator(this.context)
        );
    }

    /**
     * Text generator for creating lorem ipsum and other text content.
     *
     * Provides methods for generating words, sentences, paragraphs,
     * and other text content for placeholder purposes.
     *
     * @example
     * ```typescript
     * console.log(faker.text.generate()); // "lorem ipsum dolor sit amet"
     * console.log(faker.text.generate({ length: 3, type: 'words' })); // "lorem ipsum dolor"
     * ```
     */
    get text(): TextGenerator {
        return this.getOrCreateGenerator(
            "text",
            () => new TextGenerator(this.context)
        );
    }

    /**
     * Media generator for creating fake media URLs and references.
     *
     * Provides methods for generating image URLs, video references,
     * and other media-related fake data for development and testing.
     *
     * @example
     * ```typescript
     * console.log(faker.media.generate()); // "https://picsum.photos/640/480"
     * console.log(faker.media.generate({ width: 800, height: 600 })); // "https://picsum.photos/800/600"
     * ```
     */
    get media(): MediaGenerator {
        return this.getOrCreateGenerator(
            "media",
            () => new MediaGenerator(this.context)
        );
    }

    /**
     * Updates the seed for random number generation and returns this instance for chaining.
     *
     * This method updates the seed in the context and recreates the random number
     * generator, ensuring all subsequent generations use the new seed for
     * deterministic results.
     *
     * @param seed - The new seed value to use.
     *
     * @returns This Faker instance for method chaining.
     *
     * @example
     * ```typescript
     * const faker = new Faker()
     *   .setSeed(12345)
     *   .setLocale('en');
     *
     * console.log(faker.name.generate()); // Deterministic result based on seed 12345
     *
     * faker.setSeed(54321);
     * console.log(faker.name.generate()); // Different deterministic result
     * ```
     */
    setSeed(seed: number): Faker {
        this.context.setSeed(seed);
        return this;
    }

    /**
     * Updates the locale and returns this instance for chaining.
     *
     * This method validates and sets the locale in the context, which affects
     * localized data generation for applicable generators.
     *
     * @param locale - The locale code to set (e.g., 'en', 'es', 'fr').
     *
     * @returns This Faker instance for method chaining.
     *
     * @throws {Error} If the locale is not supported.
     *
     * @example
     * ```typescript
     * const faker = new Faker()
     *   .setLocale('es')
     *   .setSeed(12345);
     *
     * console.log(faker.name.generate()); // Spanish name
     *
     * faker.setLocale('fr');
     * console.log(faker.name.generate()); // French name
     * ```
     */
    setLocale(locale: string): Faker {
        this.context.setLocale(locale);
        return this;
    }

    /**
     * Loads a plugin and returns this instance for chaining.
     *
     * Plugins can register additional generators or modify existing ones.
     * The plugin's install method is called with the generator registry,
     * allowing it to register its generators.
     *
     * @param plugin - The plugin to install.
     *
     * @returns This Faker instance for method chaining.
     *
     * @throws {Error} If plugin installation fails.
     *
     * @example
     * ```typescript
     * class CustomPlugin implements Plugin {
     *   readonly name = 'custom';
     *   readonly version = '1.0.0';
     *
     *   install(registry: GeneratorRegistry): void {
     *     registry.register(new CustomGenerator());
     *   }
     *
     *   uninstall(registry: GeneratorRegistry): void {
     *     registry.unregister('custom');
     *   }
     * }
     *
     * const faker = new Faker()
     *   .use(new CustomPlugin())
     *   .setSeed(12345);
     *
     * // Now custom generator is available
     * const customData = faker.registry.get('custom')?.generate();
     * ```
     */
    use(plugin: Plugin): Faker {
        try {
            plugin.install(this.registry);
            this.installedPlugins.push(plugin);
        } catch (error) {
            throw new Error(
                `Failed to install plugin '${plugin.name}': ${error}`
            );
        }
        return this;
    }

    /**
     * Creates an independent copy of this Faker instance with the same configuration.
     *
     * The clone will have the same seed, locale, and installed plugins as the original,
     * but will be completely independent - changes to one will not affect the other.
     *
     * @returns A new Faker instance with identical configuration.
     *
     * @example
     * ```typescript
     * const original = new Faker({ seed: 12345, locale: 'en' });
     * const clone = original.clone();
     *
     * // Both produce the same initial results
     * console.log(original.name.generate() === clone.name.generate()); // true
     *
     * // But are independent
     * clone.setSeed(54321);
     * console.log(original.context.getSeed()); // 12345 (unchanged)
     * console.log(clone.context.getSeed()); // 54321
     * ```
     */
    clone(): Faker {
        const cloned = new Faker({
            seed: this.context.getSeed(),
            locale: this.context.getLocale(),
        });

        // Install the same plugins
        for (const plugin of this.installedPlugins) {
            cloned.use(plugin);
        }

        return cloned;
    }

    /**
     * Factory method for creating Faker instances.
     *
     * Provides an alternative to the constructor for creating Faker instances,
     * useful for dependency injection or when a factory pattern is preferred.
     *
     * @param config - Optional configuration for seed and locale.
     *
     * @returns A new Faker instance.
     *
     * @example
     * ```typescript
     * // Equivalent to new Faker()
     * const faker1 = Faker.create();
     *
     * // Equivalent to new Faker({ seed: 12345 })
     * const faker2 = Faker.create({ seed: 12345 });
     *
     * // Factory pattern in dependency injection
     * class DataService {
     *   constructor(private fakerFactory: () => Faker) {}
     *
     *   generateTestData() {
     *     const faker = this.fakerFactory();
     *     return {
     *       name: faker.name.generate(),
     *       email: faker.internet.email()
     *     };
     *   }
     * }
     *
     * const service = new DataService(() => Faker.create({ seed: 12345 }));
     * ```
     */
    static create(config?: FakerConfig): Faker {
        return new Faker(config);
    }

    /**
     * Gets or creates a generator using lazy initialization.
     *
     * This method implements the lazy loading pattern, creating generators
     * only when they are first accessed. Subsequent accesses return the
     * cached instance.
     *
     * @template T - The generator type.
     * @param name - The name of the generator.
     * @param factory - Factory function to create the generator if not cached.
     *
     * @returns The generator instance.
     *
     * @private
     */
    private getOrCreateGenerator<T>(name: string, factory: () => T): T {
        if (!this.generatorCache.has(name)) {
            const generator = factory();
            this.generatorCache.set(name, generator);

            // Also register in the global registry if not already present
            if (!this.registry.has(name)) {
                this.registry.register(generator as any);
            }
        }

        return this.generatorCache.get(name) as T;
    }

    /**
     * Registers default generators if they haven't been registered yet.
     *
     * This method ensures that all built-in generators are available
     * in the registry without duplicating registrations.
     *
     * @private
     */
    private registerDefaultGenerators(): void {
        // Only register if not already present to avoid conflicts
        const defaultGenerators = [
            "name",
            "internet",
            "number",
            "uuid",
            "phone",
            "address",
            "company",
            "finance",
            "dateTime",
            "text",
            "media",
        ];

        // We don't pre-register generators here; they're registered lazily
        // when first accessed through the getter methods
    }
}
