/**
 * 水印类型
 */
export type WatermarkType = 'image' | 'text';

/**
 * 水印位置
 */
export interface WatermarkPosition {
  /** X坐标（像素） */
  x: number;
  /** Y坐标（像素） */
  y: number;
}

/**
 * 图片水印
 */
export interface ImageWatermark {
  id: string;
  type: 'image';
  /** 原始文件 */
  file: File;
  /** 预览URL */
  url: string;
  /** 原始宽度 */
  originalWidth: number;
  /** 原始高度 */
  originalHeight: number;
  /** 当前宽度（缩放后） */
  width: number;
  /** 当前高度（缩放后） */
  height: number;
  /** 位置 */
  position: WatermarkPosition;
  /** 旋转角度（度） */
  rotation: number;
  /** 层级：above-在GIF之上，below-在GIF之下 */
  layer: 'above' | 'below';
  /** 不透明度 0-1 */
  opacity: number;
}

/**
 * 文字水印
 */
export interface TextWatermark {
  id: string;
  type: 'text';
  /** 文字内容 */
  text: string;
  /** 字体大小（像素） */
  fontSize: number;
  /** 字体颜色 */
  color: string;
  /** 字体样式 */
  fontFamily: string;
  /** 粗体 */
  fontWeight: 'normal' | 'bold';
  /** 斜体 */
  fontStyle: 'normal' | 'italic';
  /** 位置 */
  position: WatermarkPosition;
  /** 旋转角度（度） */
  rotation: number;
  /** 层级：above-在GIF之上，below-在GIF之下 */
  layer: 'above' | 'below';
  /** 不透明度 0-1 */
  opacity: number;
}

/**
 * 水印联合类型
 */
export type Watermark = ImageWatermark | TextWatermark;

/**
 * GIF 帧数据
 */
export interface GifFrame {
  imageData: ImageData;
  delay: number;
  disposal: number;
}

/**
 * GIF 对象
 */
export interface GifObject {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  frames: GifFrame[];
  totalDuration: number;
  frameCount: number;
  hasTransparency: boolean;
}

/**
 * 水印应用配置
 */
export interface WatermarkConfig {
  /** 是否应用到所有帧 */
  applyToAllFrames: boolean;
  /** 质量设置 1-10 */
  quality: number;
}
