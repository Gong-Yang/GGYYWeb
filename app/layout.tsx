import "styles/tailwind.css"
import { Header } from "@/components/Header/Header"
import { Footer } from "@/components/Footer/Footer"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 ">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
