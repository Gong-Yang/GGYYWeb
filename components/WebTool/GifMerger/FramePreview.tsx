'use client';

import React, { useEffect, useRef } from 'react';
import type { GifFrame } from './types';

interface FramePreviewProps {
  frame: GifFrame;
  frameIndex: number;
  gifWidth: number;
  gifHeight: number;
}

export function FramePreview({ frame, frameIndex, gifWidth, gifHeight }: FramePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frame) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    canvas.width = gifWidth;
    canvas.height = gifHeight;

    try {
      // 直接绘制ImageData
      ctx.putImageData(frame.imageData, 0, 0);
    } catch (error) {
      console.error(`渲染帧${frameIndex}时出错:`, error);
      // 显示错误信息
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.font = '10px Arial';
      ctx.fillText(`帧${frameIndex}`, 2, 12);
      ctx.fillText('渲染错误', 2, 24);
    }
  }, [frame, frameIndex, gifWidth, gifHeight]);

  return (
    <div className="flex flex-col items-center gap-1">
      <canvas
        ref={canvasRef}
        className="w-full aspect-square border border-gray-200 dark:border-gray-700 rounded"
        style={{
          imageRendering: 'pixelated',
          backgroundColor: 'transparent'
        }}
      />
      <span className="text-[10px] text-gray-500 dark:text-gray-400">帧{frameIndex}</span>
      <span className="text-[10px] text-gray-400 dark:text-gray-500">{frame.delay}ms</span>
    </div>
  );
}