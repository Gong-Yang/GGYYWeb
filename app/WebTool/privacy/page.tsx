import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '隐私政策 - WebTool',
  description: 'WebTool 隐私政策',
};

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            隐私政策
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              本页面正在建设中。WebTool 非常重视用户隐私保护。
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">
              数据处理说明
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              所有文件处理均在您的浏览器本地完成，不会上传到任何服务器。我们不会收集、存储或分享您的个人文件。
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← 返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
