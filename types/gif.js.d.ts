declare module 'gif.js' {
  interface GifOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    transparent?: number | null;
    background?: number | null;
    // Path to gif.worker.js script, required when bundlers isolate assets
    workerScript?: string;
    repeat?: number;
    dispose?: number;
  }

  interface FrameOptions {
    copy?: boolean;
    delay?: number;
    dispose?: number;
  }

  class GIF {
    constructor(options: GifOptions);
    
    on(event: 'progress', callback: (progress: number) => void): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    on(event: string, callback: (data: any) => void): void;
    
    addFrame(
      element: HTMLCanvasElement | CanvasRenderingContext2D | ImageData,
      options?: FrameOptions
    ): void;
    
    render(): void;
    
    abort(): void;
  }

  export = GIF;
}