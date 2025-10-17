import { useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "../Button/Button"

export interface ModalProps {
  /** 是否显示模态框 */
  isOpen: boolean
  /** 关闭模态框的回调 */
  onClose: () => void
  /** 标题 */
  title?: string
  /** 内容 */
  children?: React.ReactNode
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认按钮回调 */
  onConfirm?: () => void
  /** 取消按钮回调 */
  onCancel?: () => void
  /** 是否显示底部按钮区域 */
  showFooter?: boolean
  /** 是否点击遮罩层关闭 */
  closeOnOverlayClick?: boolean
  /** 自定义类名 */
  className?: string
  /** 内容区域自定义类名 */
  contentClassName?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  showFooter = true,
  closeOnOverlayClick = true,
  className,
  contentClassName,
}: ModalProps) {
  // 锁定背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // ESC键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/60 transition-opacity duration-300"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={twMerge(
          "relative w-full max-w-md mx-4",
          "bg-white dark:bg-black",
          "border border-gray-300 dark:border-gray-600",
          "rounded-xl shadow-lg",
          "animate-[modalSlideIn_0.3s_ease-out]",
          className
        )}
      >
        <div className="flex gap-4 p-6">
          {/* 左侧图标 */}
          <div className="flex-shrink-0">
            <span className="flex items-center justify-center w-12 h-12 border-2 border-black dark:border-white rounded-full">
              <svg
                className="w-6 h-6 text-black dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1 min-w-0">
            {/* 标题 */}
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-black dark:text-white mb-3"
              >
                {title}
              </h2>
            )}

            {/* 内容 */}
            <div
              className={twMerge(
                "text-sm text-gray-600 dark:text-gray-400 leading-relaxed",
                contentClassName
              )}
            >
              {children}
            </div>

            {/* 底部按钮区域 */}
            {showFooter && (confirmText || cancelText) && (
              <div className="flex items-center gap-3 mt-6">
                {cancelText && (
                  <Button
                    intent="muted"
                    size="sm"
                    onClick={handleCancel}
                    className="min-w-20 border-gray-300 dark:border-gray-600"
                  >
                    {cancelText}
                  </Button>
                )}
                {confirmText && (
                  <Button
                    intent="muted"
                    size="sm"
                    onClick={handleConfirm}
                    className="min-w-20 border-gray-300 dark:border-gray-600"
                  >
                    {confirmText}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
