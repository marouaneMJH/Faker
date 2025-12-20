import type { IGenerator } from "./IGenerator";
import type GeneratorRegistry from "../core/GeneratorRegistry";

/**
 * Interface for faker plugins that can be loaded into the main Faker instance.
 *
 * Plugins allow extending faker with custom generators or modifying existing ones.
 * They follow the dependency injection pattern, receiving the registry to
 * register their generators.
 *
 * @example
 * ```typescript
 * class CustomGeneratorsPlugin implements Plugin {
 *   readonly name = 'custom-generators';
 *   readonly version = '1.0.0';
 *
 *   install(registry: GeneratorRegistry): void {
 *     registry.register(new CustomNameGenerator());
 *     registry.register(new CustomAddressGenerator());
 *   }
 *
 *   uninstall(registry: GeneratorRegistry): void {
 *     registry.unregister('customName');
 *     registry.unregister('customAddress');
 *   }
 * }
 * ```
 */
export interface Plugin {
    /** Unique name of the plugin. */
    readonly name: string;

    /** Version of the plugin. */
    readonly version: string;

    /**
     * Installs the plugin by registering its generators.
     *
     * @param registry - The generator registry to register generators with.
     *
     * @throws {Error} If plugin installation fails.
     */
    install(registry: GeneratorRegistry): void;

    /**
     * Uninstalls the plugin by removing its generators.
     *
     * @param registry - The generator registry to unregister generators from.
     */
    uninstall(registry: GeneratorRegistry): void;
}

/**
 * Configuration options for creating a Faker instance.
 */
export interface FakerConfig {
    /** The seed value for random number generation. */
    seed?: number;

    /** The locale code for localized data generation. */
    locale?: string;
}
