import type { IGenerator } from "../types/IGenerator";
import type GeneratorContext from "../core/GeneratorContext";

/**
 * Configuration for internet-related data generation.
 */
export interface InternetConfig {
    /** Domain name to use for email addresses. */
    domain?: string;
    /** Username length for generated usernames. */
    usernameLength?: number;
}

/**
 * Generator for creating internet-related fake data (emails, usernames, etc.).
 */
export default class InternetGenerator
    implements IGenerator<InternetConfig, string>
{
    readonly name = "internet";
    readonly context: GeneratorContext;

    constructor(context: GeneratorContext) {
        this.context = context;
    }

    generate(config?: InternetConfig): string {
        return this.email(config);
    }

    email(config?: InternetConfig): string {
        const cfg = { ...this.getDefaultConfig(), ...config };
        const rng = this.context.getRng();

        const username = this.username({ usernameLength: cfg.usernameLength });
        const domain =
            cfg.domain ||
            rng.pick(["gmail.com", "yahoo.com", "hotmail.com", "example.com"]);

        return `${username}@${domain}`;
    }

    username(config?: { usernameLength?: number }): string {
        const rng = this.context.getRng();
        const length = config?.usernameLength || 8;
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

        return Array.from({ length }, () => rng.pick(chars.split(""))).join("");
    }

    getDefaultConfig(): InternetConfig {
        return {
            usernameLength: 8,
        };
    }

    validateConfig(config: InternetConfig): boolean {
        if (typeof config !== "object" || config === null) return false;

        if (config.usernameLength !== undefined) {
            if (
                typeof config.usernameLength !== "number" ||
                config.usernameLength < 1
            ) {
                return false;
            }
        }

        return true;
    }
}
