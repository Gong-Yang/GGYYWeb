import "styles/tailwind.css"

import { Footer } from "@/components/general/Footer/Footer"
import { Header } from "@/components/Home/Header/Header"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="flex flex-col min-h-screen">
        <Header></Header>
        <main className="flex-1 ">{children}</main>
        <Footer></Footer>
      </body>
    </html>
  )
}
