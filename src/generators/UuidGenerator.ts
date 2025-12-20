import type { IGenerator } from "../types/IGenerator";
import type GeneratorContext from "../core/GeneratorContext";

export interface UuidConfig {
    version?: 4; // Only v4 for now
}

export default class UuidGenerator implements IGenerator<UuidConfig, string> {
    readonly name = "uuid";
    readonly context: GeneratorContext;

    constructor(context: GeneratorContext) {
        this.context = context;
    }

    generate(config?: UuidConfig): string {
        const rng = this.context.getRng();

        // Generate UUID v4
        const hex = "0123456789abcdef";
        let uuid = "";

        for (let i = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                uuid += "-";
            } else if (i === 14) {
                uuid += "4"; // Version 4
            } else if (i === 19) {
                uuid += hex[rng.int(8, 11)]; // 8, 9, a, or b
            } else {
                uuid += hex[rng.int(0, 15)];
            }
        }

        return uuid;
    }

    getDefaultConfig(): UuidConfig {
        return { version: 4 };
    }

    validateConfig(config: UuidConfig): boolean {
        return typeof config === "object" && config !== null;
    }
}
