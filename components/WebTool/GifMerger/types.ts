/**
 * GIF 单帧数据
 */
export interface GifFrame {
  /** 帧的图像数据（包含像素信息） */
  imageData: ImageData;
  /** 帧显示延迟时间（毫秒） */
  delay: number;
  /** 帧处置方法（0-3，决定如何处理上一帧）*/
  disposal: number;
}

/**
 * 解析后的 GIF 对象
 */
export interface GifObject {
  /** 唯一标识符 */
  id: string;
  /** 原始文件对象 */
  file: File;
  /** Blob URL（用于预览） */
  url: string;
  /** GIF 宽度（像素） */
  width: number;
  /** GIF 高度（像素） */
  height: number;
  /** 解析后的所有帧数据 */
  frames: GifFrame[];
  /** 总播放时间（毫秒） */
  totalDuration: number;
  /** 总帧数 */
  frameCount: number;
  /** 是否包含透明背景 */
  hasTransparency: boolean;
}

/**
 * GIF 合并配置选项
 */
export interface MergeOptions {
  /** 背景颜色：透明 | 白色 | 黑色 | 原图背景 */
  backgroundColor: 'transparent' | 'white' | 'black' | 'original';
  /** 网格列数（不指定时自动计算为接近正方形） */
  columns?: number;
  /** 合并后每帧的持续时间（毫秒） */
  frameDuration: number;
  /** 合并模式：grid-网格平面合并 | sequence-连续播放合并 */
  mergeMode?: 'grid' | 'sequence';
  /** 目标输出宽度（像素） */
  targetWidth?: number;
  /** 目标输出高度（像素） */
  targetHeight?: number;
  /** 是否锁定宽高比（调整尺寸时同步缩放） */
  lockAspectRatio: boolean;
  /** 图像缩放插值方式：nearest-临近（像素风）| bilinear-双线性（平滑） */
  interpolation: 'nearest' | 'bilinear';
}
