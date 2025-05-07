"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateRecipeDirect, type GenerationType } from "@/app/actions/generate-recipe-direct"
import { Loader2, ChefHat, RefreshCw, Utensils, Calendar } from "lucide-react"
import { RecipeDisplay } from "./recipe-display"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("")
  const [recipe, setRecipe] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationType, setGenerationType] = useState<GenerationType>("recipe")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ingredients.trim()) {
      setError("Lütfen en az bir malzeme girin.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await generateRecipeDirect(ingredients, generationType)

      if (result.success && result.recipe) {
        setRecipe(result.recipe)
      } else {
        setError(result.error || "Bir hata oluştu.")
      }
    } catch (err) {
      console.error("Client error:", err)
      setError("İşlem sırasında bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setIngredients("")
    setRecipe(null)
    setError(null)
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
            <div className="bg-orange-50 border-b border-orange-100 p-4">
              <TabsList className="grid grid-cols-2 bg-orange-100">
                <TabsTrigger value="recipe" className="data-[state=active]:bg-white">
                  <Utensils className="mr-2 h-4 w-4" />
                  Tarif Oluştur
                </TabsTrigger>
                <TabsTrigger value="mealplan" className="data-[state=active]:bg-white">
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
                  {error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isLoading}>
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

      {recipe && !isLoading && (
        <div className="mt-8">
          <RecipeDisplay recipe={recipe} type={generationType} />
        </div>
      )}
    </div>
  )
}
