export interface GifFrame {
  imageData: ImageData; // 帧图像数据
  delay: number; // 帧延迟（毫秒）
  disposal: number; // 处置方法
}

export interface GifObject {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  frames: GifFrame[]; // 解析后的帧数据
  totalDuration: number; // 总播放时间（毫秒）
  frameCount: number; // 总帧数
  hasTransparency: boolean; // 是否包含透明背景
}

export interface MergeOptions {
  backgroundColor: 'transparent' | 'white' | 'black' | 'original';
  columns?: number; // 网格列数，不指定时自动计算
  frameDuration: number; // 合并后的帧持续时间（毫秒）
  mergeMode?: 'grid' | 'sequence'; // 合并模式：网格平面合并或连续播放合并（可选，为了类型兼容性）
}
