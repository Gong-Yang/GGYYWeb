import { Footer } from "@/components/general/Footer/Footer"
import { Header } from "@/components/WebTool/general/Header/Header"

export default function WebToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  )
}
