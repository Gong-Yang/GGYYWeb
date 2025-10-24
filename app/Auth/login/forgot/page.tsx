"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/general/Button/Button"
import { Input } from "@/components/general/Input/Input"
import { Modal } from "@/components/general/Modal/Modal"


interface Results {
  passed: boolean;
  message: string;
}

export default function LoginForgotPage() {
  const router = useRouter()
  const [userInfo] = useState<{ nickname: string; email: string }>({
    nickname: "a",
    email: "a",
  })
  const [passWord, setPassWord] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")  // 确认密码
  const [errorPassWord, setErrorPassWord] = useState<string>("")    //密码错误信息
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>("")  // 确认密码错误信息

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

  const onInputConfirmPassword = (value:string)=>{
    setConfirmPassword(value)
    if(value.trim()){
      setErrorConfirmPassword("")
    }
  }

  // 检查确认密码是否一致
  const checkConfirmPassword = () => {
    let info = "";
    
    if (!confirmPassword.trim()) {
      info = "请输入确认密码";
    } else if (passWord !== confirmPassword) {
      info = "两次密码输入不一致";
    }
    
    setErrorConfirmPassword(info);
    return info === "" ? true : false;
  }

  //检查密码格式
  const chackPassWordFormat = (password: string) => { 
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

  const chackPassWord = () => { 
    let info = "";
    
    if (!passWord.trim()) {
      info = "请输入密码"
    }else{
      //密码格式错误检查
      const { allPassed, results } = chackPassWordFormat(passWord);
      if (!allPassed) {
        info = getErrorMessage(results);
      }
    }
    setErrorPassWord(info);
    return info === "" ? true : false;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 阻止表单默认行为——刷新页面
    if(isSending) return  // 正在注册 防多次点击
    
    // 验证所有字段
    const isPasswordValid = chackPassWord();
    const isConfirmPasswordValid = checkConfirmPassword();
    
    // 如果任何验证失败，停止提交
    if (!isPasswordValid || !isConfirmPasswordValid) return;
      
    
    // 再次确认密码一致性
    if (passWord !== confirmPassword) {
      setErrorConfirmPassword("两次密码输入不一致");
      return;
    }
    
    if (!userInfo.email || !userInfo.nickname) {
      return;
    }

    setIsSending(true);
    
    try {
      // TODO: 实现注册逻辑
      console.log('提交注册:', { email: userInfo.email, nickname: userInfo.nickname, password: passWord });
      
      setIsSending(false)
    } catch (error) {
      console.error("Registration failed:", error)
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
          <h1 className="text-5xl font-bold text-center text-black dark:text-white mb-12">
            忘记密码
          </h1>
        
        <form 
          noValidate
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <Input
            label="密码"
            type="password"
            placeholder="请输入密码"
            error={errorPassWord}
            value={passWord}
            onBlur={chackPassWord}
            onChange={(e) => onInputPassWord(e.target.value)}
          />
          <Input
            label="确认密码"
            type="password"
            placeholder="请再次输入密码"
            error={errorConfirmPassword}
            value={confirmPassword}
            onBlur={checkConfirmPassword}
            onChange={(e) => onInputConfirmPassword(e.target.value)}
          />
          
          <div className="pt-4">
            <Button
              type="submit"
              size="md"
              fullWidth
              disabled={isSending}
            >
              {isSending ? '修改中...' : '修改密码'}
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
