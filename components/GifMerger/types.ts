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

export interface WatermarkInfo {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  layer: number; // 修改为数字层级，支持负数（下层）、0（GIF层）、正数（上层）
  
  // 新增的水印配置选项
  mode: 'direct' | 'fill' | 'repeat'; // 水印模式：直拼、填充、重复
  target: 'overall' | string[]; // 水印主体模式：整体或选择的GIF ID列表
}

// 更新MergeOptions接口以支持多个水印
export interface MergeOptions {
  backgroundColor: 'transparent' | 'white' | 'black';
  columns?: number; // 网格列数，不指定时自动计算
  frameDuration: number; // 合并后的帧持续时间（毫秒）
  watermarks?: WatermarkInfo[]; // 支持多个水印
  mergeMode?: 'grid' | 'sequence'; // 合并模式：网格平面合并或连续播放合并（可选，为了类型兼容性）
}
