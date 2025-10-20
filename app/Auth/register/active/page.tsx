"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/general/Input/Input"
import { Button } from "@/components/general/Button/Button"
import { Modal } from "@/components/general/Modal/Modal"


interface Results {
  passed: boolean;
  message: string;
}

export default function RegisterActivePage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<{ nickname: string; email: string }>({
    nickname: "a",
    email: "a",
  })
  const [passWord, setPassWord] = useState<string>("")
  const [errorPassWord, setErrorPassWord] = useState<string>("")    //错误信息

  const [isSending, setIsSending] = useState<boolean>(false)  // 是否正在发送验证码 [true | false] 还没超过60s
  const [showEmailSentModal, setShowEmailSentModal] = useState<boolean>(false) // 邮件发送成功弹窗


    // 密码校验规则说明（用于提示）
  const rules = [
    { test: (s:string) => s.length >= 8, message: '至少8个字符' },
    { test: (s:string) => /[a-z]/.test(s), message: '包含小写字母' },
    { test: (s:string) => /[A-Z]/.test(s), message: '包含大写字母' },
    { test: (s:string) => /\d/.test(s), message: '包含数字' }
    // 如需特殊字符：{ test: (s) => /[!@#$%^&*(),.?":{}|<>]/.test(s), message: '包含特殊字符' }
  ];

  const onInputPassWord = (value:string)=>{
    setPassWord(value)
    if(value.trim()){
      setErrorPassWord("")
    }
  }

  //检查密码格式
  const chackPassWord = (password: string) => { 
    // 将密码循环测试
    const results = rules.map(rule => ({
      passed: rule.test(password),
      message: rule.message
    }));
    // 返回所有通过测试的规则
    const allPassed = results.every(r => r.passed);
    console.log(allPassed, results);
    return { allPassed, results };
  }

    // 提示：密码格式
  const getErrorMessage = (results: Results[]) => {
    // 提取所有未通过的提示消息
    const failedMessages = results
      .filter(r => !r.passed)
      .map(r => r.message);

    if (failedMessages.length === 0) {
      return ''; // 没有错误，可选返回空或 null
    }

    // 第一个直接用“请...”，后面的用顿号连接
    return '请' + failedMessages.join('、');
  };

  // 提交前的检查
  const validateForm = (): string | null => {
    if (!userInfo.email || !userInfo.nickname) return "用户信息没有啦";
    if (!passWord.trim()) return "请输入密码";
    
    //密码格式错误检查
    const { allPassed, results } = chackPassWord(passWord);
    if (!allPassed) return getErrorMessage(results);
    
    return null; // 无错误
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 阻止 组织表单默认行为——刷新页面
    if(isSending) return  // 正在注册 防多次点击
    setIsSending(true)

    const error = validateForm();
    if (error) {
      setErrorPassWord(error);
      setIsSending(false)
      return;
    }
    
    
    try {
      // TODO: 实现注册逻辑
      
      
      setIsSending(false)
    } catch (error) {
      console.error("Registration failed:", error)
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* 返回登录页面按钮  */}
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
            label="Password"
            type="text"
            placeholder="password"
            error={errorPassWord}
            value={passWord}
            onChange={(e) => onInputPassWord(e.target.value)}
          />
          
          <div className="pt-2">
            <Button
              type="submit"
              size="md"
              fullWidth
              // fontWeight="bold"
            >
              注册
            </Button>
          </div>
        </form>

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
