import type { IGenerator } from '../types/IGenerator';
import type GeneratorContext from '../core/GeneratorContext';

export interface PhoneConfig {
  format?: string;
}

export default class PhoneGenerator implements IGenerator<PhoneConfig, string> {
  readonly name = 'phone';
  readonly context: GeneratorContext;

  constructor(context: GeneratorContext) {
    this.context = context;
  }

  generate(config?: PhoneConfig): string {
    const cfg = { ...this.getDefaultConfig(), ...config };
    const rng = this.context.getRng();
    
    // Simple phone number generation
    const areaCode = rng.int(200, 999);
    const exchange = rng.int(200, 999);
    const number = rng.int(1000, 9999);
    
    return cfg.format!.replace(/X/g, () => rng.int(0, 9).toString())
                     .replace('AAA', areaCode.toString())
                     .replace('EEE', exchange.toString())
                     .replace('NNNN', number.toString());
  }

  getDefaultConfig(): PhoneConfig {
    return { format: '(AAA) EEE-NNNN' };
  }

  validateConfig(config: PhoneConfig): boolean {
    return typeof config === 'object' && config !== null;
  }
}