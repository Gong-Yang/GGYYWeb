"use client"

import { useState } from "react"
import { Input } from "@/components/general/Input/Input"
import { SubmitButton } from "@/components/general/SubmitButton/SubmitButton"

export default function RegisterPage() {
  const [nickname, setNickname] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // TODO: 实现注册逻辑
      console.log("Registering with nickname:", nickname)
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-black dark:text-white mb-12">
          注册
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-24">
          <Input
            label="Nickname"
            type="text"
            placeholder="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          
          <div className=" flex justify-center">
            <SubmitButton
              type="submit"
              intent="primary"
              size="lg"
              disabled={isLoading || !nickname.trim()}
            >
              {isLoading ? "处理中..." : "下一步"}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}
