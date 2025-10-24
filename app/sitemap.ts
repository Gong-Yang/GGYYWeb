import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://webtool.chaiyi.fun';
  const now = new Date();

  return [
    // 主页
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Home页面
    {
      url: `${baseUrl}/Home`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // WebTool工具集合主页
    {
      url: `${baseUrl}/WebTool`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // GIF工具
    {
      url: `${baseUrl}/WebTool/gif-merger`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/WebTool/gif-watermark`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/WebTool/video-to-gif`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // 对象比较工具
    {
      url: `${baseUrl}/WebTool/obj-comparison`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // 认证相关页面
    {
      url: `${baseUrl}/Auth/login`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/Auth/register`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
