'use client';

import React, { useEffect, useRef } from 'react';
import type { GifFrame } from './types';

interface FramePreviewProps {
  /** 要预览的帧数据 */
  frame: GifFrame;
  /** 帧索引号 */
  frameIndex: number;
  /** GIF 原始宽度 */
  gifWidth: number;
  /** GIF 原始高度 */
  gifHeight: number;
}

/**
 * GIF 帧预览组件
 * 用于调试模式下显示单个帧的详细信息
 */
export function FramePreview({ frame, frameIndex, gifWidth, gifHeight }: FramePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 渲染帧到 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frame) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = gifWidth;
    canvas.height = gifHeight;

    try {
      ctx.putImageData(frame.imageData, 0, 0);
    } catch (error) {
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
      <span className="text-[10px] text-gray-400 dark:text-gray-500">disposal: {frame.disposal}</span>
    </div>
  );
}