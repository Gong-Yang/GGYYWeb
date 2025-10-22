'use client';

import { decompressFrames, parseGIF } from 'gifuct-js';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import type { GifFrame, GifObject } from './types';

interface GifUploaderProps {
  /** 文件添加成功后的回调函数 */
  onFilesAdded: (gifObjects: GifObject[]) => void;
  /** 最大文件数量限制 */
  maxFiles?: number;
}

/**
 * GIF 文件上传组件
 * 支持拖拽上传和点击选择，自动解析 GIF 文件并提取帧数据
 */
export function GifUploader({ onFilesAdded, maxFiles = 10 }: GifUploaderProps) {
  // 是否正在处理文件
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * 解析单个 GIF 文件
   * @param file - GIF 文件对象
   * @returns 解析后的 GIF 对象，解析失败返回 null
   */
  const parseGifFile = useCallback(async (file: File): Promise<GifObject | null> => {
    try {
      console.log('开始解析GIF:', file.name);
      
      // 读取文件并解析 GIF 结构
      const arrayBuffer = await file.arrayBuffer();
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
      
      // 初始化画布为透明
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const processedFrames: GifFrame[] = [];
      let hasTransparency = false; // 标记是否包含透明像素
      
      // 处理每一帧
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        if (!frame) continue;
        
        // 根据上一帧的处置方法处理画布
        if (i > 0) {
          const prevFrame = frames[i - 1];
          if (prevFrame) {
            // Disposal Type 2: 恢复到背景色（清除上一帧区域）
            if (prevFrame.disposalType === 2 && prevFrame.dims) {
              ctx.clearRect(
                prevFrame.dims.left,
                prevFrame.dims.top,
                prevFrame.dims.width,
                prevFrame.dims.height
              );
            } 
            // Disposal Type 3: 恢复到渲染前的状态
            else if (prevFrame.disposalType === 3) {
              const restoreFrame = processedFrames[i - 2];
              if (restoreFrame) {
                ctx.putImageData(restoreFrame.imageData, 0, 0);
              } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
              }
            }
            // Disposal Type 0/1: 保留当前画布内容（累积渲染）
          }
        }

        // 绘制当前帧的图像数据
        if (frame.patch && frame.dims) {
          const { width, height, left, top } = frame.dims;
          // 使用临时画布处理 patch 数据
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = width;
          tempCanvas.height = height;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            const tempImageData = new ImageData(width, height);
            tempImageData.data.set(frame.patch);
            tempCtx.putImageData(tempImageData, 0, 0);
            // 使用 drawImage 正确处理透明度混合
            ctx.drawImage(tempCanvas, left, top);
          }
        }

        // 获取完整帧数据（深拷贝避免引用问题）
        const fullFrameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const copiedImageData = new ImageData(
          new Uint8ClampedArray(fullFrameData.data),
          fullFrameData.width,
          fullFrameData.height
        );
        
        // 检查是否包含透明像素（alpha < 255）
        if (!hasTransparency) {
          for (let i = 3; i < fullFrameData.data.length; i += 4) {
            if (fullFrameData.data[i] !== undefined && fullFrameData.data[i]! < 255) {
              hasTransparency = true;
              break;
            }
          }
        }
        
        processedFrames.push({
          imageData: copiedImageData,
          delay: Math.max(frame.delay || 100, 50), // 最小延迟 50ms
          disposal: frame.disposalType || 0
        });
      }

      // 计算总时长并创建预览 URL
      const totalDuration = processedFrames.reduce((sum, frame) => sum + frame.delay, 0);
      const url = URL.createObjectURL(file);

      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        url,
        width: gif.lsd.width,
        height: gif.lsd.height,
        frames: processedFrames,
        totalDuration,
        frameCount: processedFrames.length,
        hasTransparency
      };
    } catch (error) {
      console.error('解析GIF文件失败:', error);
      return null;
    }
  }, []);

  /**
   * 文件拖放回调
   */
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // 过滤出有效的 GIF 文件（最大 50MB）
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
      
      // 逐个解析文件
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
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
          ${isProcessing 
            ? 'border-gray-300 bg-gray-50 dark:bg-gray-900/30 cursor-not-allowed'
            : isDragActive 
              ? 'border-gray-900 bg-gray-100 dark:border-white dark:bg-gray-900/50 scale-[1.01]' 
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-3">
          <div className="flex justify-center">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-gray-900 dark:border-white"></div>
            ) : (
              <svg
                className="w-14 h-14 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
          </div>
          <div>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {isProcessing 
                ? '正在解析GIF文件...' 
                : isDragActive 
                  ? '释放以上传文件' 
                  : '拖拽GIF文件到此处，或点击上传'
              }
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              支持多选，最多{maxFiles}个文件，单个文件最大50MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}