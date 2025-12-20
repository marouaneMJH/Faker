import type { IGenerator } from '../types/IGenerator';
import type GeneratorContext from '../core/GeneratorContext';

export interface CompanyConfig {
  includeSuffix?: boolean;
}

export default class CompanyGenerator implements IGenerator<CompanyConfig, string> {
  readonly name = 'company';
  readonly context: GeneratorContext;

  constructor(context: GeneratorContext) {
    this.context = context;
  }

  generate(config?: CompanyConfig): string {
    const cfg = { ...this.getDefaultConfig(), ...config };
    const rng = this.context.getRng();
    
    const prefix = rng.pick(['Global', 'Tech', 'Advanced', 'Dynamic', 'Future']);
    const middle = rng.pick(['Solutions', 'Systems', 'Technologies', 'Innovations', 'Enterprises']);
    const suffix = cfg.includeSuffix ? rng.pick(['Inc.', 'LLC', 'Corp.', 'Ltd.']) : '';
    
    return [prefix, middle, suffix].filter(Boolean).join(' ');
  }

  getDefaultConfig(): CompanyConfig {
    return { includeSuffix: true };
  }

  validateConfig(config: CompanyConfig): boolean {
    return typeof config === 'object' && config !== null;
  }
}