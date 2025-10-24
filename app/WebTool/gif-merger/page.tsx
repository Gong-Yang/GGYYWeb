import type { Metadata } from 'next';

import { GifMergerTool } from '@/components/WebTool/GifMerger/GifMergerTool';

export const metadata: Metadata = {
  title: 'GIF处理工具 - 在线多GIF动画合并编辑器 | WebTool',
  description: '专业的在线GIF处理工具，使用gifuct-js和gif.js技术精确解析和生成GIF动画。支持多个GIF文件合并、透明背景、网格布局，保持原始动画效果和时序同步。',
  keywords: 'GIF合并,GIF编辑,动图合并,在线工具,gif.js,gifuct-js,透明背景,动画合并',
  openGraph: {
    title: 'GIF处理工具 - 专业在线GIF动画合并',
    description: '使用先进的gif.js技术，精确合并多个GIF动画，支持透明背景',
    type: 'website',
    images: [{ url: '/images/gif-merger-preview.jpg', width: 1200, height: 630, alt: 'GIF处理工具预览' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF处理工具 - 专业在线GIF动画合并',
    description: '使用先进的gif.js技术，精确合并多个GIF动画'
  }
};

export default function GifMergerPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            GIF合并工具
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            在线合并多个GIF动画，支持透明背景和时序同步
          </p>
        </div>
        <GifMergerTool />
      </div>
    </div>
  );
}