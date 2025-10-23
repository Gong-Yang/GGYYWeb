'use client';

import Image from 'next/image';
import React, { useCallback, useState } from 'react';

import { Button } from '@/components/general/Button/Button';
import { GifUploader } from '@/components/WebTool/general/GifUploader';

import type { GifObject, ImageWatermark, TextWatermark, Watermark } from '@/components/WebTool/GifWatermark/types';
import { WatermarkCanvas } from '@/components/WebTool/GifWatermark/WatermarkCanvas';
import { WatermarkControls } from '@/components/WebTool/GifWatermark/WatermarkControls';
import { WatermarkExporter } from '@/components/WebTool/GifWatermark/WatermarkExporter';
import { WatermarkUploader } from '@/components/WebTool/GifWatermark/WatermarkUploader';

export default function GifWatermarkPage() {
  const [gifObjects, setGifObjects] = useState<GifObject[]>([]);
  const [watermarks, setWatermarks] = useState<Watermark[]>([]);
  const [selectedWatermarkId, setSelectedWatermarkId] = useState<string | null>(null);
  const [currentGifIndex, setCurrentGifIndex] = useState<number>(0);
  // 保存每个水印的初始位置
  const [watermarkInitialPositions, setWatermarkInitialPositions] = useState<Record<string, { x: number; y: number }>>({});

  // 添加GIF文件
  const handleGifsAdded = useCallback((newGifs: GifObject[]) => {
    setGifObjects(prev => [...prev, ...newGifs]);
    if (newGifs.length > 0 && gifObjects.length === 0) {
      setCurrentGifIndex(0);
    }
  }, [gifObjects.length]);

  // 删除GIF文件
  const handleDeleteGif = useCallback((gifId: string) => {
    setGifObjects(prev => {
      const deletedIndex = prev.findIndex(g => g.id === gifId);
      const newGifs = prev.filter(g => g.id !== gifId);
      
      // 调整当前索引
      if (deletedIndex <= currentGifIndex && currentGifIndex > 0) {
        setCurrentGifIndex(currentGifIndex - 1);
      }
      
      return newGifs;
    });
  }, [currentGifIndex]);

  // 添加图片水印
  const handleWatermarksAdded = useCallback((newWatermarks: ImageWatermark[]) => {
    setWatermarks(prev => [...prev, ...newWatermarks]);
    // 保存初始位置
    const newPositions: Record<string, { x: number; y: number }> = {};
    newWatermarks.forEach(w => {
      newPositions[w.id] = { x: w.position.x, y: w.position.y };
    });
    setWatermarkInitialPositions(prev => ({ ...prev, ...newPositions }));
  }, []);

  // 添加文字水印
  const handleAddTextWatermark = useCallback(() => {
    const newTextWatermark: TextWatermark = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: 'text',
      text: '水印文字',
      fontSize: 48,
      color: '#000000',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      position: { x: 50, y: 50 },
      rotation: 0,
      layer: 'above',
      opacity: 1
    };
    setWatermarks(prev => [...prev, newTextWatermark]);
    setSelectedWatermarkId(newTextWatermark.id);
    // 保存初始位置
    setWatermarkInitialPositions(prev => ({
      ...prev,
      [newTextWatermark.id]: { x: 50, y: 50 }
    }));
  }, []);

  // 更新水印
  const handleWatermarkUpdate = useCallback((id: string, updates: Partial<Watermark>) => {
    setWatermarks(prev =>
      prev.map(w => (w.id === id ? { ...w, ...updates } as Watermark : w))
    );
  }, []);

  // 删除水印
  const handleDeleteWatermark = useCallback((id: string) => {
    setWatermarks(prev => prev.filter(w => w.id !== id));
    setSelectedWatermarkId(prev => (prev === id ? null : prev));
    // 删除初始位置记录
    setWatermarkInitialPositions(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const currentGif = gifObjects[currentGifIndex] || null;
  const selectedWatermark = watermarks.find(w => w.id === selectedWatermarkId);

  return (
    <div className=" bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="space-y-16">
          {/* 大标题和功能描述 */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
              GIF水印工具
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              轻松为您的GIF动图添加图片水印或文字水印,支持自由调整位置、大小、旋转角度和透明度
            </p>
          </div>
          
          {/* 上传GIF模块 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              选择GIF文件
            </h2>
            <GifUploader onFilesAdded={handleGifsAdded} />
          </div>
        </div>
        
        

        {/* 水印编辑区域 */}
        {gifObjects.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* 预览画布 */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                水印预览
              </h2>
              {/* 顶部GIF缩略图切换区 */}
              <div className="flex items-center gap-3 overflow-x-auto pb-6 pt-3 px-3 mb-6 -mx-3">
                {gifObjects.map((gif, index) => (
                  <div
                    key={gif.id}
                    className={`relative flex-shrink-0 rounded-lg border-2 transition-all group shadow-md ${
                      currentGifIndex === index
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <button
                      onClick={() => setCurrentGifIndex(index)}
                      className="w-20 h-20 overflow-hidden rounded-md hover:scale-105 transition-transform"
                      title={gif.file.name}
                    >
                      <Image
                        src={gif.url}
                        alt={gif.file.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </button>
                    {/* 删除按钮 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGif(gif.id);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      title="删除此GIF"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <WatermarkCanvas
                gif={currentGif}
                watermarks={watermarks}
                selectedWatermarkId={selectedWatermarkId}
                onWatermarkUpdate={handleWatermarkUpdate}
                onWatermarkSelect={setSelectedWatermarkId}
              />
            </div>

            {/* 水印控制面板 */}
            <div className="space-y-8">
              {/* 添加水印 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                  添加水印
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <WatermarkUploader onWatermarksAdded={handleWatermarksAdded} />
                  <Button
                    intent="dark"
                    size="md"
                    fullWidth
                    onClick={handleAddTextWatermark}
                    className="h-full min-h-[130px] hover:scale-105 transition-transform"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm font-medium">添加文字水印</span>
                    </div>
                  </Button>
                </div>
              </div>

              {/* 水印列表 */}
              {watermarks.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                    水印列表 ({watermarks.length})
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {watermarks.map(watermark => (
                      <div
                        key={watermark.id}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                          selectedWatermarkId === watermark.id
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}
                        onClick={() => setSelectedWatermarkId(watermark.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {watermark.type === 'image' ? '图片水印' : watermark.text}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {watermark.layer === 'above' ? 'GIF上方' : 'GIF下方'}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWatermark(watermark.id);
                            }}
                            className="ml-2 p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="删除水印"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 水印属性控制 */}
              {selectedWatermark && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                    水印属性
                  </h2>
                  <WatermarkControls
                    watermark={selectedWatermark}
                    onUpdate={(updates) => handleWatermarkUpdate(selectedWatermark.id, updates)}
                    onDelete={() => handleDeleteWatermark(selectedWatermark.id)}
                    initialPosition={watermarkInitialPositions[selectedWatermark.id]}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 导出区域 */}
        {gifObjects.length > 0 && watermarks.length > 0 && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <WatermarkExporter
              gifObjects={gifObjects}
              watermarks={watermarks}
              selectedGifIds={[]}
            />
          </div>
        )}


      </div>
    </div>
  );
}
