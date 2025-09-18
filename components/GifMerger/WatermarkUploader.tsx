'use client';

import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';

export interface WatermarkInfo {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  layer: number; // 修改为数字层级
  
  // 新增的水印配置选项
  mode: 'direct' | 'fill' | 'repeat'; // 水印模式：直拼、填充、重复
  target: 'overall' | string[]; // 水印主体模式：整体或选择的GIF ID列表
}

interface WatermarkUploaderProps {
  onWatermarkChanged: (watermarks: WatermarkInfo[]) => void;
  gifObjects: { id: string; file: File; url: string }[]; // 传入GIF对象列表用于选择
}

export function WatermarkUploader({ onWatermarkChanged, gifObjects }: WatermarkUploaderProps) {
  const [watermarks, setWatermarks] = useState<WatermarkInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedGifs, setSelectedGifs] = useState<Record<string, string[]>>({}); // 用于多选GIF，key为水印ID
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
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        url,
        width: imageInfo.width,
        height: imageInfo.height,
        layer: 1, // 默认层级为1（在GIF之上）
        mode: 'direct', // 默认直拼模式
        target: 'overall' // 默认整体应用
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
      setWatermarks(prev => {
        const newWatermarks = [...prev, watermarkInfo];
        onWatermarkChanged(newWatermarks);
        return newWatermarks;
      });
    }
  }, [processFile, onWatermarkChanged]);

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

  const handleRemoveWatermark = useCallback((id: string) => {
    setWatermarks(prev => {
      const removed = prev.find(wm => wm.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      const newWatermarks = prev.filter(wm => wm.id !== id);
      // 同时移除对应的选中GIF记录
      const newSelectedGifs = { ...selectedGifs };
      delete newSelectedGifs[id];
      setSelectedGifs(newSelectedGifs);
      
      onWatermarkChanged(newWatermarks);
      return newWatermarks;
    });
  }, [selectedGifs, onWatermarkChanged]);

  // 处理水印层级变化
  const handleLayerChange = useCallback((id: string, layer: number) => {
    setWatermarks(prev => {
      const updatedWatermarks = prev.map(wm => 
        wm.id === id ? { ...wm, layer } : wm
      );
      onWatermarkChanged(updatedWatermarks);
      return updatedWatermarks;
    });
  }, [onWatermarkChanged]);

  // 处理水印模式变化
  const handleModeChange = useCallback((id: string, mode: 'direct' | 'fill' | 'repeat') => {
    setWatermarks(prev => {
      const updatedWatermarks = prev.map(wm => 
        wm.id === id ? { ...wm, mode } : wm
      );
      onWatermarkChanged(updatedWatermarks);
      return updatedWatermarks;
    });
  }, [onWatermarkChanged]);

  // 处理水印目标变化
  const handleTargetChange = useCallback((id: string, target: 'overall' | string[]) => {
    setWatermarks(prev => {
      const updatedWatermarks = prev.map(wm => 
        wm.id === id ? { ...wm, target } : wm
      );
      onWatermarkChanged(updatedWatermarks);
      return updatedWatermarks;
    });
  }, [onWatermarkChanged]);

  // 处理GIF选择变化
  const handleGifSelectionChange = useCallback((watermarkId: string, gifId: string, checked: boolean) => {
    setSelectedGifs(prev => {
      const currentSelections = prev[watermarkId] || [];
      let newSelections: string[];
      
      if (checked) {
        newSelections = [...currentSelections, gifId];
      } else {
        newSelections = currentSelections.filter(id => id !== gifId);
      }
      
      const updated = { ...prev, [watermarkId]: newSelections };
      
      // 更新对应水印的目标
      setWatermarks(prevWatermarks => {
        const updatedWatermarks = prevWatermarks.map(wm => 
          wm.id === watermarkId ? { ...wm, target: newSelections } : wm
        );
        onWatermarkChanged(updatedWatermarks);
        return updatedWatermarks;
      });
      
      return updated;
    });
  }, [onWatermarkChanged]);

  // 处理全选/取消全选
  const handleSelectAll = useCallback((watermarkId: string, selectAll: boolean) => {
    const allIds = gifObjects.map(gif => gif.id);
    setSelectedGifs(prev => {
      const updated = { ...prev, [watermarkId]: selectAll ? allIds : [] };
      
      // 更新对应水印的目标
      setWatermarks(prevWatermarks => {
        const updatedWatermarks = prevWatermarks.map(wm => 
          wm.id === watermarkId ? { ...wm, target: selectAll ? allIds : [] } : wm
        );
        onWatermarkChanged(updatedWatermarks);
        return updatedWatermarks;
      });
      
      return updated;
    });
  }, [gifObjects, onWatermarkChanged]);

  // 处理添加新水印
  const handleAddNewWatermark = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      {watermarks.length === 0 ? (
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
        <div className="space-y-4">
          {/* 添加新水印按钮 */}
          <div className="flex justify-end">
            <button
              onClick={handleAddNewWatermark}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 relative"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              添加新水印
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </button>
          </div>
          
          {/* 水印列表 */}
          {watermarks.map((watermark) => (
            <div key={watermark.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative">
              {/* 移除按钮 */}
              <button
                onClick={() => handleRemoveWatermark(watermark.id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                title="移除水印"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
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

              {/* 水印模式选择 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  水印模式
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleModeChange(watermark.id, 'direct')}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      watermark.mode === 'direct'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    直拼模式
                  </button>
                  <button
                    onClick={() => handleModeChange(watermark.id, 'fill')}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      watermark.mode === 'fill'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    填充模式
                  </button>
                  <button
                    onClick={() => handleModeChange(watermark.id, 'repeat')}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      watermark.mode === 'repeat'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    重复模式
                  </button>
                </div>
              </div>

              {/* 水印层级 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  水印层级
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={watermark.layer}
                    onChange={(e) => handleLayerChange(watermark.id, parseInt(e.target.value) || 0)}
                    className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min="-10"
                    max="10"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {watermark.layer > 0 ? '位于GIF之上' : watermark.layer < 0 ? '位于GIF之下' : '与GIF同层'}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  负数在GIF之下，正数在GIF之上，0与GIF同层。数字越大越上层。
                </div>
              </div>

              {/* 水印主体模式选择 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  水印应用范围
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="overall"
                      checked={watermark.target === 'overall'}
                      onChange={() => handleTargetChange(watermark.id, 'overall')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">整体应用（默认）</span>
                  </label>
                  
                  {gifObjects.length > 0 && (
                    <>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="select"
                          checked={Array.isArray(watermark.target)}
                          onChange={() => {
                            const currentSelections = selectedGifs[watermark.id] || [];
                            handleTargetChange(watermark.id, currentSelections.length > 0 ? currentSelections : [gifObjects[0]?.id || '']);
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">选择GIF</span>
                      </label>
                      
                      {Array.isArray(watermark.target) && (
                        <div className="ml-6 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">选择应用水印的GIF：</span>
                            <button
                              onClick={() => handleSelectAll(watermark.id, (selectedGifs[watermark.id] || []).length !== gifObjects.length)}
                              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {(selectedGifs[watermark.id] || []).length === gifObjects.length ? '取消全选' : '全选'}
                            </button>
                          </div>
                          <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded p-2">
                            {gifObjects.map(gif => (
                              <label key={gif.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                                <input
                                  type="checkbox"
                                  checked={(selectedGifs[watermark.id] || []).includes(gif.id)}
                                  onChange={(e) => handleGifSelectionChange(watermark.id, gif.id, e.target.checked)}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{gif.file.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}