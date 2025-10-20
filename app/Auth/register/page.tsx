"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/general/Input/Input"
import { Button } from "@/components/general/Button/Button"
import { Modal } from "@/components/general/Modal/Modal"




export default function RegisterPage() {
  const router = useRouter()
  const [nickname, setNickname] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  //错误信息
  const [errorEmail, setErrorEmail] = useState<string>("") 
  const [errorNickname, setErrorNickname] = useState<string>("")  

  const [submitButton,setSubmitButton] = useState<string>("发起验证")  // 提交按钮的文字  发起验证  处理中...  已发送邮件
  const [isSending, setIsSending] = useState<boolean>(false)  // 是否正在发送验证码 [true | false] 还没超过60s
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

  const chackEmailFormat = (email: string) => { 
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email)
  }
  const chackEmail = () => { 
    if (!chackEmailFormat(email)) {
      setErrorEmail("邮箱格式错误")
      return false
    }
    return true
  }
  const chackNickname = () => { 
    if (!nickname.trim()) {
      setErrorNickname("请输入昵称")
      return false
    }
    return true
  }


  // 创建60秒的倒计时
  const contdown = (duration: number) => {
    let timer = duration;
    const interval = setInterval(() => {
      if (timer <= 0) {
        clearInterval(interval);
        setSubmitButton("发起验证")
        setIsSending(false)
      } else {
        setSubmitButton(`请${timer}s后重试`)
        timer--;
      }
    }, 1000);
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 阻止 组织表单默认行为——刷新页面
    if(isSending) return  // 正在发送验证码 防多次点击
   

    // 验证所有字段
    const isEmailValid = chackEmail();
    const isNicknameValid = chackNickname();

    if (!isEmailValid || !isNicknameValid) return
      
    
    
    setIsSending(true)
    setSubmitButton("处理中...")
    
    try {
      // TODO: 实现注册逻辑
      // 发送验证邮箱邮件
      console.log("Registering with nickname:", nickname, "email:", email)
      
      // 显示邮件发送成功弹窗
      setShowEmailSentModal(true)
      contdown(60)
    } catch (error) {
      console.error("Registration failed:", error)
      setSubmitButton("发起验证")
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* 返回登录页面按钮  */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => router.push('/Auth/login')}
          className="flex items-center gap-2 text-white dark:text-black hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="ml-2 text-sm text-black dark:text-white">登录</span>
        </button>
      </div>

      {/* 注册表单  */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center text-black dark:text-white mb-16">
            注册
          </h1>
        
        <form 
          noValidate
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <Input
            label="Email address"
            type="email"
            placeholder="email@janesfakedomain.net"
            value={email}
            error={errorEmail}
            onBlur={chackEmail}
            onChange={(e) => onInputEmail(e.target.value)}
          />
          <Input
            label="Nickname"
            type="text"
            placeholder="nickname"
            error={errorNickname}
            value={nickname}
            onBlur={chackNickname}
            onChange={(e) => onInputNikename(e.target.value)}
          />
          <div className="pt-2">
            <Button
              type="submit"
              size="md"
              fullWidth
              // fontWeight="bold"
            >
              {submitButton}
            </Button>
          </div>
        </form>

        <button
            type="button"
            onClick={() => router.push('/Auth/register/active')}
            className="text-black dark:text-white hover:opacity-70 transition-opacity text-sm"
          >
            注册激活
          </button>

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
    </div>
  )
}
