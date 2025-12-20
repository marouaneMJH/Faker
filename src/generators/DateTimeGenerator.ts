import type { IGenerator } from '../types/IGenerator';
import type GeneratorContext from '../core/GeneratorContext';

export interface DateTimeConfig {
  format?: string;
  min?: Date;
  max?: Date;
}

export default class DateTimeGenerator implements IGenerator<DateTimeConfig, Date> {
  readonly name = 'dateTime';
  readonly context: GeneratorContext;

  constructor(context: GeneratorContext) {
    this.context = context;
  }

  generate(config?: DateTimeConfig): Date {
    const cfg = { ...this.getDefaultConfig(), ...config };
    const rng = this.context.getRng();
    
    const minTime = cfg.min!.getTime();
    const maxTime = cfg.max!.getTime();
    
    const randomTime = rng.int(minTime, maxTime);
    return new Date(randomTime);
  }

  getDefaultConfig(): DateTimeConfig {
    return { 
      min: new Date(2020, 0, 1), 
      max: new Date(2024, 11, 31) 
    };
  }

  validateConfig(config: DateTimeConfig): boolean {
    return typeof config === 'object' && config !== null;
  }
}