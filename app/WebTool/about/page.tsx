import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于我们 - WebTool',
  description: 'WebTool 是一个专业的在线工具集合平台',
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            关于 WebTool
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                我们的使命
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                WebTool 致力于为用户提供最便捷、高效的在线工具服务。我们相信优秀的工具能够大大提升工作效率，让复杂的任务变得简单。
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                核心价值
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>高性能：</strong>采用最新的技术栈，确保工具运行流畅</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>隐私安全：</strong>所有处理都在本地完成，保护您的数据安全</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>易于使用：</strong>简洁直观的界面设计，无需学习即可上手</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>持续创新：</strong>不断推出新工具，满足用户多样化需求</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                技术栈
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                WebTool 基于现代化的 Web 技术构建：
              </p>
              <ul className="grid grid-cols-2 gap-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                  Next.js 15
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                  React 19
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                  TypeScript
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                  Tailwind CSS
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
