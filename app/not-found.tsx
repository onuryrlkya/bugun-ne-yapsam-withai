import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">404 - Sayfa Bulunamadı</h1>
        <p className="text-lg text-gray-700 mb-8">
          Aradığınız sayfa bulunamadı. Belki de bu malzemelerle lezzetli bir tarif yapmanın zamanı gelmiştir?
        </p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
            <Home className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  )
}
