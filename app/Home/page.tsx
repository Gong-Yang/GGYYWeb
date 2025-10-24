'use client'

import { useRouter } from 'next/navigation'


export default function HomePage() {
  const router = useRouter()
  
  const register = () => { 
    router.push("/Auth/register")
  }

  const login = () => { 
    router.push("/Auth/login")
  }
  return (
    <>
      home主页
      <div onClick={login}>
        登录
      </div>
      <div onClick={register}>
        注册
      </div>
    </>
  )
}
