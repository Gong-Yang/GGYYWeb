"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/general/Input/Input"
import { Button } from "@/components/general/Button/Button"
import { Modal } from "@/components/general/Modal/Modal"

export default function LoginPage() {
  const router = useRouter()
  const [passWord, setPassWord] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  //错误信息
  const [errorEmail, setErrorEmail] = useState<string>("") 
  const [errorPassWord, setErrorPassWord] = useState<string>("")  

  const [isLoging, setIsLoading] = useState<boolean>(false)  // 是否正在登录
  const [showEmailSentModal, setShowEmailSentModal] = useState<boolean>(false) // 邮件发送成功弹窗


  const onInputPassWord = (value:string)=>{
    setPassWord(value)
    if(value.trim()){
      setErrorPassWord("")
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
  const chackPassWord = () => { 
    if (!passWord.trim()) {
      setErrorPassWord("请输入密码")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 阻止 组织表单默认行为——刷新页面
    if(isLoging) return  // 正在登录 防多次点击
    
    // 验证所有字段
    const isEmailValid = chackEmail();
    const isPassWordValid = chackPassWord();

    if (!isEmailValid || !isPassWordValid) return
    
    
    setIsLoading(true)
    try {
     
      // TODO: 实现登录逻辑
      
      
      //请求返回成功
      setIsLoading(false)
    } catch (error) {
      console.error("Registration failed:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* 返回上一个页面按钮  */}
      {/* <div className="absolute top-6 left-6">
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
      </div> */}

      {/* 登录表单  */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center text-black dark:text-white mb-8">
            登录
          </h1>
        
        <form 
          noValidate
          onSubmit={handleSubmit}
          className="space-y-5"
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
            label="Password"
            type="text"
            placeholder="password"
            error={errorPassWord}
            value={passWord}
            onBlur={chackPassWord}
            onChange={(e) => onInputPassWord(e.target.value)}
          />
          <div className="pt-1">
            <Button
              type="submit"
              size="md"
              fullWidth
              // fontWeight="bold"
            >
               登录
            </Button>
          </div>
        </form>

        {/* 注册和忘记密码 */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => router.push('/Auth/register')}
            className="text-black dark:text-white hover:opacity-70 transition-opacity text-sm"
          >
            注册
          </button>
          <button
            type="button"
            onClick={() => {
              // TODO: 实现忘记密码逻辑
              console.log('忘记密码')
            }}
            className="text-black dark:text-white hover:opacity-70 transition-opacity text-sm"
          >
            忘记密码？
          </button>
        </div>

        {/* 登录有问题弹窗 */}
        <Modal
          isOpen={showEmailSentModal}
          onClose={() => setShowEmailSentModal(false)}
          title="登录有问题 后端提示"
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
