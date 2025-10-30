'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import type { ImageWatermark } from './types';

interface WatermarkUploaderProps {
  onWatermarksAdded: (watermarks: ImageWatermark[]) => void;
  maxFiles?: number;
}

/**
 * 水印图片上传组件
 */
export function WatermarkUploader({ onWatermarksAdded, maxFiles = 10 }: WatermarkUploaderProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );

    if (imageFiles.length === 0) {
      alert('请选择有效的图片文件（最大10MB）');
      return;
    }

    if (imageFiles.length > maxFiles) {
      alert(`最多只能上传${maxFiles}个水印图片`);
      return;
    }

    const watermarks: ImageWatermark[] = [];

    for (const file of imageFiles) {
      try {
        const url = URL.createObjectURL(file);
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });

        watermarks.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          type: 'image',
          file,
          url,
          originalWidth: img.width,
          originalHeight: img.height,
          width: img.width,
          height: img.height,
          position: { x: 50, y: 50 },
          rotation: 0,
          layer: 'above',
          opacity: 1
        });
      } catch (error) {
        console.error('加载图片失败:', error);
      }
    }

    if (watermarks.length > 0) {
      onWatermarksAdded(watermarks);
    }
  }, [onWatermarksAdded, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    },
    multiple: true,
    maxFiles
  });

  return (
    <button
      {...getRootProps()}
      className={`
        w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all h-full min-h-[130px] flex items-center justify-center hover:scale-105
        ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20 shadow-lg'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-md'
        }
      `}
      type="button"
    >
      <input {...getInputProps()} />
      <div className="space-y-3">
        <svg
          className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {isDragActive ? '释放以上传水印' : '上传水印图片'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          支持PNG、JPG等格式，最多10MB
        </p>
      </div>
    </button>
  );
}
