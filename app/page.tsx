import type React from "react"
import { RecipeGenerator } from "@/components/recipe-generator"
import { ThemeProvider } from "@/components/theme-provider"
import { Utensils, Clock, Calendar } from "lucide-react"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">Bugün Ne Yapsam AI</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Elinizdeki malzemeleri girin, yapabileceğiniz tarifleri veya günlük yemek planınızı öğrenin!
            </p>
          </header>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Utensils className="h-8 w-8 text-orange-500" />}
                title="Malzeme Bazlı Tarifler"
                description="Elinizde olan malzemelere göre size özel tarifler oluşturur."
              />
              <FeatureCard
                icon={<Calendar className="h-8 w-8 text-orange-500" />}
                title="Yemek Planı"
                description="Günlük öğünleriniz için pratik yemek planları sunar."
              />
              <FeatureCard
                icon={<Clock className="h-8 w-8 text-orange-500" />}
                title="Hızlı ve Pratik"
                description="Saniyeler içinde yaratıcı ve lezzetli tarifler elde edin."
              />
            </div>
          </div>

          <RecipeGenerator />

          <footer className="mt-16 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Onur YERLİKAYA
          </footer>
        </div>
      </main>
    </ThemeProvider>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-orange-100 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}
