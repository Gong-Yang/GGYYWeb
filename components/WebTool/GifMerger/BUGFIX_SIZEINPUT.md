# SizeInput 组件 Bug 修复报告

## 修复时间
2025-10-22

## 问题概述

SizeInput 组件存在两个严重的逻辑问题，影响了用户体验和功能正确性。

---

## 问题 1：下拉框显示逻辑错误

### 问题描述
- **期望行为**：用户每次点击下拉框时应显示所有预设选项，并标出当前选中项
- **实际问题**：点击下拉框后显示的是经过筛选的选项，而不是完整列表

### 问题原因
```typescript
// 旧代码 - 问题所在
const handleFocus = () => {
  setFilteredOptions(filterOptions(inputValue)); // ❌ 总是根据 inputValue 筛选
  setIsOpen(true);
};
```

当用户点击下拉框时，如果输入框中有值（如"800"），`filterOptions(inputValue)` 会根据这个值进行筛选，导致只显示包含"800"的选项。

### 修复方案
引入 `isTyping` 状态标记，区分"用户输入"和"点击下拉框"两种场景：

```typescript
// 新代码 - 修复后
const [isTyping, setIsTyping] = useState(false);

// 仅在用户输入时筛选
const getFilteredOptions = () => {
  const allOptions = getOptions();
  
  if (!isTyping || !inputValue) {
    return allOptions; // ✅ 显示所有选项
  }
  
  return allOptions.filter(/* 筛选逻辑 */);
};

// 点击下拉按钮时
const handleDropdownClick = () => {
  setIsTyping(false); // ✅ 重置输入状态，显示所有选项
  setIsOpen(!isOpen);
};

// 聚焦时
const handleFocus = () => {
  setIsTyping(false); // ✅ 显示所有选项
  setIsOpen(true);
};

// 用户输入时
const handleInputChange = (e) => {
  setInputValue(e.target.value);
  setIsTyping(true); // ✅ 标记正在输入，启用筛选
  setIsOpen(true);
};
```

### 修复效果
- ✅ 点击下拉箭头：显示所有预设选项（9个）
- ✅ 聚焦输入框：显示所有预设选项
- ✅ 开始输入时：根据输入内容动态筛选
- ✅ 当前选中项高亮显示（深色背景 + 加粗）

---

## 问题 2：选项点击后数值设置错误

### 问题描述
- **重现步骤**：点击下拉框中的"256"选项
- **期望结果**：输入框显示"256"
- **实际问题**：输入框最终显示"6"（明显错误）

### 问题原因

#### 根本原因：输入过程中立即触发 onChange
```typescript
// 旧代码 - 问题所在
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  setInputValue(newValue);
  
  const numValue = parseInt(newValue);
  if (!isNaN(numValue) && numValue >= min && numValue <= max) {
    onChange(numValue); // ❌ 每次输入都立即调用
  }
};
```

#### 问题分析：
当用户输入"256"时：
1. 输入 "2" → `onChange(2)` 被调用
2. 输入 "5" → `onChange(25)` 被调用  
3. 输入 "6" → `onChange(256)` 被调用

但由于：
- React 状态更新是异步的
- 父组件的 [handleWidthChange](file://d:\YYData\code\WebTool\components\WebTool\GifMerger\GifExporter.tsx#L323-L335) 可能在处理比例锁定
- 多次快速调用可能导致状态不一致

最终可能只有最后一个字符"6"被正确处理。

### 修复方案

#### 方案：延迟调用 onChange，仅在用户完成输入后提交

```typescript
// 新代码 - 修复后
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  setInputValue(newValue);
  setIsTyping(true);
  setIsOpen(true);
  
  // ❌ 删除：不再立即调用 onChange
  // onChange 将在失焦或选择选项时调用
};

// 失焦时验证并提交
const handleBlur = () => {
  setTimeout(() => {
    setIsTyping(false);
    
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue); // ✅ 仅在验证通过后调用一次
    } else {
      setInputValue(value?.toString() || originalSize?.toString() || '');
    }
  }, 200);
};

// 点击选项时直接提交
const handleOptionClick = (option: number | string) => {
  const newValue = option === 'original' ? originalSize! : option as number;
  setInputValue(newValue.toString());
  onChange(newValue); // ✅ 点击选项时立即提交正确的值
  setIsOpen(false);
  inputRef.current?.blur();
};
```

### 修复效果
- ✅ 点击"256"选项 → 输入框正确显示"256"
- ✅ 手动输入"256" → 失焦后正确提交"256"
- ✅ 避免了输入过程中的中间值（2、25）被提交
- ✅ 状态更新更加可靠和可预测

---

## 额外改进

### 1. 防止下拉菜单与失焦冲突

**问题**：点击下拉选项时，可能先触发 input 的 blur 事件，导致下拉菜单关闭

**解决**：
```typescript
// 下拉按钮
<button
  onMouseDown={(e) => e.preventDefault()} // ✅ 防止触发 blur
  onClick={handleDropdownClick}
>

// 选项按钮
<button
  onMouseDown={(e) => e.preventDefault()} // ✅ 防止触发 blur
  onClick={() => handleOptionClick(option)}
>
```

### 2. 当前选中项高亮显示

**实现**：
```typescript
const isSelected = (option: number | string) => {
  const optionValue = option === 'original' ? originalSize : option;
  return optionValue === value;
};

<button
  className={`... ${
    selected 
      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium' 
      : 'hover:bg-gray-100 dark:hover:bg-gray-700 ...'
  }`}
>
```

**效果**：
- ✅ 当前值在下拉列表中高亮显示（深色背景）
- ✅ 非当前值显示浅色背景，悬停时高亮
- ✅ 完整支持深色模式

---

## 测试场景

### 场景 1：点击下拉框选择预设值
1. ✅ 点击下拉箭头
2. ✅ 显示所有9个选项
3. ✅ 当前值高亮显示
4. ✅ 点击"256"
5. ✅ 输入框显示"256"
6. ✅ 值正确应用

### 场景 2：手动输入自定义值
1. ✅ 聚焦输入框
2. ✅ 显示所有选项
3. ✅ 输入"1500"
4. ✅ 下拉列表为空（无匹配）
5. ✅ 失焦时值正确应用"1500"

### 场景 3：输入时动态筛选
1. ✅ 聚焦输入框
2. ✅ 输入"10"
3. ✅ 显示筛选结果：1024px, 1080px
4. ✅ 点击"1024"
5. ✅ 输入框显示"1024"

### 场景 4：输入"原"搜索原大小
1. ✅ 聚焦输入框
2. ✅ 输入"原"
3. ✅ 显示："原大小 (800px)"
4. ✅ 点击选择
5. ✅ 恢复到原始尺寸

### 场景 5：宽高比锁定联动
1. ✅ 点击宽度下拉框选择"512"
2. ✅ 高度自动按比例调整
3. ✅ 两个输入框值正确同步

---

## 代码质量

### 改进点
- ✅ 清晰的状态管理（`isTyping` 标记）
- ✅ 避免不必要的 `onChange` 调用
- ✅ 更好的事件处理（防止冲突）
- ✅ 用户反馈更及时（选中项高亮）
- ✅ 逻辑更清晰易懂

### 性能优化
- ✅ 减少了父组件的重渲染次数
- ✅ 避免了多次不必要的状态更新
- ✅ 事件处理更高效

---

## 总结

### 修复前的问题
1. ❌ 点击下拉框不显示完整选项列表
2. ❌ 点击"256"最终显示"6"
3. ❌ 输入过程中触发多次 onChange

### 修复后的效果
1. ✅ 点击下拉框显示所有预设选项
2. ✅ 当前选中项高亮显示
3. ✅ 点击选项正确设置数值
4. ✅ 手动输入时智能筛选
5. ✅ 仅在完成输入后提交值
6. ✅ 状态更新可靠且可预测

### 核心改进
- **智能筛选**：通过 `isTyping` 标记区分场景
- **延迟提交**：避免输入过程中的中间值
- **事件优化**：防止 blur 与点击冲突
- **视觉反馈**：高亮显示当前选中项

修复后的组件更加健壮、可靠，用户体验显著提升！
