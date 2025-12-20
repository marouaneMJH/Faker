import type { IGenerator } from '../types/IGenerator';
import type GeneratorContext from '../core/GeneratorContext';

export interface TextConfig {
  length?: number;
  type?: 'words' | 'sentences' | 'paragraphs';
}

export default class TextGenerator implements IGenerator<TextConfig, string> {
  readonly name = 'text';
  readonly context: GeneratorContext;

  constructor(context: GeneratorContext) {
    this.context = context;
  }

  generate(config?: TextConfig): string {
    const cfg = { ...this.getDefaultConfig(), ...config };
    const rng = this.context.getRng();
    
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
    
    if (cfg.type === 'words') {
      return Array.from({ length: cfg.length! }, () => rng.pick(words)).join(' ');
    }
    
    return rng.pick(words);
  }

  getDefaultConfig(): TextConfig {
    return { length: 5, type: 'words' };
  }

  validateConfig(config: TextConfig): boolean {
    return typeof config === 'object' && config !== null;
  }
}