import type { IGenerator } from '../types/IGenerator';
import type GeneratorContext from '../core/GeneratorContext';

export interface NumberConfig {
  min?: number;
  max?: number;
  precision?: number;
}

export default class NumberGenerator implements IGenerator<NumberConfig, number> {
  readonly name = 'number';
  readonly context: GeneratorContext;

  constructor(context: GeneratorContext) {
    this.context = context;
  }

  generate(config?: NumberConfig): number {
    const cfg = { ...this.getDefaultConfig(), ...config };
    const rng = this.context.getRng();
    
    return rng.float(cfg.min!, cfg.max!, cfg.precision);
  }

  getDefaultConfig(): NumberConfig {
    return { min: 0, max: 100 };
  }

  validateConfig(config: NumberConfig): boolean {
    if (typeof config !== 'object' || config === null) return false;
    if (config.min !== undefined && typeof config.min !== 'number') return false;
    if (config.max !== undefined && typeof config.max !== 'number') return false;
    return true;
  }
}