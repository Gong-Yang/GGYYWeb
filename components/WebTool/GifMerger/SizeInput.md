# SizeInput 组件文档

## 概述

`SizeInput` 是一个智能的尺寸输入组件，结合了下拉选择和自由输入的功能，专为GIF合并工具的尺寸调整而设计。

## 特性

- ✅ **双模式输入**：支持键盘输入数字和下拉选择预设值
- 🔍 **智能筛选**：根据输入内容实时过滤预设选项
- 📐 **预设尺寸**：提供常用尺寸快速选择（32, 64, 128, 256, 512, 1024, 1080, 2048）
- 🔄 **原始尺寸**：自动显示"原大小"选项，方便一键恢复
- ✨ **用户友好**：点击外部自动关闭，输入验证，友好的错误处理
- 🌓 **深色模式**：完整支持明暗主题切换

## Props

```typescript
interface SizeInputProps {
  value: number | undefined;      // 当前值
  onChange: (value: number) => void;  // 值变化回调
  originalSize?: number;          // 原始尺寸（用于"原大小"选项）
  label: string;                  // 输入框标签
  min?: number;                   // 最小值（默认 1）
  max?: number;                   // 最大值（默认 10000）
}
```

## 使用示例

```tsx
import { SizeInput } from './SizeInput';

function MyComponent() {
  const [width, setWidth] = useState(800);
  
  return (
    <SizeInput
      label="宽度 (px)"
      value={width}
      onChange={setWidth}
      originalSize={800}
      min={1}
      max={10000}
    />
  );
}
```

## 预设选项

| 选项 | 显示文本 | 说明 |
|------|---------|------|
| 原大小 | `原大小 (XXXpx)` | 根据 originalSize 动态显示 |
| 32 | `32px` | 小图标尺寸 |
| 64 | `64px` | 中等图标尺寸 |
| 128 | `128px` | 大图标尺寸 |
| 256 | `256px` | 常规缩略图 |
| 512 | `512px` | 中等图片 |
| 1024 | `1024px` | 高清图片 |
| 1080 | `1080px` | Full HD高度 |
| 2048 | `2048px` | 2K分辨率 |

## 交互行为

### 下拉选择
1. 点击输入框右侧的下拉箭头
2. 显示所有预设选项
3. 点击选项即可应用

### 键盘输入
1. 聚焦到输入框
2. 直接输入数字
3. 自动筛选匹配的预设选项
4. 按下回车或失焦时验证并应用

### 智能筛选
- 输入 "10" → 显示 1024px, 1080px
- 输入 "原" → 显示 原大小选项
- 输入 "512" → 显示 512px

### 输入验证
- 超出范围的值会被重置为当前值或原始值
- 非数字输入会被忽略
- 提供视觉反馈和友好提示

## 样式定制

组件使用 Tailwind CSS 类名，可通过修改以下部分进行定制：

```tsx
// 输入框样式
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg ..."

// 下拉菜单样式
className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 ..."

// 选项样式
className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ..."
```

## 注意事项

1. **z-index**: 下拉菜单使用 `z-50`，确保不被其他元素遮挡
2. **外部点击**: 使用 `mousedown` 事件监听，在点击外部时关闭下拉
3. **失焦延迟**: 失焦时延迟200ms验证，避免与选项点击冲突
4. **数字类型**: 输入框使用 `type="number"`，但显示为字符串以支持空值

## 集成示例

在 `GifExporter.tsx` 中的使用：

```tsx
<SizeInput
  label="宽度 (px)"
  value={options.targetWidth}
  onChange={handleWidthChange}
  originalSize={originalWidth}
  min={1}
  max={10000}
/>
```

## 未来改进

- [ ] 添加键盘导航支持（上下键选择选项）
- [ ] 支持自定义预设列表
- [ ] 添加单位选择（px, %, em等）
- [ ] 支持范围滑块模式
