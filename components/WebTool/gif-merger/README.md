# GIF 合并工具

一个专业的在线 GIF 动画合并工具，支持多种合并模式和自定义设置。

## 功能特性

- **多文件上传**：支持同时上传多个 GIF 文件（最多 10 个）
- **两种合并模式**：
  - 平面合并：所有 GIF 同时显示在网格中
  - 连续合并：按顺序连续播放每个 GIF
- **透明背景支持**：自动检测并保持透明背景
- **自定义尺寸**：支持调整输出尺寸，可锁定宽高比
- **插值方式**：支持临近插值（像素风）和双线性插值（平滑）
- **拖拽排序**：可通过拖拽调整 GIF 合并顺序
- **实时预览**：支持帧调试模式查看每一帧

## 组件结构

```
GifMerger/
├── types.ts              # TypeScript 类型定义
├── GifMergerTool.tsx     # 主组件（协调所有子组件）
├── GifUploader.tsx       # 文件上传组件
├── GifExporter.tsx       # GIF 导出组件
├── FramePreview.tsx      # 帧预览组件
└── SizeInput.tsx         # 尺寸输入组件
```

## 技术栈

- **React**: UI 框架
- **Next.js**: 应用框架
- **TypeScript**: 类型安全
- **gifuct-js**: GIF 解析库
- **gif.js**: GIF 生成库
- **react-dropzone**: 文件拖拽上传

## 使用方法

```tsx
import { GifMergerTool } from '@/components/WebTool/GifMerger/GifMergerTool';

export default function Page() {
  return <GifMergerTool />;
}
```

## 主要优化

1. **代码简化**：
   - 提取工具函数到文件顶部
   - 简化重复的条件判断逻辑
   - 优化状态管理和事件处理

2. **性能优化**：
   - 使用 useCallback 优化回调函数
   - 减少不必要的重渲染
   - 优化大量帧数据的处理

3. **可维护性**：
   - 清晰的组件职责划分
   - 统一的代码风格
   - 完善的类型定义

4. **文件清理**：
   - 删除所有文档文件（.md）
   - 删除空文件和无用代码
   - 保持代码库整洁
