import { Metadata } from "next"
import Link from "next/link"

import { Button } from "components/Button/Button"

export const metadata: Metadata = {
  title: "WebTool - 实用工具集合",
  description: "一个基于 Next.js 的实用工具集合，提供各种便捷的在线工具",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    title: "WebTool - 实用工具集合",
    description: "一个基于 Next.js 的实用工具集合，提供各种便捷的在线工具",
    type: "website",
  },
}

// 工具列表配置
const TOOLS = [
  {
    id: "gif-merger",
    name: "GIF 工具",
    description: "GIF加水印、将多个 GIF 文件平面合并 或者 连续播放，支持自定义帧率和尺寸调整",
    href: "/gif-merger",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    status: "available" as const,
  },
  {
    id: "image-converter",
    name: "图片格式转换",
    description: "支持 JPG、PNG、WebP 等多种格式之间的相互转换",
    href: "/image-converter",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    status: "coming-soon" as const,
  },
  {
    id: "qr-generator",
    name: "二维码生成器",
    description: "快速生成各种类型的二维码，支持文本、链接、WiFi 等",
    href: "/qr-generator",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4v1m6 11h1M6 15H5m11-10h3m-3 3v3m-3-6V4m-3 6v6m-6-6v6m3-3v3"
        />
      </svg>
    ),
    status: "coming-soon" as const,
  },
  {
    id: "json-formatter",
    name: "JSON 格式化工具",
    description: "JSON 数据的格式化、压缩和验证工具",
    href: "/json-formatter",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    status: "coming-soon" as const,
  },
  {
    id: "color-picker",
    name: "颜色选择器",
    description: "颜色选择和格式转换工具，支持 HEX、RGB、HSL 等格式",
    href: "/color-picker",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z"
        />
      </svg>
    ),
    status: "coming-soon" as const,
  },
  {
    id: "text-tools",
    name: "文本处理工具",
    description: "文本编码、解码、大小写转换等常用文本处理功能",
    href: "/text-tools",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    status: "coming-soon" as const,
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white min-h-[calc(100vh-160px)] flex items-center justify-center dark:bg-gray-900 ">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 text-4xl leading-none font-extrabold tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              WebTool
            </h1>
            <p className="mb-2 text-xl font-semibold text-blue-600 dark:text-blue-400">
              实用工具集合
            </p>
            <p className="mb-6 max-w-2xl mx-auto font-light text-gray-500 md:text-lg lg:mb-8 lg:text-xl dark:text-gray-400">
              基于 Next.js 构建的现代化工具集合，提供各种便捷的在线工具。
              <br />
              高性能、响应式设计，随时随地满足您的工具需求。
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <Button href="#tools" className="scroll-smooth">
                浏览工具
              </Button>
              <Button href="/gif-merger" intent="secondary">
                体验 GIF 合并工具
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="bg-gray-50 min-h-screen dark:bg-gray-800">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="mb-8 text-center lg:mb-12">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl dark:text-white">
              工具集合
            </h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              精心挑选的实用工具，帮助您提高工作效率
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <div key={tool.id} className="group relative">
                {tool.status === "available" ? (
                  <Link
                    href={tool.href}
                    className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        {tool.icon}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                        可用
                      </span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      {tool.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {tool.description}
                    </p>
                  </Link>
                ) : (
                  <div className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm opacity-60 dark:border-gray-700 dark:bg-gray-900">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600">
                        {tool.icon}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        即将推出
                      </span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      {tool.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {tool.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="mb-8 text-center lg:mb-12">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl dark:text-white">
              为什么选择 WebTool？
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                高性能
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                优秀的性能表现，快速响应您的操作
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                隐私安全
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                无需担心数据传输隐私安全
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                易于使用
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                简洁直观的界面设计
              </p>
            </div>
          </div>
        </div>
      </section>
    
    </>
  )
}
