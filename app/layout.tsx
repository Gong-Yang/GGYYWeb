import "styles/tailwind.css"

import type { Metadata } from 'next'
import Script from "next/script"

export const metadata: Metadata = {
  title: {
    default: 'WebTool - 在线工具集合',
    template: '%s | WebTool'
  },
  description: '免费在线工具集合，包括GIF合成、图片处理、文本工具等实用功能',
  keywords: ['在线工具', 'GIF制作', '图片处理', '文本工具', '免费工具'],
  authors: [{ name: 'WebTool' }],
  creator: 'WebTool',
  publisher: 'WebTool',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://webtool.chaiyi.fun'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://webtool.chaiyi.fun',
    title: 'WebTool - 在线工具集合',
    description: '免费在线工具集合，包括GIF合成、图片处理、文本工具等实用功能',
    siteName: 'WebTool',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebTool - 在线工具集合',
    description: '免费在线工具集合，包括GIF合成、图片处理、文本工具等实用功能',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 添加搜索引擎验证标签
    google: '2f8a254096e7d7f6',
    other: {
      'baidu-site-verification': '4f075dde2fc5a24f72f76ca64d4d07e6',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        {
          <Script
            id="baidu-tongji"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                var _hmt = _hmt || [];
                (function() {
                  var hm = document.createElement("script");
                  hm.src = "https://hm.baidu.com/hm.js?8321bd2330a998d38ae818a752a803f8";
                  var s = document.getElementsByTagName("script")[0];
                  s.parentNode.insertBefore(hm, s);
                })();
              `,
            }}
          />
        }
      </head>
      <body className="flex flex-col min-h-screen">
        <main className="flex-1 ">{children}</main>
      </body>
    </html>
  )
}
