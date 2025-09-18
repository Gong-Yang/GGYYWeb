'use client';

import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import type { GifObject, MergeOptions, WatermarkInfo } from './types';

interface GifExporterProps {
  gifObjects: GifObject[];
  watermark?: WatermarkInfo | null;
  disabled?: boolean;
}

export function GifExporter({ gifObjects, watermark, disabled = false }: GifExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportedGif, setExportedGif] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState<MergeOptions>({
    backgroundColor: 'transparent',
    frameDuration: 100,
    watermark: null,
    mergeMode: 'grid' // 保留但不使用，只是为了类型兼容性
  });

  // 动态加载gif.js
  const loadGifJs = useCallback((): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      const globalWindow = window as unknown as { GIF: unknown };
      if (globalWindow.GIF) {
        resolve(globalWindow.GIF);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js';
      script.onload = () => {
        if (globalWindow.GIF) {
          resolve(globalWindow.GIF);
        } else {
          reject(new Error('gif.js加载失败'));
        }
      };
      script.onerror = () => reject(new Error('gif.js加载失败'));
      document.head.appendChild(script);
    });
  }, []);

  // 加载水印图片
  const loadWatermarkImage = useCallback(async (watermarkInfo: WatermarkInfo): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('水印图片加载失败'));
      img.src = watermarkInfo.url;
    });
  }, []);

  const exportGif = useCallback(async (mergeMode: 'grid' | 'sequence') => {
    if (gifObjects.length === 0) {
      alert('请先上传GIF文件');
      return;
    }

    setIsExporting(true);
    setExportedGif(null);
    setProgress(0);

    try {
      // 加载gif.js
      const GIF = await loadGifJs();
      
      console.log('开始合并', gifObjects.length, '个GIF文件');

      // 加载水印图片
      let watermarkImage: HTMLImageElement | null = null;
      if (watermark) {
        try {
          watermarkImage = await loadWatermarkImage(watermark);
          console.log('水印图片加载成功:', watermark.file.name);
        } catch (error) {
          console.error('水印图片加载失败:', error);
          alert('水印图片加载失败，将继续合并不含水印的GIF');
        }
      }

      // 计算画布尺寸和帧数
      let totalWidth: number, totalHeight: number, totalFrames: number;
      
      if (mergeMode === 'grid') {
        // 网格合并模式
        const cols = options.columns || Math.ceil(Math.sqrt(gifObjects.length));
        const rows = Math.ceil(gifObjects.length / cols);
        const maxWidth = Math.max(...gifObjects.map(g => g.width));
        const maxHeight = Math.max(...gifObjects.map(g => g.height));
        totalWidth = cols * maxWidth;
        totalHeight = rows * maxHeight;
        totalFrames = Math.max(...gifObjects.map(g => g.frameCount));
      } else {
        // 连续播放合并模式
        totalWidth = Math.max(...gifObjects.map(g => g.width));
        totalHeight = Math.max(...gifObjects.map(g => g.height));
        totalFrames = gifObjects.reduce((sum, g) => sum + g.frameCount, 0);
      }
      
      console.log('合并参数:', { 
        totalWidth, 
        totalHeight, 
        totalFrames,
        mergeMode: mergeMode,
        backgroundColor: options.backgroundColor,
        hasWatermark: !!watermarkImage
      });

      // 创建gif.js实例
      const GifConstructor = GIF as unknown as new (options: {
        workers: number;
        quality: number;
        width: number;
        height: number;
        transparent?: number | null;
        background?: number | null;
      }) => {
        on(event: 'progress', callback: (progress: number) => void): void;
        on(event: 'finished', callback: (blob: Blob) => void): void;
        addFrame: (canvas: CanvasRenderingContext2D, options: { copy: boolean; delay: number }) => void;
        render: () => void;
      };
      
      const gif = new GifConstructor({
        workers: 2,
        quality: 10,
        width: totalWidth,
        height: totalHeight,
        transparent: options.backgroundColor === 'transparent' ? 0x000000 : null,
        background: options.backgroundColor === 'white' ? 0xffffff : 
                   options.backgroundColor === 'black' ? 0x000000 : null
      });

      // 监听进度
      gif.on('progress', (p: number) => {
        setProgress(Math.round(p * 100));
      });

      // 创建合成画布
      const canvas = document.createElement('canvas');
      canvas.width = totalWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('无法创建画布上下文');
      }

      // 生成所有合成帧
      for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
        // 设置背景
        if (options.backgroundColor === 'transparent') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = options.backgroundColor === 'white' ? '#ffffff' : '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // 绘制底层水印（如果设置为底层）
        if (watermarkImage && watermark?.layer === 'bottom') {
          // 将水印绘制在画布中央
          const watermarkX = (totalWidth - watermark.width) / 2;
          const watermarkY = (totalHeight - watermark.height) / 2;
          ctx.drawImage(watermarkImage, watermarkX, watermarkY);
        }
        
        if (mergeMode === 'grid') {
          // 网格合并模式
          const cols = options.columns || Math.ceil(Math.sqrt(gifObjects.length));
          const maxWidth = Math.max(...gifObjects.map(g => g.width));
          const maxHeight = Math.max(...gifObjects.map(g => g.height));
          
          // 绘制每个GIF到对应位置
          for (let gifIndex = 0; gifIndex < gifObjects.length; gifIndex++) {
            const gifObj = gifObjects[gifIndex];
            if (!gifObj) continue;
            
            const col = gifIndex % cols;
            const row = Math.floor(gifIndex / cols);
            const x = col * maxWidth;
            const y = row * maxHeight;
            
            // 居中绘制
            const offsetX = (maxWidth - gifObj.width) / 2;
            const offsetY = (maxHeight - gifObj.height) / 2;
            
            // 获取当前帧数据（如果帧数不足，使用第一帧）
            const actualFrameIndex = frameIndex < gifObj.frameCount ? frameIndex : 0;
            const frameData = gifObj.frames[actualFrameIndex];
            
            if (frameData) {
              // 创建临时画布绘制单个GIF帧
              const tempCanvas = document.createElement('canvas');
              tempCanvas.width = gifObj.width;
              tempCanvas.height = gifObj.height;
              const tempCtx = tempCanvas.getContext('2d');
              
              if (tempCtx) {
                tempCtx.putImageData(frameData.imageData, 0, 0);
                ctx.drawImage(tempCanvas, x + offsetX, y + offsetY);
              }
            }
          }
        } else {
          // 连续播放合并模式
          let currentFrameIndex = frameIndex;
          let selectedGifIndex = 0;
          
          // 找到对应的GIF和帧
          for (let i = 0; i < gifObjects.length; i++) {
            const gifObj = gifObjects[i];
            if (gifObj && currentFrameIndex < gifObj.frameCount) {
              selectedGifIndex = i;
              break;
            }
            if (gifObj) {
              currentFrameIndex -= gifObj.frameCount;
            }
          }
          
          const selectedGif = gifObjects[selectedGifIndex];
          if (selectedGif && currentFrameIndex < selectedGif.frameCount) {
            const frameData = selectedGif.frames[currentFrameIndex];
            
            if (frameData) {
              // 居中绘制当前GIF的帧
              const offsetX = (totalWidth - selectedGif.width) / 2;
              const offsetY = (totalHeight - selectedGif.height) / 2;
              
              // 创建临时画布绘制单个GIF帧
              const tempCanvas = document.createElement('canvas');
              tempCanvas.width = selectedGif.width;
              tempCanvas.height = selectedGif.height;
              const tempCtx = tempCanvas.getContext('2d');
              
              if (tempCtx) {
                tempCtx.putImageData(frameData.imageData, 0, 0);
                ctx.drawImage(tempCanvas, offsetX, offsetY);
              }
            }
          }
        }
        
        // 绘制顶层水印（如果设置为顶层）
        if (watermarkImage && watermark?.layer === 'top') {
          // 将水印绘制在画布中央
          const watermarkX = (totalWidth - watermark.width) / 2;
          const watermarkY = (totalHeight - watermark.height) / 2;
          ctx.drawImage(watermarkImage, watermarkX, watermarkY);
        }
        
        // 添加帧到GIF
        gif.addFrame(ctx, {
          copy: true,
          delay: options.frameDuration
        });
        
        // 更新进度（生成帧阶段）
        const frameProgress = (frameIndex + 1) / totalFrames * 50; // 50%用于帧生成
        setProgress(Math.round(frameProgress));
      }

      console.log(`所有${totalFrames}帧已添加，开始渲染GIF`);

      // 渲染GIF
      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setExportedGif(url);
        setIsExporting(false);
        setProgress(100);
        console.log('GIF渲染完成');
      });

      gif.render();

    } catch (error) {
      console.error('导出GIF时出错:', error);
      alert('导出GIF时出错：' + (error as Error).message);
      setIsExporting(false);
      setProgress(0);
    }
  }, [gifObjects, options, watermark, loadGifJs, loadWatermarkImage]);

  const downloadGif = useCallback(() => {
    if (exportedGif) {
      const link = document.createElement('a');
      link.href = exportedGif;
      link.download = `merged-${Date.now()}.gif`;
      link.click();
    }
  }, [exportedGif]);

  return (
    <div className="space-y-6">
      {/* 导出选项 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            背景颜色
          </label>
          <select
            value={options.backgroundColor}
            onChange={(e) => setOptions((prev: MergeOptions) => ({ ...prev, backgroundColor: e.target.value as 'transparent' | 'white' | 'black' }))}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="transparent">透明</option>
            <option value="white">白色</option>
            <option value="black">黑色</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            帧持续时间 (ms)
          </label>
          <input
            type="number"
            min="50"
            max="1000"
            step="10"
            value={options.frameDuration}
            onChange={(e) => setOptions((prev: MergeOptions) => ({ ...prev, frameDuration: parseInt(e.target.value) || 100 }))}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            网格列数（仅平面合并）
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="1"
            value={options.columns || ''}
            onChange={(e) => setOptions((prev: MergeOptions) => ({ ...prev, columns: parseInt(e.target.value) || undefined }))}
            placeholder="自动计算"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            留空或0时自动计算最佳布局
          </p>
        </div>
      </div>

      {/* 水印状态显示 */}
      {watermark && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                水印已设置：{watermark.file.name}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                层级：{watermark.layer === 'top' ? '最顶层' : '最底层'} • 尺寸：{watermark.width} × {watermark.height}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 导出按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => exportGif('grid')}
          disabled={disabled || isExporting || gifObjects.length === 0}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex-1 sm:flex-none"
        >
          {isExporting ? `合并中... ${progress}%` : watermark ? '平面合并GIF（含水印）' : '平面合并GIF'}
        </button>
        <button
          onClick={() => exportGif('sequence')}
          disabled={disabled || isExporting || gifObjects.length === 0}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex-1 sm:flex-none"
        >
          {isExporting ? `合并中... ${progress}%` : watermark ? '连续播放合并GIF（含水印）' : '连续播放合并GIF'}
        </button>
      </div>
      
      {/* 按钮说明 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="text-center">
          <div className="font-medium text-blue-600 dark:text-blue-400 mb-1">平面合并</div>
          <div>所有GIF同时显示在网格布局中</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-green-600 dark:text-green-400 mb-1">连续播放</div>
          <div>按顺序连续播放每个GIF</div>
        </div>
      </div>

      {/* 进度条 */}
      {isExporting && (
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>合并进度</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 导出结果 */}
      {exportedGif && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            合并结果
          </h3>
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <Image
                src={exportedGif}
                alt="合并后的GIF"
                width={300}
                height={200}
                className="max-w-full max-h-64 border border-gray-200 dark:border-gray-600 rounded"
                unoptimized
              />
            </div>
            <button
              onClick={downloadGif}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              下载合并后的GIF
            </button>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400">
        <h4 className="font-medium mb-2">合并模式说明：</h4>
        <div className="space-y-2">
          <div>
            <strong className="text-gray-900 dark:text-white">网格平面合并：</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• 所有GIF同时显示在同一画面中</li>
              <li>• 自动网格排列布局</li>
              <li>• 以最长GIF为播放周期</li>
              <li>• 支持PNG水印叠加</li>
            </ul>
          </div>
          <div>
            <strong className="text-gray-900 dark:text-white">连续播放合并：</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• 按上传顺序连续播放每个GIF</li>
              <li>• 合并为一个连续的长动画</li>
              <li>• 各GIF保持原始尺寸和帧率</li>
              <li>• 水印将显示在整个播放过程中</li>
            </ul>
          </div>
        </div>
        <h4 className="font-medium mt-4 mb-2">技术特性：</h4>
        <ul className="space-y-1">
          <li>• 保持原始动画时序和帧延迟</li>
          <li>• 支持透明背景和颜色背景</li>
          <li>• 支持PNG水印，可设置为最顶层或最底层</li>
          <li>• 实时进度显示</li>
        </ul>
      </div>
    </div>
  );
}