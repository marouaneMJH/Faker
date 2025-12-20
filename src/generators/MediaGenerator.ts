import type { IGenerator } from '../types/IGenerator';
import type GeneratorContext from '../core/GeneratorContext';

export interface MediaConfig {
  type?: 'image' | 'video' | 'audio';
  width?: number;
  height?: number;
}

export default class MediaGenerator implements IGenerator<MediaConfig, string> {
  readonly name = 'media';
  readonly context: GeneratorContext;

  constructor(context: GeneratorContext) {
    this.context = context;
  }

  generate(config?: MediaConfig): string {
    const cfg = { ...this.getDefaultConfig(), ...config };
    
    if (cfg.type === 'image') {
      return `https://picsum.photos/${cfg.width}/${cfg.height}`;
    }
    
    return 'https://example.com/media.mp4';
  }

  getDefaultConfig(): MediaConfig {
    return { type: 'image', width: 640, height: 480 };
  }

  validateConfig(config: MediaConfig): boolean {
    return typeof config === 'object' && config !== null;
  }
}