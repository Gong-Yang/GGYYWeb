'use client';

import Link from 'next/link';
import router from 'next/router';

import { useEffect, useRef, useState } from 'react';

interface Tool {
  name: string;
  href: string;
  description: string;
  comingSoon: boolean;
}

interface NavCategory {
  id: string;
  name: string;
  href: string;
  tools: Tool[]; 
}


// 工具分类配置
const TOOL_CATEGORIES : NavCategory[] = [
  {
    id: 'Home',
    name: 'Home',
    href:'/Home',
    tools: [],
  },
  {
    id: 'product',
    name: '产品集合页',
    href:'',
    tools: [
      { name: 'WebTool', href: '/WebTool', description: '一个无需注册、数据本地处理的在线工具箱', comingSoon: false },
      { name: '无', href: '', description: '压缩视频文件', comingSoon: true },
    ],
  },
  {
    id: 'about',
    name: '关于我们',
    href:'/about',
    tools: [],
  },
  {
    id: 'support',
    name: '支持',
    href:'/support',
    tools: [],
  }
];

export function Header() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedNav, setSelectedNav] = useState<string>('Home'); // 默认选中Home
  const headerRef = useRef<HTMLElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };

    if (activeCategory) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeCategory]);

  // 点击导航栏
  const handleClick = (category:NavCategory)=>{
    const { id, href, tools } = category;
    // 设置选中状态
    setSelectedNav(id);
    
    if(tools.length<=0){
      // 无下拉：关闭下拉菜单，并导航
      setActiveCategory(null)
      setTimeout(() => router.push(href), 0);
      // router.push(href)
      
    }else{
      // 有下拉：切换当前下拉状态
      setActiveCategory(activeCategory === id ? null : id)
    }
  }

  return (
    <>
      {/* 半透明遮罩 */}
      {activeCategory && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={() => setActiveCategory(null)}
        />
      )}

      <header 
        ref={headerRef}
        className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-black dark:border-gray-700"
      >
        <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 font-black">
            {/* Logo */}
            <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-black dark:text-white">
                    GGYY NET
                  </span>
                </Link>
            </div>

            {/* 工具分类导航 */}
            <div className="hidden md:flex items-center space-x-1">
              {TOOL_CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className="relative"
                >
                  <button
                    onClick={()=>handleClick(category)}
                    className="relative px-4 py-2 text-sm flex items-center gap-1 transition-colors duration-300"
                    style={{
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {/* 选中状态的黑色背景按钮 */}
                    <span 
                      className="absolute inset-0 bg-black dark:bg-white rounded transition-all duration-300"
                      style={{
                        transform: selectedNav === category.id ? 'scale(1)' : 'scale(0.8)',
                        opacity: selectedNav === category.id ? 1 : 0,
                        animation: selectedNav === category.id ? 'bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
                      }}
                    />
                    
                    <span className={`relative z-10 transition-colors duration-300 ${
                      selectedNav === category.id 
                        ? 'text-white dark:text-black' 
                        : 'text-black dark:text-white'
                    }`}>
                      {category.name}
                    </span>

                    {/* 下拉箭头图标 */}
                    {
                      category.tools.length > 0 &&(
                        <svg
                            className={`relative z-10 w-4 h-4 transition-all duration-200 ${
                              activeCategory === category.id ? 'rotate-180' : ''
                            } ${
                              selectedNav === category.id 
                                ? 'text-white dark:text-black' 
                                : 'text-black dark:text-white'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>  
                      )
                    }
                  </button>

                  {/* 下拉菜单 - 参考 Figma 风格：全宽、无圆角 */}
                  {activeCategory === category.id && (
                    <div className="fixed left-0 right-0 top-[64px] bg-white dark:bg-black shadow-lg border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {category.tools.map((tool) => (
                            <Link
                              key={tool.href}
                              href={tool.comingSoon ? '#' : tool.href}
                              className={`group block p-4  ${
                                tool.comingSoon ? 'opacity-60 cursor-not-allowed' : ''
                              }`}
                              onClick={(e) => {
                                if (tool.comingSoon) {
                                  e.preventDefault();
                                } else {
                                  setActiveCategory(null);
                                }
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="text-base font-semibold text-gray-900 dark:text-white mb-1 relative inline-block ">
                                    {tool.name}
                                      <span 
                                        className="absolute left-0 right-0 h-px bg-gray-900 dark:bg-white transform origin-left transition-all duration-300 ease-out bottom-[-8px] opacity-0 group-hover:bottom-[-4px] group-hover:opacity-100"
                                      />
                                  </div>
                                  <div className="text-sm mt-3 text-gray-600 dark:text-gray-400">
                                    {tool.description}
                                  </div>
                                </div>
                                {tool.comingSoon && (
                                  <span className="ml-3 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700 rounded">
                                    即将推出
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        {/* 移动端菜单 */}
        <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 mt-2">
          <div className="space-y-2">
            {TOOL_CATEGORIES.map((category) => (
              <div key={category.id}>
                <button
                  onClick={()=>handleClick(category)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md"
                >
                  {category.name}

                  {
                    category.tools.length > 0 && (
                      <svg
                        className={`w-4 h-4 transition-transform ${activeCategory === category.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )
                  }
                  
                </button>
                {activeCategory === category.id && (
                  <div className="mt-1 ml-4 space-y-1">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.comingSoon ? '#' : tool.href}
                        className={`block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 rounded-md ${
                          tool.comingSoon ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                        onClick={(e) => {
                          if (tool.comingSoon) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {tool.name}
                        {tool.comingSoon && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            即将推出
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
    </>
  );
}
