'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { GifObject, Watermark } from './types';

interface WatermarkCanvasProps {
  gif: GifObject | null;
  watermarks: Watermark[];
  selectedWatermarkId: string | null;
  onWatermarkUpdate: (id: string, updates: Partial<Watermark>) => void;
  onWatermarkSelect: (id: string | null) => void;
}

/**
 * 水印预览和编辑画布组件
 */
export function WatermarkCanvas({
  gif,
  watermarks,
  selectedWatermarkId,
  onWatermarkUpdate,
  onWatermarkSelect
}: WatermarkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const [resizeMode, setResizeMode] = useState<'none' | 'resize' | 'rotate'>('none');
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, rotation: 0 });
  const updateTimeoutRef = useRef<number | null>(null);

  // 预加载图片水印
  useEffect(() => {
    watermarks.forEach(w => {
      if (w.type === 'image' && !imageCache.current.has(w.url)) {
        const img = document.createElement('img');
        img.onload = () => {
          imageCache.current.set(w.url, img);
          renderCanvas();
        };
        img.src = w.url;
      }
    });
  }, [watermarks]);

  // 渲染画布内容
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !gif) return;

    // 设置画布尺寸
    canvas.width = gif.width;
    canvas.height = gif.height;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 渲染below层级的水印
    watermarks
      .filter(w => w.layer === 'below')
      .forEach(watermark => renderWatermark(ctx, watermark));

    // 渲染GIF首帧
    if (gif.frames[0]) {
      ctx.putImageData(gif.frames[0].imageData, 0, 0);
    }

    // 渲染above层级的水印
    watermarks
      .filter(w => w.layer === 'above')
      .forEach(watermark => renderWatermark(ctx, watermark));

    // 绘制选中水印的边框
    if (selectedWatermarkId) {
      const selectedWatermark = watermarks.find(w => w.id === selectedWatermarkId);
      if (selectedWatermark) {
        drawSelectionBorder(ctx, selectedWatermark);
      }
    }
  }, [gif, watermarks, selectedWatermarkId]);

  // 渲染单个水印
  const renderWatermark = (ctx: CanvasRenderingContext2D, watermark: Watermark) => {
    ctx.save();
    ctx.globalAlpha = watermark.opacity;

    if (watermark.type === 'image') {
      const img = imageCache.current.get(watermark.url);
      if (img && img.complete) {
        ctx.translate(watermark.position.x + watermark.width / 2, watermark.position.y + watermark.height / 2);
        ctx.rotate((watermark.rotation * Math.PI) / 180);
        ctx.drawImage(img, -watermark.width / 2, -watermark.height / 2, watermark.width, watermark.height);
      }
    } else {
      // 文字水印也使用中心点进行旋转
      ctx.font = `${watermark.fontStyle} ${watermark.fontWeight} ${watermark.fontSize}px ${watermark.fontFamily}`;
      const metrics = ctx.measureText(watermark.text);
      const textWidth = metrics.width;
      const textHeight = watermark.fontSize;
      
      ctx.translate(watermark.position.x + textWidth / 2, watermark.position.y + textHeight / 2);
      ctx.rotate((watermark.rotation * Math.PI) / 180);
      ctx.fillStyle = watermark.color;
      ctx.textBaseline = 'top';
      ctx.fillText(watermark.text, -textWidth / 2, -textHeight / 2);
    }

    ctx.restore();
  };

  // 绘制选中边框
  const drawSelectionBorder = (ctx: CanvasRenderingContext2D, watermark: Watermark) => {
    ctx.save();
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    let width, height, centerX, centerY;

    if (watermark.type === 'image') {
      width = watermark.width;
      height = watermark.height;
      centerX = watermark.position.x + watermark.width / 2;
      centerY = watermark.position.y + watermark.height / 2;
    } else {
      ctx.font = `${watermark.fontStyle} ${watermark.fontWeight} ${watermark.fontSize}px ${watermark.fontFamily}`;
      const metrics = ctx.measureText(watermark.text);
      width = metrics.width;
      height = watermark.fontSize;
      centerX = watermark.position.x + width / 2;
      centerY = watermark.position.y + height / 2;
    }

    ctx.translate(centerX, centerY);
    ctx.rotate((watermark.rotation * Math.PI) / 180);
    
    // 绘制边框
    ctx.strokeRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);

    // 绘制控制点
    ctx.fillStyle = '#3B82F6';
    ctx.setLineDash([]);
    const handleSize = 8;

    // 四个角的缩放控制点
    ctx.fillRect(-width / 2 - 5 - handleSize / 2, -height / 2 - 5 - handleSize / 2, handleSize, handleSize); // 左上
    ctx.fillRect(width / 2 + 5 - handleSize / 2, -height / 2 - 5 - handleSize / 2, handleSize, handleSize); // 右上
    ctx.fillRect(-width / 2 - 5 - handleSize / 2, height / 2 + 5 - handleSize / 2, handleSize, handleSize); // 左下
    ctx.fillRect(width / 2 + 5 - handleSize / 2, height / 2 + 5 - handleSize / 2, handleSize, handleSize); // 右下

    // 旋转控制点（顶部中间）
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(0, -height / 2 - 25, 6, 0, Math.PI * 2);
    ctx.fill();

    // 旋转控制点连线
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -height / 2 - 5);
    ctx.lineTo(0, -height / 2 - 19);
    ctx.stroke();

    ctx.restore();
  };

  // 处理鼠标按下
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvasScale;
    const y = (e.clientY - rect.top) / canvasScale;

    // 先检查是否点击了当前选中水印的控制点
    if (selectedWatermarkId) {
      const selectedWatermark = watermarks.find(w => w.id === selectedWatermarkId);
      if (selectedWatermark) {
        const handle = getHandleAtPoint(x, y, selectedWatermark);
        if (handle === 'rotate') {
          setResizeMode('rotate');
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          let width = 0, height = 0;
          if (selectedWatermark.type === 'image') {
            width = selectedWatermark.width;
            height = selectedWatermark.height;
          } else if (ctx) {
            ctx.font = `${selectedWatermark.fontStyle} ${selectedWatermark.fontWeight} ${selectedWatermark.fontSize}px ${selectedWatermark.fontFamily}`;
            const metrics = ctx.measureText(selectedWatermark.text);
            width = metrics.width;
            height = selectedWatermark.fontSize;
          }
          setResizeStart({ 
            x, 
            y, 
            width, 
            height,
            rotation: selectedWatermark.rotation
          });
          return;
        } else if (handle !== 'none') {
          setResizeMode('resize');
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          let width = 0, height = 0;
          if (selectedWatermark.type === 'image') {
            width = selectedWatermark.width;
            height = selectedWatermark.height;
          } else if (ctx) {
            ctx.font = `${selectedWatermark.fontStyle} ${selectedWatermark.fontWeight} ${selectedWatermark.fontSize}px ${selectedWatermark.fontFamily}`;
            const metrics = ctx.measureText(selectedWatermark.text);
            width = metrics.width;
            height = selectedWatermark.fontSize;
          }
          setResizeStart({ 
            x: selectedWatermark.position.x, 
            y: selectedWatermark.position.y, 
            width, 
            height,
            rotation: selectedWatermark.rotation
          });
          return;
        }
      }
    }

    // 检查是否点击了水印
    const clickedWatermark = watermarks.find(w => isPointInWatermark(x, y, w));
    
    if (clickedWatermark) {
      onWatermarkSelect(clickedWatermark.id);
      setIsDragging(true);
      setDragStart({ x: x - clickedWatermark.position.x, y: y - clickedWatermark.position.y });
    } else {
      onWatermarkSelect(null);
    }
  };

  // 处理鼠标移动（包括更新光标样式）
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvasScale;
    const y = (e.clientY - rect.top) / canvasScale;

    // 更新光标样式
    if (selectedWatermarkId) {
      const selectedWatermark = watermarks.find(w => w.id === selectedWatermarkId);
      if (selectedWatermark) {
        const handle = getHandleAtPoint(x, y, selectedWatermark);
        if (handle === 'rotate') {
          canvas.style.cursor = 'grab'; // 圆圈型表示旋转
        } else if (handle !== 'none') {
          canvas.style.cursor = 'nwse-resize'; // 拉伸型表示调整大小
        } else if (isPointInWatermark(x, y, selectedWatermark)) {
          canvas.style.cursor = 'move'; // 十字型表示移动
        } else {
          canvas.style.cursor = 'default';
        }
      }
    } else {
      // 检查是否悬停在任何水印上
      const hoverWatermark = watermarks.find(w => isPointInWatermark(x, y, w));
      canvas.style.cursor = hoverWatermark ? 'pointer' : 'default';
    }

    if (!selectedWatermarkId) return;

    const selectedWatermark = watermarks.find(w => w.id === selectedWatermarkId);
    if (!selectedWatermark) return;

    // 旋转模式
    if (resizeMode === 'rotate') {
      const centerX = selectedWatermark.position.x + resizeStart.width / 2;
      const centerY = selectedWatermark.position.y + resizeStart.height / 2;
      
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
      onWatermarkUpdate(selectedWatermarkId, {
        rotation: (angle + 360) % 360
      });
      return;
    }

    // 缩放模式
    if (resizeMode === 'resize') {
      // 计算初始中心点
      const initialCenterX = resizeStart.x + resizeStart.width / 2;
      const initialCenterY = resizeStart.y + resizeStart.height / 2;
      
      // 计算从中心点到鼠标的距离
      const currentDist = Math.sqrt(Math.pow(x - initialCenterX, 2) + Math.pow(y - initialCenterY, 2));
      
      // 计算初始对角线距离
      const initialDist = Math.sqrt(Math.pow(resizeStart.width / 2, 2) + Math.pow(resizeStart.height / 2, 2));
      
      // 计算缩放比例
      const scale = Math.max(0.1, currentDist / initialDist);
      
      if (selectedWatermark.type === 'image') {
        const newWidth = Math.max(20, Math.min(gif?.width || 1000, resizeStart.width * scale));
        const newHeight = Math.max(20, Math.min(gif?.height || 1000, resizeStart.height * scale));
        
        onWatermarkUpdate(selectedWatermarkId, {
          width: newWidth,
          height: newHeight,
          position: {
            x: initialCenterX - newWidth / 2,
            y: initialCenterY - newHeight / 2
          }
        });
      } else {
        // 文字水印通过调整字体大小来缩放
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;
        
        // 大幅降低文字水印的缩放敏感度（减慢速度）- 调整为0.08倍速度，提供更精细的控制
        const dampedScale = 1 + (scale - 1) * 0.08;
        // 移除Math.round()以减少延迟，保持平滑缩放
        const newFontSize = Math.max(12, selectedWatermark.fontSize * dampedScale);
        
        // 计算新的文字尺寸
        ctx.font = `${selectedWatermark.fontStyle} ${selectedWatermark.fontWeight} ${newFontSize}px ${selectedWatermark.fontFamily}`;
        const metrics = ctx.measureText(selectedWatermark.text);
        const newWidth = metrics.width;
        const newHeight = newFontSize;
        
        // 限制文字水印不超过GIF尺寸
        if (gif && (newWidth > gif.width || newHeight > gif.height)) {
          return;
        }
        
        // 使用 requestAnimationFrame 优化更新，减少延迟感
        if (updateTimeoutRef.current) {
          cancelAnimationFrame(updateTimeoutRef.current);
        }
        updateTimeoutRef.current = requestAnimationFrame(() => {
          onWatermarkUpdate(selectedWatermarkId, {
            fontSize: newFontSize,
            position: {
              x: initialCenterX - newWidth / 2,
              y: initialCenterY - newHeight / 2
            }
          });
        });
      }
      return;
    }

    // 拖动模式
    if (isDragging) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      let width = 0, height = 0;
      
      if (selectedWatermark.type === 'image') {
        width = selectedWatermark.width;
        height = selectedWatermark.height;
      } else if (ctx) {
        ctx.font = `${selectedWatermark.fontStyle} ${selectedWatermark.fontWeight} ${selectedWatermark.fontSize}px ${selectedWatermark.fontFamily}`;
        const metrics = ctx.measureText(selectedWatermark.text);
        width = metrics.width;
        height = selectedWatermark.fontSize;
      }
      
      onWatermarkUpdate(selectedWatermarkId, {
        position: {
          x: Math.max(0, Math.min((gif?.width || 0) - width, x - dragStart.x)),
          y: Math.max(0, Math.min((gif?.height || 0) - height, y - dragStart.y))
        }
      });
    }
  };

  // 处理鼠标释放
  const handleMouseUp = () => {
    setIsDragging(false);
    setResizeMode('none');
    // 清理待处理的动画帧
    if (updateTimeoutRef.current) {
      cancelAnimationFrame(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }
  };

  // 获取鼠标位置处的控制点
  const getHandleAtPoint = (x: number, y: number, watermark: Watermark): string => {
    let width, height, centerX, centerY;

    if (watermark.type === 'image') {
      width = watermark.width;
      height = watermark.height;
      centerX = watermark.position.x + watermark.width / 2;
      centerY = watermark.position.y + watermark.height / 2;
    } else {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return 'none';
      ctx.font = `${watermark.fontStyle} ${watermark.fontWeight} ${watermark.fontSize}px ${watermark.fontFamily}`;
      const metrics = ctx.measureText(watermark.text);
      width = metrics.width;
      height = watermark.fontSize;
      centerX = watermark.position.x + width / 2;
      centerY = watermark.position.y + height / 2;
    }

    // 转换为本地坐标（考虑旋转）
    const angle = (-watermark.rotation * Math.PI) / 180;
    const dx = x - centerX;
    const dy = y - centerY;
    const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const localY = dx * Math.sin(angle) + dy * Math.cos(angle);

    const handleSize = 12; // 增大点击区域
    const rotateRadius = 8; // 增大旋转点击区域

    // 检查旋转控制点
    const rotateY = -height / 2 - 25;
    const distToRotate = Math.sqrt(localX * localX + Math.pow(localY - rotateY, 2));
    if (distToRotate <= rotateRadius) {
      return 'rotate';
    }

    // 检查四个角的缩放控制点
    const corners = [
      { x: -width / 2 - 5, y: -height / 2 - 5, name: 'tl' },
      { x: width / 2 + 5, y: -height / 2 - 5, name: 'tr' },
      { x: -width / 2 - 5, y: height / 2 + 5, name: 'bl' },
      { x: width / 2 + 5, y: height / 2 + 5, name: 'br' }
    ];

    for (const corner of corners) {
      if (Math.abs(localX - corner.x) <= handleSize && Math.abs(localY - corner.y) <= handleSize) {
        return corner.name;
      }
    }

    return 'none';
  };

  // 判断点是否在水印内
  const isPointInWatermark = (x: number, y: number, watermark: Watermark): boolean => {
    let width, height, centerX, centerY;

    if (watermark.type === 'image') {
      width = watermark.width;
      height = watermark.height;
      centerX = watermark.position.x + watermark.width / 2;
      centerY = watermark.position.y + watermark.height / 2;
    } else {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return false;
      ctx.font = `${watermark.fontStyle} ${watermark.fontWeight} ${watermark.fontSize}px ${watermark.fontFamily}`;
      const metrics = ctx.measureText(watermark.text);
      width = metrics.width;
      height = watermark.fontSize;
      centerX = watermark.position.x + width / 2;
      centerY = watermark.position.y + height / 2;
    }

    // 转换为本地坐标（考虑旋转）
    const angle = (-watermark.rotation * Math.PI) / 180;
    const dx = x - centerX;
    const dy = y - centerY;
    const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const localY = dx * Math.sin(angle) + dy * Math.cos(angle);

    // 检查是否在矩形内
    return (
      Math.abs(localX) <= width / 2 &&
      Math.abs(localY) <= height / 2
    );
  };

  // 计算画布缩放比例
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !gif) return;
      const containerWidth = containerRef.current.clientWidth;
      const scale = Math.min(1, containerWidth / gif.width);
      setCanvasScale(scale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [gif]);

  // 重新渲染画布
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // 清理待处理的动画帧
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        cancelAnimationFrame(updateTimeoutRef.current);
      }
    };
  }, []);

  if (!gif) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-20 text-center border border-gray-200 dark:border-gray-700">
        <p className="text-lg text-gray-500 dark:text-gray-400">请先上传GIF文件</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="sticky top-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      style={{ alignSelf: 'flex-start' }}
    >
      <canvas
        ref={canvasRef}
        className="mx-auto border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
        style={{ width: `${gif.width * canvasScale}px`, height: `${gif.height * canvasScale}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
