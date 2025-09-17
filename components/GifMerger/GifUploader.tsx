'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseGIF, decompressFrames } from 'gifuct-js';
import type { GifObject, GifFrame } from './types';

interface GifUploaderProps {
  onFilesAdded: (gifObjects: GifObject[]) => void;
  maxFiles?: number;
}

export function GifUploader({ onFilesAdded, maxFiles = 10 }: GifUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // 解析GIF文件
  const parseGifFile = useCallback(async (file: File): Promise<GifObject | null> => {
    try {
      console.log('开始解析GIF:', file.name);
      
      // 读取文件为ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // 使用gifuct-js解析GIF
      const gif = parseGIF(arrayBuffer);
      const frames = decompressFrames(gif, true);
      
      if (!frames || frames.length === 0) {
        throw new Error('无法解析GIF帧数据');
      }

      console.log(`解析到 ${frames.length} 帧`);

      // 创建canvas用于渲染帧
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('无法创建Canvas上下文');
      }

      // 设置canvas尺寸
      canvas.width = gif.lsd.width;
      canvas.height = gif.lsd.height;

      const processedFrames: GifFrame[] = [];
      let previousImageData: ImageData | null = null;

      // 处理每一帧
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        if (!frame) continue; // 跳过空帧
        
        // 根据disposal方法处理画布
        if (i > 0) {
          const prevFrame = frames[i - 1];
          if (prevFrame && prevFrame.disposalType === 2) {
            // 恢复背景色
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          } else if (prevFrame && prevFrame.disposalType === 3 && previousImageData) {
            // 恢复到上一帧
            ctx.putImageData(previousImageData, 0, 0);
          }
        }

        // 保存当前状态（用于disposal type 3）
        if (frame.disposalType === 3) {
          previousImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        // 绘制当前帧
        if (frame.patch && frame.dims) {
          const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
          imageData.data.set(frame.patch);
          ctx.putImageData(imageData, frame.dims.left, frame.dims.top);
        }

        // 获取完整帧数据
        const fullFrameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        processedFrames.push({
          imageData: fullFrameData,
          delay: Math.max(frame.delay || 100, 50), // 最小50ms延迟
          disposal: frame.disposalType || 0
        });
      }

      const totalDuration = processedFrames.reduce((sum, frame) => sum + frame.delay, 0);
      const url = URL.createObjectURL(file);

      const gifObject: GifObject = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        url,
        width: gif.lsd.width,
        height: gif.lsd.height,
        frames: processedFrames,
        totalDuration,
        frameCount: processedFrames.length
      };

      console.log('GIF解析完成:', {
        fileName: file.name,
        dimensions: `${gif.lsd.width}x${gif.lsd.height}`,
        frameCount: processedFrames.length,
        totalDuration: totalDuration + 'ms'
      });

      return gifObject;
    } catch (error) {
      console.error('解析GIF文件失败:', error);
      return null;
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const gifFiles = acceptedFiles.filter(file => 
      file.type === 'image/gif' && file.size <= 50 * 1024 * 1024
    );

    if (gifFiles.length === 0) {
      alert('请选择有效的GIF文件（最大50MB）');
      return;
    }

    if (gifFiles.length > maxFiles) {
      alert(`最多只能上传${maxFiles}个GIF文件`);
      return;
    }

    setIsProcessing(true);
    
    try {
      const gifObjects: GifObject[] = [];
      
      for (const file of gifFiles) {
        const gifObject = await parseGifFile(file);
        if (gifObject) {
          gifObjects.push(gifObject);
        }
      }

      if (gifObjects.length > 0) {
        onFilesAdded(gifObjects);
      } else {
        alert('没有成功解析任何GIF文件');
      }
    } catch (error) {
      console.error('处理文件时出错:', error);
      alert('处理文件时出错，请重试');
    } finally {
      setIsProcessing(false);
    }
  }, [parseGifFile, onFilesAdded, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/gif': ['.gif'],
    },
    multiple: true,
    maxFiles,
    disabled: isProcessing,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isProcessing 
            ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
            : isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="flex justify-center">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            ) : (
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isProcessing 
                ? '正在解析GIF文件...' 
                : isDragActive 
                  ? '放下GIF文件' 
                  : '拖拽GIF文件到这里'
              }
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              或点击选择文件（支持多选，最多{maxFiles}个，每个最大50MB）
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>• 使用gifuct-js精确解析GIF帧数据</p>
        <p>• 保持原始动画帧序列和时间</p>
        <p>• 自动以最长GIF的帧数为播放周期</p>
        <p>• 较短GIF播放完后定格在最后一帧</p>
        <p>• 支持透明背景GIF合并</p>
      </div>
    </div>
  );
}