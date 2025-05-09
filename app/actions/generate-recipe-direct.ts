"use server"

export type GenerationType = "recipe" | "mealplan"

export async function generateRecipeDirect(ingredients: string, type: GenerationType = "recipe") {
  try {
    // API route'umuzu çağır
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/generate-recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients, type }),
      // Sunucu tarafında çalıştığımız için cache'i devre dışı bırak
      cache: "no-store",
    })

    // Yanıt başarılı değilse hata fırlat
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `API isteği başarısız oldu: ${response.status}`

      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.error || errorMessage
      } catch (e) {
        console.error("Error parsing error response:", errorText)
      }

      throw new Error(errorMessage)
    }

    // Yanıtı işle
    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Recipe generation error:", error)
    return {
      success: false,
      error: error.message || "Tarif oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      type,
    }
  }
}
