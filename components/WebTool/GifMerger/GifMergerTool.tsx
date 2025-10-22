'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

import { FramePreview } from './FramePreview';
import { GifExporter } from './GifExporter';
import { GifUploader } from './GifUploader';
import type { GifFrame, GifObject } from './types';

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @returns 格式化后的字符串（如 "1.5 MB"）
 */
const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 格式化时间
 * @param ms - 毫秒数
 * @returns 格式化后的字符串（如 "2.5s"）
 */
const formatTime = (ms: number): string => {
  return (ms / 1000).toFixed(1) + 's';
};

/**
 * GIF 合并工具主组件
 * 负责协调文件上传、预览和导出功能
 */
export function GifMergerTool() {
  const [gifObjects, setGifObjects] = useState<GifObject[]>([]);
  const [showFrameDebug, setShowFrameDebug] = useState<boolean>(false);
  // 当前拖拽的 GIF 索引
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  // 默认背景颜色（根据透明度自动设置）
  const [defaultBackgroundColor, setDefaultBackgroundColor] = useState<'transparent' | 'original'>('original');

  // 自动检测透明度并设置默认背景颜色
  useEffect(() => {
    if (gifObjects.length > 0) {
      // 如果任一 GIF 包含透明背景，默认使用透明背景
      const anyHasTransparency = gifObjects.some(gif => gif.hasTransparency);
      setDefaultBackgroundColor(anyHasTransparency ? 'transparent' : 'original');
    }
  }, [gifObjects]);

  /**
   * 添加新上传的 GIF 文件
   */
  const handleFilesAdded = useCallback((newGifObjects: GifObject[]) => {
    setGifObjects(prev => [...prev, ...newGifObjects]);
  }, []);

  /**
   * 移除指定的 GIF 文件
   * @param id - GIF 对象的 ID
   */
  const handleRemoveGif = useCallback((id: string) => {
    setGifObjects(prev => {
      const removed = prev.find(gif => gif.id === id);
      if (removed) URL.revokeObjectURL(removed.url); // 释放内存
      return prev.filter(gif => gif.id !== id);
    });
  }, []);

  /**
   * 清空所有已上传的 GIF
   */
  const handleClearAll = useCallback(() => {
    gifObjects.forEach(gif => URL.revokeObjectURL(gif.url)); // 释放所有 URL
    setGifObjects([]);
  }, [gifObjects]);

  /**
   * 拖拽开始事件
   */
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    (e.currentTarget as HTMLElement).style.opacity = '0.5';
  }, []);

  /**
   * 拖拽结束事件
   */
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
    setDraggedIndex(null);
  }, []);

  /**
   * 拖拽悬停事件
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * 拖拽放下事件 - 调整 GIF 顺序
   */
  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    setGifObjects(prev => {
      const newGifObjects = [...prev];
      const draggedItem = newGifObjects[draggedIndex];
      if (!draggedItem) return prev;
      
      // 移除拖拽的项，并插入到目标位置
      newGifObjects.splice(draggedIndex, 1);
      newGifObjects.splice(dropIndex, 0, draggedItem);
      return newGifObjects;
    });
  }, [draggedIndex]);

  // 计算统计信息
  const stats = {
    totalFrames: Math.max(...gifObjects.map(gif => gif.frameCount), 0),
    totalSize: gifObjects.reduce((sum, gif) => sum + gif.file.size, 0),
    longestDuration: Math.max(...gifObjects.map(gif => gif.totalDuration), 0),
    gridLayout: {
      cols: Math.ceil(Math.sqrt(gifObjects.length)),
      rows: Math.ceil(gifObjects.length / Math.ceil(Math.sqrt(gifObjects.length)))
    }
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
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  💡 拖拽文件可调整合并顺序
                </span>
                <button
                    onClick={() => setShowFrameDebug(!showFrameDebug)}
                    className="text-sm text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                >
                  {showFrameDebug ? '隐藏' : '显示'}帧调试
                </button>
                <button
                    onClick={handleClearAll}
                    className="text-sm text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                >
                  清空所有
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {[
                { label: '文件数量', value: gifObjects.length },
                { label: '最大帧数', value: stats.totalFrames },
                { label: '最长时长', value: formatTime(stats.longestDuration) },
                { label: '总大小', value: formatSize(stats.totalSize) },
                { label: '网格布局', value: `${stats.gridLayout.cols} × ${stats.gridLayout.rows}` }
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
                </div>
              ))}
            </div>

            {/* 文件列表 */}
            <div className="space-y-6">
              {gifObjects.map((gif, index) => (
                  <div
                      key={gif.id}
                      className={`p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-move transition-all duration-200 ${
                        draggedIndex === index ? 'opacity-50 shadow-lg' : 'hover:shadow-md'
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      title="拖拽可调整文件顺序"
                  >
                    {/* 基本信息 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {/* 序号显示 */}
                        <div className="flex-shrink-0 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        
                        {/* 拖拽手柄 */}
                        <div className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                          </svg>
                        </div>
                        
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

                    {showFrameDebug && gif.frames.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            帧调试显示 ({gif.frames.length} 帧)
                          </h4>
                          <div className="grid grid-cols-8 gap-3 max-h-96 overflow-y-auto p-2 bg-white dark:bg-gray-800 rounded border">
                            {gif.frames.map((frame: GifFrame, frameIndex: number) => (
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
          <GifExporter gifObjects={gifObjects} defaultBackgroundColor={defaultBackgroundColor} />
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
    </div>
  );
}