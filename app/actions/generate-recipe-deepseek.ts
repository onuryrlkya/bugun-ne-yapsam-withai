"use server"

export type GenerationType = "recipe" | "mealplan"

// Yeni OpenRouter API anahtarı
const OPENROUTER_API_KEY = "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"

export async function generateRecipe(ingredients: string, type: GenerationType = "recipe") {
  try {
    console.log("API'ye istek gönderiliyor...")

    // Uygun prompt'u oluştur
    const prompt = createPrompt(ingredients, type)

    // API'ye istek gönder - timeout ve retry mekanizması ekle
    let response = null
    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      try {
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://bugun-ne-yapsam-ai.vercel.app",
            "X-Title": "Bugün Ne Yapsam AI",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1:free",
            messages: [
              {
                role: "system",
                content:
                  "Sen bir profesyonel şefsin. Kullanıcının verdiği malzemelerle yapılabilecek lezzetli ve pratik tarifler öneriyorsun.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
          // 30 saniye timeout ekle
          signal: AbortSignal.timeout(30000),
        })

        // Başarılı yanıt aldıysak döngüden çık
        if (response.ok) break

        // Başarısız yanıt için hata fırlat
        throw new Error(`API isteği başarısız oldu: ${response.status} - ${response.statusText}`)
      } catch (fetchError) {
        retryCount++
        console.error(`API isteği başarısız oldu (Deneme ${retryCount}/${maxRetries}):`, fetchError)

        // Son deneme değilse biraz bekle ve tekrar dene
        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2000)) // 2 saniye bekle
        } else {
          // Tüm denemeler başarısız oldu
          throw fetchError
        }
      }
    }

    if (!response || !response.ok) {
      throw new Error("API'ye bağlanılamadı. Lütfen daha sonra tekrar deneyin.")
    }

    // Yanıtı işle
    const data = await response.json()
    console.log("API yanıtı alındı")

    // Yanıt içeriğini kontrol et
    const recipeText = data.choices?.[0]?.message?.content

    if (!recipeText) {
      throw new Error("API'den geçerli bir yanıt alınamadı.")
    }

    return {
      success: true,
      recipe: recipeText,
      type,
    }
  } catch (error) {
    console.error("Tarif oluşturma hatası:", error)
    throw error // Hatayı yukarı ilet, demo verisi göstermek istemiyoruz
  }
}

// Prompt oluşturma fonksiyonu
function createPrompt(ingredients: string, type: GenerationType): string {
  if (type === "recipe") {
    return `
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
    return `
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
}
