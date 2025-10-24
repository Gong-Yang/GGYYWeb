'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SizeInputProps {
  /** 当前值 */
  value: number | undefined;
  /** 值变化回调 */
  onChange: (value: number) => void;
  /** 原始尺寸（用于预设选项） */
  originalSize?: number;
  /** 标签文本 */
  label: string;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
}

// 尺寸预设值
const SIZE_PRESETS = [32, 64, 128, 256, 512, 1024, 1080, 2048];

/**
 * 格式化选项显示文本
 */
const formatOptionText = (option: number | string, originalSize?: number): string => {
  if (option === 'original') return `原大小 (${originalSize}px)`;
  return `${option}px`;
};

/**
 * 尺寸输入组件
 * 支持直接输入和下拉选择预设值，带实时验证
 */
export function SizeInput({ 
  value, 
  onChange, 
  originalSize, 
  label,
  min = 1,
  max = 10000
}: SizeInputProps) {
  // 输入框值状态
  const [inputValue, setInputValue] = useState<string>(value?.toString() || '');
  // 下拉框是否展开
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步外部 value 变化
  useEffect(() => {
    setInputValue(value?.toString() || '');
  }, [value]);

  /**
   * 获取所有可用选项（原始尺寸 + 预设值）
   */
  const getOptions = (): Array<number | string> => {
    const options: Array<number | string> = [];
    if (originalSize) options.push('original');
    options.push(...SIZE_PRESETS);
    return options;
  };

  /**
   * 处理输入框变化，实时验证并应用
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numValue = parseInt(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleFocus = () => setIsOpen(true);
  const handleDropdownClick = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: number | string) => {
    const newValue = option === 'original' ? originalSize! : option as number;
    onChange(newValue);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // 点击外部关闭下拉
  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * 失焦时验证输入，无效时恢复
   */
  const handleBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setInputValue(value?.toString() || originalSize?.toString() || '');
    }
  };

  /**
   * 检查选项是否为当前选中值
   */
  const isSelected = (option: number | string): boolean => {
    const optionValue = option === 'original' ? originalSize : option;
    return optionValue === value;
  };

  const displayOptions = getOptions();

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="number"
          min={min}
          max={max}
          step="1"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent transition-shadow"
          placeholder={originalSize?.toString()}
        />
        <button
          type="button"
          onClick={handleDropdownClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && displayOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {displayOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleOptionClick(option)}
              className={`w-full px-3 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                isSelected(option)
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              {formatOptionText(option, originalSize)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
