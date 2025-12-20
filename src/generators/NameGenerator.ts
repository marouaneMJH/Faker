import type { IGenerator } from '../types/IGenerator';
import type GeneratorContext from '../core/GeneratorContext';

/**
 * Configuration for name generation.
 */
export interface NameConfig {
  /** Include first name in the result. */
  firstName?: boolean;
  /** Include last name in the result. */
  lastName?: boolean;
  /** Include name prefix (Mr., Ms., etc.). */
  prefix?: boolean;
  /** Include name suffix (Jr., Sr., etc.). */
  suffix?: boolean;
}

/**
 * Generator for creating fake names.
 */
export default class NameGenerator implements IGenerator<NameConfig, string> {
  readonly name = 'name';
  readonly context: GeneratorContext;

  constructor(context: GeneratorContext) {
    this.context = context;
  }

  generate(config?: NameConfig): string {
    const cfg = { ...this.getDefaultConfig(), ...config };
    const rng = this.context.getRng();
    
    const parts: string[] = [];
    
    if (cfg.prefix) {
      parts.push(rng.pick(['Mr.', 'Ms.', 'Dr.', 'Prof.']));
    }
    
    if (cfg.firstName) {
      parts.push(rng.pick(['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana']));
    }
    
    if (cfg.lastName) {
      parts.push(rng.pick(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia']));
    }
    
    if (cfg.suffix) {
      parts.push(rng.pick(['Jr.', 'Sr.', 'II', 'III']));
    }
    
    return parts.join(' ');
  }

  getDefaultConfig(): NameConfig {
    return {
      firstName: true,
      lastName: true,
      prefix: false,
      suffix: false
    };
  }

  validateConfig(config: NameConfig): boolean {
    return typeof config === 'object' && config !== null;
  }
}