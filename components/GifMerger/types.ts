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
}

export interface MergeOptions {
  backgroundColor: 'transparent' | 'white' | 'black';
  columns?: number; // 网格列数，不指定时自动计算
  frameDuration: number; // 合并后的帧持续时间（毫秒）
}