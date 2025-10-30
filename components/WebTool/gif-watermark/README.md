# GIF 水印工具

## 功能概述

GIF 批量加水印工具，支持为 GIF 图片添加图片水印和文字水印。

## 主要功能

### 1. GIF 文件上传
- 支持拖拽上传和点击选择
- 支持批量上传多个 GIF 文件
- 自动解析 GIF 帧数据

### 2. 水印管理
- **图片水印**：支持上传 PNG、JPG 等图片格式作为水印
- **文字水印**：支持添加自定义文字水印

### 3. 水印编辑
- **位置调整**：通过拖拽或输入坐标调整水印位置
- **尺寸调整**：调整水印大小（图片水印）
- **旋转控制**：0-360度旋转
- **不透明度**：0-100% 透明度调整
- **层级设置**：水印可设置在 GIF 上方或下方
- **文字样式**：字体大小、颜色、粗细、斜体（文字水印）

### 4. 实时预览
- 在画布上实时预览水印效果
- 显示选中水印的边框提示
- 支持鼠标拖拽调整水印位置

### 5. 批量导出
- 支持批量导出所有 GIF
- 支持选择性导出部分 GIF
- 显示导出进度
- 导出完成后可预览和下载

## 组件结构

```
GifWatermark/
├── types.ts                    # 类型定义
├── GifWatermarkTool.tsx        # 主组件
├── WatermarkUploader.tsx       # 水印图片上传组件
├── WatermarkCanvas.tsx         # 水印预览画布
├── WatermarkControls.tsx       # 水印属性控制面板
├── WatermarkExporter.tsx       # 导出组件
└── README.md                   # 说明文档
```

## 使用方法

### 基本使用

```tsx
import { GifWatermarkTool } from '@/components/WebTool/GifWatermark/GifWatermarkTool'

export default function Page() {
  return <GifWatermarkTool />
}
```

## 技术实现

### 依赖库
- `gifuct-js`: GIF 文件解析
- `gif.js`: GIF 文件生成
- `react-dropzone`: 文件拖拽上传

### 核心技术
- Canvas API: 图像渲染和水印合成
- Web Workers: 异步 GIF 生成
- React Hooks: 状态管理

## 样式规范

遵循项目黑白灰配色规范：
- 浅色模式：白色背景 + 黑色文字
- 深色模式：黑色背景 + 白色文字
- 辅助色：灰色阶梯

## 性能优化

- 图片水印预加载和缓存
- Canvas 渲染优化
- Worker 异步处理避免阻塞主线程

## 注意事项

1. 单个 GIF 文件建议不超过 50MB
2. 水印图片建议不超过 10MB
3. 导出大量 GIF 时可能需要较长时间
4. 浏览器需支持 Canvas API 和 Web Workers
