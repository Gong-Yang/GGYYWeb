'use client';

import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';

export interface WatermarkInfo {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  layer: 'top' | 'bottom'; // 最顶层或最底层
}

interface WatermarkUploaderProps {
  onWatermarkChanged: (watermark: WatermarkInfo | null) => void;
}

export function WatermarkUploader({ onWatermarkChanged }: WatermarkUploaderProps) {
  const [watermark, setWatermark] = useState<WatermarkInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File): Promise<WatermarkInfo | null> => {
    if (!file.type.startsWith('image/png')) {
      alert('只支持PNG格式的水印图片');
      return null;
    }

    try {
      const url = URL.createObjectURL(file);
      
      // 获取图片尺寸
      const img = new window.Image();
      const imageInfo = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error('无法加载图片'));
        img.src = url;
      });

      return {
        id: Date.now().toString(),
        file,
        url,
        width: imageInfo.width,
        height: imageInfo.height,
        layer: 'top'
      };
    } catch (error) {
      console.error('处理水印文件失败:', error);
      alert('处理水印文件失败');
      return null;
    }
  }, []);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;
    
    const watermarkInfo = await processFile(file);
    
    if (watermarkInfo) {
      // 清理旧的URL
      if (watermark) {
        URL.revokeObjectURL(watermark.url);
      }
      setWatermark(watermarkInfo);
      onWatermarkChanged(watermarkInfo);
    }
  }, [processFile, watermark, onWatermarkChanged]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemoveWatermark = useCallback(() => {
    if (watermark) {
      URL.revokeObjectURL(watermark.url);
      setWatermark(null);
      onWatermarkChanged(null);
    }
  }, [watermark, onWatermarkChanged]);

  const handleLayerChange = useCallback((layer: 'top' | 'bottom') => {
    if (watermark) {
      const updatedWatermark = { ...watermark, layer };
      setWatermark(updatedWatermark);
      onWatermarkChanged(updatedWatermark);
    }
  }, [watermark, onWatermarkChanged]);

  return (
    <div className="space-y-4">
      {!watermark ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-medium mb-2">拖拽PNG水印图片到此处</p>
            <p className="text-sm">或点击选择文件</p>
            <p className="text-xs mt-2 text-gray-400">仅支持PNG格式，建议使用透明背景</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              水印设置
            </h4>
            <button
              onClick={handleRemoveWatermark}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
              title="移除水印"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
              <Image
                src={watermark.url}
                alt={watermark.file.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {watermark.file.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {watermark.width} × {watermark.height}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              水印层级
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="top"
                  checked={watermark.layer === 'top'}
                  onChange={() => handleLayerChange('top')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">最顶层</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="bottom"
                  checked={watermark.layer === 'bottom'}
                  onChange={() => handleLayerChange('bottom')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">最底层</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}