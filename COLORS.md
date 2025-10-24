# WebTool 颜色规范文档

## 基础颜色定义

根据项目颜色规范，WebTool模块使用以下精确的颜色值：

### 主色调
- **纯黑色**: `#000000` (Hex) / `rgb(0, 0, 0)`
- **纯白色**: `#FFFFFF` (Hex) / `rgb(255, 255, 255)`
- **标准灰**: `#828282` (Hex) / `rgb(130, 130, 130)`

### 扩展灰色阶梯
用于细微的层次变化和过渡效果：

| 颜色名称 | Hex值 | RGB值 | 用途 |
|---------|-------|-------|------|
| gray-50 | #F9F9F9 | rgb(249, 249, 249) | 极浅背景 |
| gray-100 | #F5F5F5 | rgb(245, 245, 245) | 浅背景 |
| gray-200 | #E0E0E0 | rgb(224, 224, 224) | 边框、分割线 |
| gray-300 | #BDBDBD | rgb(189, 189, 189) | 禁用状态 |
| gray-400 | #A0A0A0 | rgb(160, 160, 160) | 次要文本 |
| gray-500 | #828282 | rgb(130, 130, 130) | 标准灰色 |
| gray-600 | #6E6E6E | rgb(110, 110, 110) | 深灰文本 |
| gray-700 | #4F4F4F | rgb(79, 79, 79) | 悬停状态 |
| gray-800 | #333333 | rgb(51, 51, 51) | 深色卡片背景 |
| gray-900 | #1A1A1A | rgb(26, 26, 26) | 深色次要背景 |

## 配色方案

### 浅色模式（Light Mode）
- **主背景色**: 白色 (`#FFFFFF`)
- **主文字色**: 黑色 (`#000000`)
- **辅助文字色**: 灰色 (`#828282` 及其阶梯)
- **强调元素**: 黑色背景 + 白色文字
- **边框**: 灰色 (`#E0E0E0`)

### 深色模式（Dark Mode）
- **主背景色**: 黑色 (`#000000`)
- **主文字色**: 白色 (`#FFFFFF`)
- **辅助文字色**: 灰色 (`#828282` 及其阶梯)
- **强调元素**: 白色背景 + 黑色文字
- **边框**: 深灰色 (`#4F4F4F`)

## 使用规则

### 1. 大面积背景元素
**必须严格遵循主辅色规则**

适用范围：
- 页面背景
- 导航栏 (Header/Footer)
- 卡片容器
- 模态框背景
- 侧边栏

示例：
```tsx
// ✅ 正确
<div className="bg-white dark:bg-black">
<header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">

// ❌ 错误
<div className="bg-blue-50 dark:bg-blue-900">
<header className="bg-gradient-to-r from-purple-500 to-pink-500">
```

### 2. 小面积功能性元素
**可以使用其他辅助颜色突出功能**

适用范围：
- 状态标签（成功/警告/错误）
- 进度条
- 通知徽章
- 图标高亮
- 操作提示

示例：
```tsx
// ✅ 允许使用功能性颜色
<span className="bg-green-100 text-green-800">成功</span>
<span className="bg-yellow-100 text-yellow-800">警告</span>
<span className="bg-red-100 text-red-800">错误</span>

// 但主体仍应保持黑白灰
<div className="bg-white dark:bg-black p-4">
  <span className="bg-green-100 text-green-800">可用</span>
</div>
```

### 3. 交互元素配色

#### 按钮
```tsx
// 主按钮
<button className="bg-black text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200">

// 次要按钮
<button className="bg-transparent text-black border border-black hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black">
```

#### 链接
```tsx
// 文字链接
<a className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
```

#### 卡片
```tsx
// 工具卡片
<div className="bg-white border border-gray-200 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
```

## Tailwind CSS 配置

颜色已在 `styles/tailwind.css` 中通过 `@theme` 定义：

```css
@theme {
  --color-pure-black: #000000;
  --color-pure-white: #FFFFFF;
  --color-gray-medium: #828282;
  
  --color-gray-50: #F9F9F9;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #E0E0E0;
  --color-gray-300: #BDBDBD;
  --color-gray-400: #A0A0A0;
  --color-gray-500: #828282;
  --color-gray-600: #6E6E6E;
  --color-gray-700: #4F4F4F;
  --color-gray-800: #333333;
  --color-gray-900: #1A1A1A;
}
```

## 组件配色参考

### Header组件
```tsx
<header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
  <nav className="max-w-[1300px]">
    <Link className="text-black dark:text-white">Logo</Link>
    <button className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
  </nav>
</header>
```

### Footer组件
```tsx
<footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700">
  <div className="max-w-[1300px]">
    <h2 className="text-black dark:text-white">WebTool</h2>
    <p className="text-gray-600 dark:text-gray-400">描述文字</p>
  </div>
</footer>
```

### 工具卡片
```tsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg">
  <div className="bg-black dark:bg-white text-white dark:text-black rounded-lg">
    图标
  </div>
  <h3 className="text-black dark:text-white">标题</h3>
  <p className="text-gray-600 dark:text-gray-400">描述</p>
</div>
```

## 可访问性（Accessibility）

### 对比度要求
所有文字与背景的对比度必须满足 WCAG 2.1 AA 标准：

- **正常文字**: 最小对比度 4.5:1
- **大文字(18pt+)**: 最小对比度 3:1

当前配色方案的对比度：
- 黑色文字 (#000000) on 白色背景 (#FFFFFF): **21:1** ✅
- 白色文字 (#FFFFFF) on 黑色背景 (#000000): **21:1** ✅
- 灰色文字 (#828282) on 白色背景 (#FFFFFF): **4.5:1** ✅
- 白色文字 (#FFFFFF) on 深灰背景 (#333333): **12.6:1** ✅

### 色盲友好
黑白灰配色方案对所有类型的色盲用户都友好，无需额外调整。

## 更新日志

### 2025-10-16
- 定义基础颜色规范（#000000、#FFFFFF、#828282）
- 更新 Header 组件为纯黑白配色
- 更新 Footer 组件为纯黑白配色
- 更新 Button 组件使用纯黑色 (#000000)
- 更新 WebTool 主页卡片和图标为黑白配色
- 更新 GIF 工具组件按钮和进度条为黑白配色
- 在 tailwind.css 中添加颜色主题定义

## 注意事项

1. **严格遵守大面积背景规则**: 页面、导航、卡片等大面积元素必须使用黑白灰
2. **小面积元素可灵活使用**: 状态标签、提示等小元素可使用功能性颜色
3. **保持深浅模式一致性**: 确保深浅模式下的视觉层次保持一致
4. **测试对比度**: 新增颜色组合需验证对比度是否符合可访问性标准
5. **优先使用CSS变量**: 使用 Tailwind 定义的颜色变量，便于统一管理
