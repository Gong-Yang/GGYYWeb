'use client';

import Image from 'next/image';
import React, { useCallback, useState } from 'react';

import { FramePreview } from './FramePreview';
import { GifExporter } from './GifExporter';
import { GifUploader } from './GifUploader';
import type { GifObject } from './types';

export function GifMergerTool() {
  const [gifObjects, setGifObjects] = useState<GifObject[]>([]);
  const [showFrameDebug, setShowFrameDebug] = useState(false);

  // 处理文件添加
  const handleFilesAdded = useCallback((newGifObjects: GifObject[]) => {
    setGifObjects(prev => [...prev, ...newGifObjects]);
  }, []);

  // 移除GIF文件
  const handleRemoveGif = useCallback((id: string) => {
    setGifObjects(prev => {
      const updated = prev.filter(gif => gif.id !== id);
      // 清理URL对象
      const removed = prev.find(gif => gif.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  }, []);

  // 清空所有文件
  const handleClearAll = useCallback(() => {
    gifObjects.forEach(gif => {
      URL.revokeObjectURL(gif.url);
    });
    setGifObjects([]);
  }, [gifObjects]);

  // 计算统计信息
  const totalFrames = Math.max(...gifObjects.map(gif => gif.frameCount), 0);
  const totalSize = gifObjects.reduce((sum, gif) => sum + gif.file.size, 0);
  const longestDuration = Math.max(...gifObjects.map(gif => gif.totalDuration), 0);
  
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(1) + 's';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 文件上传区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          选择GIF文件
        </h2>
        <GifUploader onFilesAdded={handleFilesAdded} />
      </div>

      {/* 已上传文件列表 */}
      {gifObjects.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              已上传的GIF文件 ({gifObjects.length})
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFrameDebug(!showFrameDebug)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {showFrameDebug ? '隐藏' : '显示'}帧调试
              </button>
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                清空所有
              </button>
            </div>
          </div>

          {/* 文件统计信息 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {gifObjects.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">文件数量</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {totalFrames}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">最大帧数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatTime(longestDuration)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">最长时长</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatSize(totalSize)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">总大小</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {Math.ceil(Math.sqrt(gifObjects.length))} × {Math.ceil(gifObjects.length / Math.ceil(Math.sqrt(gifObjects.length)))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">网格布局</div>
            </div>
          </div>

          {/* 文件列表 */}
          <div className="space-y-6">
            {gifObjects.map((gif) => (
              <div
                key={gif.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                {/* 基本信息 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                      <Image
                        src={gif.url}
                        alt={gif.file.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                        {gif.file.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {gif.width} × {gif.height} • {gif.frameCount} 帧 • {formatSize(gif.file.size)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        时长: {formatTime(gif.totalDuration)} • 平均帧延迟: {Math.round(gif.totalDuration / gif.frameCount)}ms
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveGif(gif.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                    title="移除文件"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* 帧调试显示 */}
                {showFrameDebug && gif.frames && gif.frames.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      帧调试显示 ({gif.frames.length} 帧)
                    </h4>
                    <div className="grid grid-cols-8 gap-3 max-h-96 overflow-y-auto p-2 bg-white dark:bg-gray-800 rounded border">
                      {gif.frames.map((frame: import('./types').GifFrame, frameIndex: number) => (
                        <FramePreview
                          key={frameIndex}
                          frame={frame}
                          frameIndex={frameIndex}
                          gifWidth={gif.width}
                          gifHeight={gif.height}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GIF导出区域 */}
      {gifObjects.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            合并导出
          </h2>
          <GifExporter gifObjects={gifObjects} />
        </div>
      )}

      {/* 空状态提示 */}
      {gifObjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V4H20C20.5523 4 21 4.44772 21 5C21 5.55228 20.5523 6 20 6H19V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6H4C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4H7ZM9 3V4H15V3H9ZM7 6V20H17V6H7ZM9 8V18H11V8H9ZM13 8V18H15V8H13Z" />
            </svg>
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            还没有上传任何GIF文件
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            请上传多个GIF文件开始合并
          </p>
        </div>
      )}

      {/* 技术说明 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          技术实现说明
        </h3>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>• <strong>帧处理</strong>：正确实现累积渲染机制和Disposal方法处理</p>
          <p>• <strong>时序同步</strong>：以最长GIF的帧数为播放周期，短GIF播放完后定格在最后一帧</p>
          <p>• <strong>透明支持</strong>：完整支持透明背景GIF的合并</p>
        </div>
      </div>
    </div>
  );
}