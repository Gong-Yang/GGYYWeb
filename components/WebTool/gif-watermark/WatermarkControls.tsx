'use client';

import React from 'react';

import { Button } from '@/components/general/Button/Button';
import { Input } from '@/components/general/Input/Input';

import { ColorPicker } from './ColorPicker';
import type { Watermark } from './types';

interface WatermarkControlsProps {
  watermark: Watermark;
  onUpdate: (updates: Partial<Watermark>) => void;
  onDelete: () => void;
  initialPosition?: { x: number; y: number };
}

/**
 * 水印属性控制面板
 */
export function WatermarkControls({ watermark, onUpdate, onDelete, initialPosition }: WatermarkControlsProps) {
  // 默认初始位置为50,50
  const defaultInitialPosition = initialPosition || { x: 50, y: 50 };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {watermark.type === 'image' ? '图片水印' : '文字水印'}
        </h3>
        <Button
          size="sm"
          intent="light"
          onClick={onDelete}
          title="删除水印"
        >
          删除
        </Button>
      </div>

      {/* 文字内容（仅文字水印） */}
      {watermark.type === 'text' && (
        <div className="pt-2">
          <Input
            label="文字内容"
            value={watermark.text}
            onChange={e => onUpdate({ text: e.target.value })}
            placeholder="输入水印文字"
          />
        </div>
      )}

      {/* 位置控制 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            位置坐标
          </label>
          <button
            onClick={() => onUpdate({ position: defaultInitialPosition })}
            className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all flex items-center gap-1"
            title="重置位置"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重置
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              X坐标
            </label>
            <input
              type="number"
              value={Math.round(watermark.position.x)}
              onChange={e => onUpdate({ position: { ...watermark.position, x: Number(e.target.value) } })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Y坐标
            </label>
            <input
              type="number"
              value={Math.round(watermark.position.y)}
              onChange={e => onUpdate({ position: { ...watermark.position, y: Number(e.target.value) } })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* 尺寸控制（仅图片水印） */}
      {watermark.type === 'image' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              宽度
            </label>
            <input
              type="number"
              value={Math.round(watermark.width)}
              onChange={e => {
                const newWidth = Number(e.target.value);
                const ratio = newWidth / watermark.width;
                onUpdate({ 
                  width: newWidth,
                  height: watermark.height * ratio
                });
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              高度
            </label>
            <input
              type="number"
              value={Math.round(watermark.height)}
              onChange={e => {
                const newHeight = Number(e.target.value);
                const ratio = newHeight / watermark.height;
                onUpdate({ 
                  height: newHeight,
                  width: watermark.width * ratio
                });
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}

      {/* 字体控制(仅文字水印) */}
      {watermark.type === 'text' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              字体大小
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="12"
                max="120"
                value={watermark.fontSize}
                onChange={e => onUpdate({ fontSize: Number(e.target.value) })}
                className="flex-1 accent-blue-500"
              />
              <input
                type="number"
                min="12"
                max="120"
                value={watermark.fontSize}
                onChange={e => onUpdate({ fontSize: Number(e.target.value) })}
                className="w-20 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <ColorPicker
              label="颜色"
              value={watermark.color}
              onChange={color => onUpdate({ color })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                粗细
              </label>
              <select
                value={watermark.fontWeight}
                onChange={e => onUpdate({ fontWeight: e.target.value as 'normal' | 'bold' })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="normal">正常</option>
                <option value="bold">粗体</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                样式
              </label>
              <select
                value={watermark.fontStyle}
                onChange={e => onUpdate({ fontStyle: e.target.value as 'normal' | 'italic' })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="normal">正常</option>
                <option value="italic">斜体</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* 旋转控制 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          旋转角度
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="360"
            value={watermark.rotation}
            onChange={e => onUpdate({ rotation: Number(e.target.value) })}
            className="flex-1 accent-blue-500"
          />
          <input
            type="number"
            min="0"
            max="360"
            value={Math.round(watermark.rotation)}
            onChange={e => onUpdate({ rotation: Number(e.target.value) })}
            className="w-20 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">°</span>
        </div>
      </div>

      {/* 不透明度控制 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          不透明度
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={watermark.opacity * 100}
            onChange={e => onUpdate({ opacity: Number(e.target.value) / 100 })}
            className="flex-1 accent-blue-500"
          />
          <input
            type="number"
            min="0"
            max="100"
            value={Math.round(watermark.opacity * 100)}
            onChange={e => onUpdate({ opacity: Number(e.target.value) / 100 })}
            className="w-20 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">%</span>
        </div>
      </div>

      {/* 层级控制 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          图层
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onUpdate({ layer: 'below' })}
            className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
              watermark.layer === 'below'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg scale-105'
                : 'bg-white text-gray-700 dark:bg-gray-950 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
            }`}
          >
            GIF下方
          </button>
          <button
            onClick={() => onUpdate({ layer: 'above' })}
            className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
              watermark.layer === 'above'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg scale-105'
                : 'bg-white text-gray-700 dark:bg-gray-950 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
            }`}
          >
            GIF上方
          </button>
        </div>
      </div>
    </div>
  );
}
