import { GifMergerTool } from '@/components/GifMerger/GifMergerTool';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GIF合并工具 - 在线多GIF动画合并编辑器 | WebTool',
  description: '专业的在线GIF合并工具，使用gifuct-js和gif.js技术精确解析和生成GIF动画。支持多个GIF文件合并、透明背景、网格布局，保持原始动画效果和时序同步。',
  keywords: 'GIF合并,GIF编辑,动图合并,在线工具,gif.js,gifuct-js,透明背景,动画合并',
  openGraph: {
    title: 'GIF合并工具 - 专业在线GIF动画合并',
    description: '使用先进的gif.js技术，精确合并多个GIF动画，支持透明背景和时序同步',
    type: 'website',
    images: [{
      url: '/images/gif-merger-preview.jpg',
      width: 1200,
      height: 630,
      alt: 'GIF合并工具预览'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF合并工具 - 专业在线GIF动画合并',
    description: '使用先进的gif.js技术，精确合并多个GIF动画'
  }
};

export default function GifMergerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GIF合并工具
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            精确解析和合并多个GIF动画文件。支持透明背景、网格布局和时序同步，
            保持原始动画效果。
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">精确帧解析</span>
            <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">透明背景支持</span>
            <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">时序同步</span>
            <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">标准GIF输出</span>
          </div>
        </div>
        
        <GifMergerTool />
        
        {/* SEO内容区域 */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              关于GIF合并工具
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">核心特性</h3>
                <ul className="space-y-2">
                  <li>• 保持原始动画时序和帧延迟</li>
                  <li>• 支持透明、白色、黑色背景</li>
                  <li>• 智能网格布局自动排列</li>
                  <li>• 以最长GIF为播放周期</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">技术优势</h3>
                <ul className="space-y-2">
                  <li>• 生成标准GIF格式文件</li>
                  <li>• 完整保留动画特性</li>
                  <li>• 跨平台兼容性</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}