"use client"

import type React from "react"

import { RecipeGenerator } from "@/components/recipe-generator"
import { ThemeProvider } from "@/components/theme-provider"
import { Utensils, Sparkles, ChefHat, Heart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-600 to-amber-500 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-repeat"></div>
          </div>
          <div className="container mx-auto px-4 py-16 relative">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  Bugün Ne Yapsam{" "}
                  <span className="relative inline-block">
                    AI
                    <span className="absolute -top-1 -right-4">
                      <Sparkles className="h-6 w-6 text-yellow-300" />
                    </span>
                  </span>
                </h1>
                <p className="text-xl md:text-2xl mb-6 text-orange-100">Elinizdeki malzemelerle harikalar yaratın!</p>
                <p className="text-lg mb-8 max-w-lg">
                  Buzdolabınızdaki malzemeleri girin, yapay zeka size özel lezzetli tarifler ve yemek planları
                  oluştursun.
                </p>
                <Button
                  className="bg-white text-orange-600 hover:bg-orange-100 font-medium text-lg px-6 py-3"
                  onClick={() => {
                    const generatorElement = document.getElementById("recipe-generator")
                    if (generatorElement) {
                      generatorElement.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  Hemen Başla
                </Button>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-orange-300 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute inset-4 bg-orange-200 rounded-full opacity-40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChefHat className="w-32 h-32 md:w-40 md:h-40 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-12">
          {/* Features Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nasıl Çalışır?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Utensils className="h-10 w-10 text-orange-500" />}
                title="Malzemeleri Girin"
                description="Elinizde bulunan malzemeleri listeleyerek başlayın."
                step="1"
              />
              <FeatureCard
                icon={<Sparkles className="h-10 w-10 text-orange-500" />}
                title="AI Tarif Oluşturur"
                description="Yapay zeka, malzemelerinize uygun tarifler önerir."
                step="2"
              />
              <FeatureCard
                icon={<Heart className="h-10 w-10 text-orange-500" />}
                title="Lezzetli Yemekler"
                description="Önerilen tarifleri pişirin ve lezzetin tadını çıkarın."
                step="3"
              />
            </div>
          </section>

          {/* Recipe Generator Section */}
          <section id="recipe-generator" className="mb-16 scroll-mt-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Tarif Oluşturucu</h2>
            <RecipeGenerator />
          </section>

          {/* Testimonials Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Kullanıcı Yorumları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TestimonialCard
                quote="Buzdolabımda kalan birkaç malzemeyle harika bir akşam yemeği hazırladım. Bu uygulama hayat kurtarıcı!"
                author="Ayşe K."
              />
              <TestimonialCard
                quote="Yemek planı özelliği sayesinde haftalık alışverişimi çok daha verimli yapabiliyorum. Kesinlikle tavsiye ederim."
                author="Mehmet Y."
              />
              <TestimonialCard
                quote="Artık evde kalan malzemeler çöpe gitmiyor. Her şeyi değerlendirmeyi öğrendim."
                author="Zeynep A."
              />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sıkça Sorulan Sorular</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <FaqItem
                question="Uygulama nasıl çalışır?"
                answer="Elinizdeki malzemeleri girmeniz yeterli. Yapay zeka teknolojimiz, bu malzemelerle yapabileceğiniz en uygun tarifleri veya yemek planlarını oluşturur."
              />
              <FaqItem
                question="Özel diyet gereksinimlerimi belirtebilir miyim?"
                answer="Şu anda özel diyet gereksinimleri için filtreleme özelliğimiz bulunmuyor, ancak malzemelerinizi girerken diyet kısıtlamalarınızı belirtebilirsiniz."
              />
              <FaqItem
                question="Tarifleri kaydedebilir miyim?"
                answer="Şu an için tarifleri kaydetme özelliğimiz bulunmuyor, ancak tarifleri yazdırabilir veya paylaşabilirsiniz."
              />
            </div>
          </section>
        </main>

        <footer className="bg-orange-600 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Bugün Ne Yapsam AI</h3>
                <p className="text-orange-200">Yapay zeka destekli tarif asistanınız</p>
              </div>
              <div className="text-center md:text-right">
                <p>&copy; {new Date().getFullYear()} Onur YERLİKAYA</p>
                <p className="text-orange-200 text-sm mt-1">Tüm hakları saklıdır.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  step,
}: { icon: React.ReactNode; title: string; description: string; step: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-orange-100 hover:shadow-lg transition-shadow relative">
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
        {step}
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-orange-100 rounded-full">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-orange-100">
      <div className="text-orange-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="opacity-50"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-gray-700 mb-4">{quote}</p>
      <p className="text-orange-600 font-medium">{author}</p>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          {question}
          <ChevronDown className="ml-auto h-5 w-5 text-orange-500" />
        </h3>
        <div className="mt-2 text-gray-600">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  )
}
