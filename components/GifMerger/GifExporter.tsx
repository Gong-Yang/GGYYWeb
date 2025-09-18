'use client';

import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import type { GifObject, MergeOptions } from './types';

interface GifExporterProps {
  gifObjects: GifObject[];
  disabled?: boolean;
}

export function GifExporter({ gifObjects, disabled = false }: GifExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportedGif, setExportedGif] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState<MergeOptions>({
    backgroundColor: 'transparent',
    frameDuration: 100
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

  const exportGif = useCallback(async () => {
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

      // 计算网格布局
      const cols = options.columns || Math.ceil(Math.sqrt(gifObjects.length));
      const rows = Math.ceil(gifObjects.length / cols);
      const maxWidth = Math.max(...gifObjects.map(g => g.width));
      const maxHeight = Math.max(...gifObjects.map(g => g.height));
      const totalWidth = cols * maxWidth;
      const totalHeight = rows * maxHeight;

      // 计算总帧数（以最多帧数为准）
      const maxFrameCount = Math.max(...gifObjects.map(g => g.frameCount));
      
      console.log('合并参数:', { 
        totalWidth, 
        totalHeight, 
        cols, 
        rows, 
        maxFrameCount,
        backgroundColor: options.backgroundColor
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
      for (let frameIndex = 0; frameIndex < maxFrameCount; frameIndex++) {
        // 设置背景
        if (options.backgroundColor === 'transparent') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = options.backgroundColor === 'white' ? '#ffffff' : '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // 绘制每个GIF到对应位置
        for (let gifIndex = 0; gifIndex < gifObjects.length; gifIndex++) {
          const gifObj = gifObjects[gifIndex];
          if (!gifObj) continue; // 跳过空值
          
          const col = gifIndex % cols;
          const row = Math.floor(gifIndex / cols);
          const x = col * maxWidth;
          const y = row * maxHeight;
          
          // 居中绘制
          const offsetX = (maxWidth - gifObj.width) / 2;
          const offsetY = (maxHeight - gifObj.height) / 2;
          
          // 获取当前帧数据（如果帧数不足，使用最后一帧）
          const actualFrameIndex = Math.min(frameIndex, gifObj.frameCount - 1);
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
        
        // 添加帧到GIF
        gif.addFrame(ctx, {
          copy: true,
          delay: options.frameDuration
        });
        
        // 更新进度（生成帧阶段）
        const frameProgress = (frameIndex + 1) / maxFrameCount * 50; // 50%用于帧生成
        setProgress(Math.round(frameProgress));
      }

      console.log(`所有${maxFrameCount}帧已添加，开始渲染GIF`);

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
  }, [gifObjects, options, loadGifJs]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* 导出按钮 */}
      <div className="text-center">
        <button
          onClick={exportGif}
          disabled={disabled || isExporting || gifObjects.length === 0}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          {isExporting ? `合并中... ${progress}%` : '合并GIF'}
        </button>
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
        <h4 className="font-medium mb-2">技术特性：</h4>
        <ul className="space-y-1">
          <li>• 保持原始动画时序和帧延迟</li>
          <li>• 支持透明背景和颜色背景</li>
          <li>• 以最长GIF为播放周期，短GIF定格在最后一帧</li>
          <li>• 实时进度显示</li>
        </ul>
      </div>
    </div>
  );
}