"use client"

import { useState } from "react"
import { Input } from "@/components/general/Input/Input"
import { Button } from "@/components/general/Button/Button"
import { Modal } from "@/components/general/Modal/Modal"

export default function RegisterPage() {
  const [step, setStep] = useState<number>(1) // 当前步骤
  const [nickname, setNickname] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  //错误信息
  const [errorEmail, setErrorEmail] = useState<string>("") 
  const [errorNickname, setErrorNickname] = useState<string>("")  

  const [submitButton,setSubmitButton] = useState<string>("发起验证")  // 提交按钮的文字  发起验证  处理中...  已发送邮件
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showEmailSentModal, setShowEmailSentModal] = useState<boolean>(false) // 邮件发送成功弹窗


  const onInputNikename = (value:string)=>{
    setNickname(value)
    if(value.trim()){
      setErrorNickname("")
    }
  }
  const onInputEmail = (value:string)=>{
    setEmail(value)
    if(value.trim()){
      setErrorEmail("")
    }
  }

  const chackEmail = (email: string) => { 
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email)
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault() // 阻止 组织表单默认行为——刷新页面

    if (!chackEmail(email)) {
      setErrorEmail("请输入正确的邮箱")
      return
    }

    //验证邮件是否存在
   
    setStep(2)
  }

  const handlePrevStep = () => {
    setStep(1)
    setSubmitButton("发起验证")
  }

  // 创建60秒的倒计时
  const contdown = (duration: number) => {
    let timer = duration;
    const interval = setInterval(() => {
      if (timer <= 0) {
        clearInterval(interval);
        setSubmitButton("发起验证")
      } else {
        setSubmitButton(`${timer}s`)
        timer--;
      }
    }, 1000);
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 阻止 组织表单默认行为——刷新页面

    //检查昵称输入是否为空
    if (!nickname.trim()) {
      setErrorNickname("请输入昵称")
      return
    }
    
    setSubmitButton("处理中...")
    setIsLoading(true)
    
    try {
      // TODO: 实现注册逻辑
      // 发送验证邮箱邮件
      console.log("Registering with nickname:", nickname, "email:", email)
      
      // 显示邮件发送成功弹窗
      setShowEmailSentModal(true)
      
      contdown(60)
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 计算表单的动画类名
  const getFormClassName = (formStep: number) => {
    const baseClass = 'space-y-18 transition-all duration-500 ease-in-out'
    
    if (step === formStep) {
      // 当前激活的表单：在中心位置，完全可见
      return `${baseClass} translate-x-0 opacity-100`
    }
    
    // 非激活表单的位置取决于它相对于当前步骤的位置
    if (formStep < step) {
      // 在当前步骤之前的表单：应该在左侧（已经滑出屏幕左边）
      return `${baseClass} -translate-x-full opacity-0 absolute top-0 w-full pointer-events-none`
    } else {
      // 在当前步骤之后的表单：应该在右侧（等待从右边滑入）
      return `${baseClass} translate-x-full opacity-0 absolute top-0 w-full pointer-events-none`
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-black dark:text-white mb-12">
          注册
        </h1>
        
        
        <div className="relative min-h-[400px]">
          {/* 第一步，验证邮箱 */}
          <form 
            noValidate //禁用原生校验
            onSubmit={handleNextStep} 
            className={getFormClassName(1)}
          >
            <Input
              label="Email"
              type="email"
              placeholder="email@janesfakedomain.net"
              value={email}
              error={errorEmail}
              onChange={(e) => onInputEmail(e.target.value)}
              // required
            />
            
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
              >
                下一步
              </Button>
            </div>
          </form>

          {/* 第二步，收集昵称 */}
          <form 
            noValidate //禁用原生校验
            onSubmit={handleSubmit} 
            className={getFormClassName(2)}
          >
            <Input
              label="Nickname"
              type="text"
              placeholder="nickname"
              error={errorNickname}
              value={nickname}
              onChange={(e) => onInputNikename(e.target.value)}
              // required  必填，勾选后会触发原生组件的校验和提示
            />

            <div className="flex justify-center gap-4">
              <Button
                type="button"
                size="lg"
                onClick={handlePrevStep}
              >
                上一步
              </Button>
              <Button
                type="submit"
                size="lg"
                // disabled={isLoading || !email.trim()}
              >
                {submitButton}
              </Button>
            </div>
            
            
          </form>

          
        </div>

        {/* 邮件发送成功弹窗 */}
        <Modal
          isOpen={showEmailSentModal}
          onClose={() => setShowEmailSentModal(false)}
          title="邮件已发出，请查收！"
          confirmText="知道了"
          showFooter={true}
        >
          还没收到？60 秒后可重发。
        </Modal>
      </div>
    </div>
  )
}
