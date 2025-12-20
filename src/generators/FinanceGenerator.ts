import type { IGenerator } from "../types/IGenerator";
import type GeneratorContext from "../core/GeneratorContext";

export interface FinanceConfig {
    currency?: string;
    min?: number;
    max?: number;
}

export default class FinanceGenerator
    implements IGenerator<FinanceConfig, string>
{
    readonly name = "finance";
    readonly context: GeneratorContext;

    constructor(context: GeneratorContext) {
        this.context = context;
    }

    generate(config?: FinanceConfig): string {
        const cfg = { ...this.getDefaultConfig(), ...config };
        const rng = this.context.getRng();

        const amount = rng.float(cfg.min!, cfg.max!, 2);
        return `${cfg.currency}${amount.toFixed(2)}`;
    }

    getDefaultConfig(): FinanceConfig {
        return { currency: "$", min: 10, max: 1000 };
    }

    validateConfig(config: FinanceConfig): boolean {
        return typeof config === "object" && config !== null;
    }
}
