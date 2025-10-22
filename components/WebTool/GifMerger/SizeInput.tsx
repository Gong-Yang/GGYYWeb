'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SizeInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
  originalSize?: number;
  label: string;
  min?: number;
  max?: number;
}

const SIZE_PRESETS = [32, 64, 128, 256, 512, 1024, 1080, 2048];

export function SizeInput({ 
  value, 
  onChange, 
  originalSize, 
  label,
  min = 1,
  max = 10000
}: SizeInputProps) {
  const [inputValue, setInputValue] = useState<string>(value?.toString() || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 更新输入值当外部value变化时
  useEffect(() => {
    setInputValue(value?.toString() || '');
  }, [value]);

  // 生成选项列表（包括原大小）
  const getOptions = () => {
    const options: Array<number | string> = [];
    if (originalSize) {
      options.push('original');
    }
    options.push(...SIZE_PRESETS);
    return options;
  };

  // 处理输入变化（实时计算宽高）
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // 实时验证并应用输入值
    const numValue = parseInt(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue); // 立即触发宽高比计算
    }
  };

  // 处理聚焦
  const handleFocus = () => {
    setIsOpen(true);
  };
  
  // 处理下拉按钮点击
  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  // 处理选项点击
  const handleOptionClick = (option: number | string) => {
    const newValue = option === 'original' ? originalSize! : option as number;
    onChange(newValue); // 先调用 onChange
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 处理失焦
  const handleBlur = () => {
    // 验证输入值
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      // 如果无效，恢复到当前值或原大小
      setInputValue(value?.toString() || originalSize?.toString() || '');
    }
  };

  // 检查选项是否为当前选中值
  const isSelected = (option: number | string) => {
    const optionValue = option === 'original' ? originalSize : option;
    return optionValue === value;
  };
  
  // 格式化显示文本
  const getDisplayText = (option: number | string) => {
    if (option === 'original') {
      return `原大小 (${originalSize}px)`;
    }
    return `${option}px`;
  };
  
  // 获取要显示的选项列表（不再筛选）
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

      {/* 下拉选项列表 */}
      {isOpen && displayOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {displayOptions.map((option, index) => {
            const selected = isSelected(option);
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  selected 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {getDisplayText(option)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
