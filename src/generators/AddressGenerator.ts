import type { IGenerator } from '../types/IGenerator';
import type GeneratorContext from '../core/GeneratorContext';

export interface AddressConfig {
  includeCountry?: boolean;
}

export default class AddressGenerator implements IGenerator<AddressConfig, string> {
  readonly name = 'address';
  readonly context: GeneratorContext;

  constructor(context: GeneratorContext) {
    this.context = context;
  }

  generate(config?: AddressConfig): string {
    const cfg = { ...this.getDefaultConfig(), ...config };
    const rng = this.context.getRng();
    
    const street = `${rng.int(1, 9999)} ${rng.pick(['Main', 'Oak', 'Pine', 'Elm'])} ${rng.pick(['St', 'Ave', 'Blvd'])}`;
    const city = rng.pick(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']);
    const state = rng.pick(['NY', 'CA', 'IL', 'TX', 'AZ']);
    const zip = rng.int(10000, 99999);
    
    let address = `${street}, ${city}, ${state} ${zip}`;
    
    if (cfg.includeCountry) {
      address += ', USA';
    }
    
    return address;
  }

  getDefaultConfig(): AddressConfig {
    return { includeCountry: false };
  }

  validateConfig(config: AddressConfig): boolean {
    return typeof config === 'object' && config !== null;
  }
}