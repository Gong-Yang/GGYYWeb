'use client';

import GIF from 'gif.js';
import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/general/Button/Button';

import type { GifObject, Watermark } from './types';

interface WatermarkExporterProps {
  gifObjects: GifObject[];
  watermarks: Watermark[];
  selectedGifIds: string[];
}

interface ProcessedGif {
  id: string;
  name: string;
  url: string;
  blob: Blob;
}

export function WatermarkExporter({ gifObjects, watermarks, selectedGifIds }: WatermarkExporterProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedGifs, setProcessedGifs] = useState<ProcessedGif[]>([]);
  const [selectedProcessedIds, setSelectedProcessedIds] = useState<string[]>([]);

   // 在组件接收props时就创建修改后的水印数组
  const processedWatermarks = useMemo(() => {
    return watermarks.map(w => {
      // 检查是否有黑色文字水印, 如果有，将纯黑色 #000000 微调为 #020202
      if (w.type === 'text' && w.color.toLowerCase() === '#000000') {
        return { ...w, color: '#020202' }; // 创建新对象并修改颜色
      }
      return { ...w };
    });
  }, [watermarks]);

  const applyWatermarksToGif = useCallback(async (gifObject: GifObject): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {

        // GIF配置：如果GIF有透明背景，使用特殊处理
        const gifConfig: any = {
          workers: 2,
          quality: 10,
          width: gifObject.width,
          height: gifObject.height,
          workerScript: '/gif.worker.js',
          transparent: gifObject.hasTransparency ? 'rgba(0,0,0,0)' : null  // 当GIF有透明背景时，才使用透明色
        };
        
        const gif = new GIF(gifConfig);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('无法创建Canvas上下文');

        canvas.width = gifObject.width;
        canvas.height = gifObject.height;

        // 预加载图片水印
        const imageWatermarkPromises = processedWatermarks
          .filter(w => w.type === 'image')
          .map(w => {
            const img = document.createElement('img');
            img.src = w.url;
            return new Promise((res) => {
              img.onload = () => res(img);
              img.onerror = () => res(null);
            });
          });

        Promise.all(imageWatermarkPromises).then(() => {
          gifObject.frames.forEach((frame) => {
            // 清空画布为透明背景
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 渲染below层级的水印
            processedWatermarks
              .filter(w => w.layer === 'below')
              .forEach(w => renderWatermarkToCanvas(ctx, w));

            // 渲染GIF帧
            ctx.putImageData(frame.imageData, 0, 0);

            // 渲染above层级的水印
            processedWatermarks
              .filter(w => w.layer === 'above')
              .forEach(w => renderWatermarkToCanvas(ctx, w));

            // 根据配置决定是否启用帧透明
            const frameOptions: any = { delay: frame.delay, copy: true };
            if (gifObject.hasTransparency) {
              frameOptions.transparent = true;
            }
            gif.addFrame(ctx, frameOptions);
          });

          gif.on('finished', (blob: Blob) => {
            resolve(blob);
          });

          gif.on('progress', (p: number) => {
            setProgress(p * 100);
          });

          gif.render();
        });
      } catch (error) {
        reject(error);
      }
    });
  }, [processedWatermarks]);

  const renderWatermarkToCanvas = (ctx: CanvasRenderingContext2D, watermark: Watermark) => {
    ctx.save();
    ctx.globalAlpha = watermark.opacity;

    if (watermark.type === 'image') {
      const img = document.createElement('img');
      img.src = watermark.url;

      ctx.translate(watermark.position.x + watermark.width / 2, watermark.position.y + watermark.height / 2);
      ctx.rotate((watermark.rotation * Math.PI) / 180);
      ctx.drawImage(img, -watermark.width / 2, -watermark.height / 2, watermark.width, watermark.height);
    } else {
      // 文字水印
      const metrics = ctx.measureText(watermark.text);
      const textWidth = metrics.width;
      const textHeight = watermark.fontSize;
      
      ctx.translate(watermark.position.x + textWidth / 2, watermark.position.y + textHeight / 2);
      ctx.rotate((watermark.rotation * Math.PI) / 180);
      ctx.font = `${watermark.fontStyle} ${watermark.fontWeight} ${watermark.fontSize}px ${watermark.fontFamily}`;
      ctx.fillStyle = watermark.color;
      ctx.textBaseline = 'top';
      ctx.fillText(watermark.text, -textWidth / 2, -textHeight / 2);
    }

    ctx.restore();
  };

  const handleExport = useCallback(async () => {
    if (processedWatermarks.length === 0) {
      alert('请先添加水印');
      return;
    }

    const gifsToProcess = selectedGifIds.length > 0
      ? gifObjects.filter(g => selectedGifIds.includes(g.id))
      : gifObjects;

    if (gifsToProcess.length === 0) {
      alert('请选择要导出的GIF');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessedGifs([]);
    setSelectedProcessedIds([]);

    try {
      const results: ProcessedGif[] = [];

      for (let i = 0; i < gifsToProcess.length; i++) {
        const gifObject = gifsToProcess[i];
        if (!gifObject) continue;

        setProgress(((i + 1) / gifsToProcess.length) * 100);
        console.log('正在处理GIF:',gifObject, gifObject.file.name);
        const blob = await applyWatermarksToGif(gifObject);
        const url = URL.createObjectURL(blob);

        results.push({
          id: gifObject.id,
          name: gifObject.file.name.replace(/\.gif$/i, '_watermarked.gif'),
          url,
          blob
        });
      }

      setProcessedGifs(results);
      setSelectedProcessedIds([]);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  }, [gifObjects, processedWatermarks, selectedGifIds, applyWatermarksToGif]);

  const toggleProcessedSelection = useCallback((id: string) => {
    setSelectedProcessedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const selectAllProcessed = useCallback(() => {
    setSelectedProcessedIds(processedGifs.map(g => g.id));
  }, [processedGifs]);

  const clearSelectedProcessed = useCallback(() => {
    setSelectedProcessedIds([]);
  }, []);

  const downloadGif = useCallback((gif: ProcessedGif) => {
    const a = document.createElement('a');
    a.href = gif.url;
    a.download = gif.name;
    a.click();
  }, []);

  const downloadSelected = useCallback(() => {
    const selected = processedGifs.filter(g => selectedProcessedIds.includes(g.id));
    selected.forEach(gif => {
      setTimeout(() => downloadGif(gif), 100);
    });
  }, [processedGifs, selectedProcessedIds, downloadGif]);

  const downloadAll = useCallback(() => {
    processedGifs.forEach(gif => {
      setTimeout(() => downloadGif(gif), 100);
    });
  }, [processedGifs, downloadGif]);

  return (
    <div className="space-y-8">
      {/* 导出按钮 */}
      <div>
        <Button
          intent="dark"
          size="lg"
          fullWidth
          onClick={handleExport}
          disabled={isProcessing || processedWatermarks.length === 0}
          style={{ transition: 'transform 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          className="shadow-lg"
        >
          {isProcessing ? '处理中...' : '批量添加水印'}
        </Button>
      </div>

      {/* 进度条 */}
      {isProcessing && (
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-base text-center font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* 导出结果 */}
      {processedGifs.length > 0 && (
        <div className="space-y-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              导出完成
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <Button size="sm" intent="light" onClick={selectAllProcessed}>
                全选
              </Button>
              <Button size="sm" intent="light" onClick={clearSelectedProcessed}>
                取消全选
              </Button>
              <Button size="sm" intent="dark" onClick={downloadSelected} disabled={selectedProcessedIds.length === 0}>
                下载所选
              </Button>
              <Button size="sm" intent="dark" onClick={downloadAll}>
                全部下载
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {processedGifs.map(gif => (
              <div
                key={gif.id}
                onClick={() => toggleProcessedSelection(gif.id)}
                className={`rounded-xl p-3 space-y-3 border-2 cursor-pointer transition-all hover:scale-105 ${
                  selectedProcessedIds.includes(gif.id)
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-xl'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg'
                }`}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={gif.url}
                    alt={gif.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate text-center font-medium" title={gif.name}>
                  {gif.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
