import "styles/tailwind.css"
import { Header } from "@/components/WebTool/Header/Header"
import { Footer } from "@/components/general/Footer/Footer"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="flex flex-col min-h-screen">
        <Header></Header>
        <div className="flex-1 ">{children}</div>
        <Footer></Footer>
      </body>
    </html>
  )
}
