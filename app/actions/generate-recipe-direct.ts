"use server"

export type GenerationType = "recipe" | "mealplan"

export async function generateRecipeDirect(ingredients: string, type: GenerationType = "recipe") {
  try {
    // Create the appropriate prompt based on the generation type
    let prompt = ""

    if (type === "recipe") {
      prompt = `
Elinizdeki malzemeler: ${ingredients}

Lütfen bu malzemelerle yapabileceğim basit ve pratik bir yemek tarifi önerir misiniz? 
Tarifi şu formatta veriniz:

## Tarif Adı

### Malzemeler
- Malzeme 1
- Malzeme 2
...

### Hazırlanışı
1. Adım 1
2. Adım 2
...

### Püf Noktaları
- İpucu 1
- İpucu 2
...

### Hazırlama Süresi
- Hazırlık: X dakika
- Pişirme: Y dakika
- Toplam: Z dakika

Lütfen sadece verdiğim malzemeleri kullanarak yapılabilecek bir tarif önerin. Eğer malzemeler yeterli değilse, eksik malzemeleri belirtin ve alternatif öneriler sunun.
`
    } else {
      prompt = `
Elinizdeki malzemeler: ${ingredients}

Lütfen bu malzemelerle yapabileceğim günlük bir yemek planı önerir misiniz?
Yemek planını şu formatta veriniz:

# Günlük Yemek Planı

## Kahvaltı
- Yemek adı
- Kısa açıklama
- Kullanılan malzemeler

## Öğle Yemeği
- Yemek adı
- Kısa açıklama
- Kullanılan malzemeler

## Akşam Yemeği
- Yemek adı
- Kısa açıklama
- Kullanılan malzemeler

## Ara Öğün/Atıştırmalık
- Öneri
- Kullanılan malzemeler

Lütfen sadece verdiğim malzemeleri kullanarak yapılabilecek bir yemek planı önerin. Eğer malzemeler yeterli değilse, eksik malzemeleri belirtin ve alternatif öneriler sunun.
`
    }

    // Create a fetch request to OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
        "HTTP-Referer": "https://bugun-ne-yapsam-ai.vercel.app",
        "X-Title": "Bugün Ne Yapsam AI",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenRouter API error:", errorText)
      throw new Error(`OpenRouter API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Add null checks to avoid "Cannot read properties of undefined" errors
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected response format from OpenRouter:", JSON.stringify(data))
      throw new Error("Unexpected response format from OpenRouter")
    }

    const recipeText = data.choices[0].message.content

    if (!recipeText) {
      throw new Error("No recipe text returned from OpenRouter")
    }

    return { success: true, recipe: recipeText, type }
  } catch (error) {
    console.error("Recipe generation error:", error)
    return {
      success: false,
      error: "Tarif oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      type,
    }
  }
}
