"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateRecipeDirect, type GenerationType } from "@/app/actions/generate-recipe-direct"
import { Loader2, ChefHat, RefreshCw, Utensils, Calendar, AlertTriangle, Sparkles } from "lucide-react"
import { RecipeDisplay } from "./recipe-display"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Demo verileri - API çalışmazsa kullanılacak
const DEMO_RECIPES = {
  recipe: `## Makarna Salatası

### Malzemeler
- 200g makarna (herhangi bir çeşit)
- 2 adet domates
- 1 adet soğan
- 2 yemek kaşığı zeytinyağı
- 1 diş sarımsak
- Tuz ve karabiber

### Hazırlanışı
1. Makarnayı paketteki talimatlara göre haşlayın.
2. Domatesleri küp küp doğrayın.
3. Soğanı ince ince kıyın.
4. Sarımsağı ezin.
5. Haşlanmış makarnayı süzün ve soğuk su altında yıkayın.
6. Tüm malzemeleri bir kapta karıştırın.
7. Zeytinyağı, tuz ve karabiber ekleyerek harmanlayın.

### Püf Noktaları
- Makarnayı al dente pişirirseniz salata daha lezzetli olur.
- Servis etmeden önce 30 dakika buzdolabında bekletirseniz lezzeti artar.

### Hazırlama Süresi
- Hazırlık: 10 dakika
- Pişirme: 15 dakika
- Toplam: 25 dakika`,
  mealplan: `# Günlük Yemek Planı

## Kahvaltı
- Domates ve Soğanlı Yumurta
- Domates ve soğanlar kavrulur, üzerine yumurta kırılarak pişirilir.
- Kullanılan malzemeler: Domates, soğan, yumurta, zeytinyağı

## Öğle Yemeği
- Makarna Salatası
- Haşlanmış makarna, doğranmış domates ve soğanla karıştırılır, zeytinyağı ile tatlandırılır.
- Kullanılan malzemeler: Makarna, domates, soğan, zeytinyağı, sarımsak

## Akşam Yemeği
- Domates Soslu Makarna
- Domates ve soğan ile hazırlanan sos ile servis edilen makarna.
- Kullanılan malzemeler: Makarna, domates, soğan, sarımsak, zeytinyağı

## Ara Öğün/Atıştırmalık
- Domates ve Soğanlı Bruschetta
- Doğranmış domates ve soğan karışımı, zeytinyağı ile tatlandırılarak ekmek üzerinde servis edilir.
- Kullanılan malzemeler: Domates, soğan, zeytinyağı, ekmek`,
}

export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("")
  const [recipe, setRecipe] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationType, setGenerationType] = useState<GenerationType>("recipe")
  const [isDemoMode, setIsDemoMode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ingredients.trim()) {
      setError("Lütfen en az bir malzeme girin.")
      return
    }

    setIsLoading(true)
    setError(null)
    setRecipe(null) // Clear any previous recipe

    try {
      console.log("API isteği gönderiliyor...")
      const result = await generateRecipeDirect(ingredients, generationType)
      console.log("API yanıtı alındı:", result)

      if (result.success && result.recipe) {
        setRecipe(result.recipe)
        setIsDemoMode(false)
      } else {
        // API hatası durumunda demo moduna geç
        console.log("API hatası, demo moduna geçiliyor")
        setRecipe(DEMO_RECIPES[generationType])
        setIsDemoMode(true)
        setError(`API hatası: ${result.error || "Bilinmeyen hata"}. Demo mod etkinleştirildi.`)
      }
    } catch (err: any) {
      console.error("Client error:", err)
      // Hata durumunda demo moduna geç
      console.log("Hata oluştu, demo moduna geçiliyor")
      setRecipe(DEMO_RECIPES[generationType])
      setIsDemoMode(true)
      setError(`Hata: ${err.message || "Bilinmeyen hata"}. Demo mod etkinleştirildi.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setIngredients("")
    setRecipe(null)
    setError(null)
    setIsDemoMode(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-white shadow-lg border-orange-200 overflow-hidden">
        <CardContent className="p-0">
          <Tabs
            defaultValue="recipe"
            className="w-full"
            onValueChange={(value) => setGenerationType(value as GenerationType)}
          >
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white">
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                DeepSeek AI ile Yemek Keşfi
              </h2>
              <p className="text-sm opacity-90">
                Gelişmiş yapay zeka teknolojisi ile elinizdeki malzemelerden harika tarifler oluşturun.
              </p>
              <TabsList className="grid grid-cols-2 bg-white/20 mt-4 text-white">
                <TabsTrigger
                  value="recipe"
                  className="data-[state=active]:bg-white data-[state=active]:text-orange-600 text-white"
                >
                  <Utensils className="mr-2 h-4 w-4" />
                  Tarif Oluştur
                </TabsTrigger>
                <TabsTrigger
                  value="mealplan"
                  className="data-[state=active]:bg-white data-[state=active]:text-orange-600 text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Yemek Planı
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="ingredients" className="block text-lg font-medium text-gray-700 mb-2">
                    Elinizde hangi malzemeler var?
                  </label>
                  <Textarea
                    id="ingredients"
                    placeholder="Örnek: domates, soğan, makarna, zeytinyağı, sarımsak, kaşar peyniri..."
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="min-h-[120px] border-orange-200 focus:border-orange-400"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ne kadar detaylı malzeme listesi verirseniz, o kadar iyi sonuçlar alırsınız.
                  </p>
                  {error && (
                    <Alert variant={isDemoMode ? "default" : "destructive"} className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{isDemoMode ? "Bilgi" : "Hata"}</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {generationType === "recipe" ? "Tarif Hazırlanıyor..." : "Plan Hazırlanıyor..."}
                      </>
                    ) : (
                      <>
                        <ChefHat className="mr-2 h-5 w-5" />
                        {generationType === "recipe" ? "Tarif Oluştur" : "Plan Oluştur"}
                      </>
                    )}
                  </Button>

                  {recipe && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="border-orange-200 text-orange-600"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Yeni Sorgu
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="mt-8 text-center p-8 bg-white rounded-lg shadow-md border border-orange-200">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Loader2 className="h-16 w-16 animate-spin text-orange-500 absolute" />
            <ChefHat className="h-8 w-8 text-orange-600 absolute top-4 left-4" />
          </div>
          <p className="text-lg text-gray-700">
            {generationType === "recipe" ? "Tarif oluşturuluyor..." : "Yemek planı oluşturuluyor..."}
          </p>
          <p className="text-sm text-gray-500 mt-2">DeepSeek AI ile lezzetli öneriler hazırlanıyor.</p>
        </div>
      )}

      {recipe && !isLoading && (
        <div className="mt-8">
          <RecipeDisplay recipe={recipe} type={generationType} isDemoMode={isDemoMode} />
        </div>
      )}
    </div>
  )
}
