"use server"

import type { GenerationType } from "./generate-recipe-deepseek"

export async function generateRecipeWithOpenAI(ingredients: string, type: GenerationType = "recipe") {
  try {
    console.log("OpenAI API'ye istek gönderiliyor...")

    // Uygun prompt'u oluştur
    const prompt = createPrompt(ingredients, type)

    // OpenAI API'ye istek gönder
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
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
    })

    // Yanıt durumunu logla
    console.log("OpenAI API yanıt durumu:", response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI API hata yanıtı:", errorText)
      throw new Error(`OpenAI API isteği başarısız oldu: ${response.status} - ${response.statusText}`)
    }

    // Yanıtı işle
    const data = await response.json()
    console.log("OpenAI API yanıtı alındı")

    // Yanıt içeriğini kontrol et
    const recipeText = data.choices?.[0]?.message?.content

    if (!recipeText) {
      console.error("Geçersiz OpenAI API yanıt formatı:", JSON.stringify(data).substring(0, 200) + "...")
      throw new Error("OpenAI API'den geçerli bir yanıt alınamadı.")
    }

    return {
      success: true,
      recipe: recipeText,
      type,
    }
  } catch (error) {
    // Hata nesnesini daha detaylı logla
    console.error(
      "OpenAI recipe generation error details:",
      error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : String(error),
    )

    // Hata mesajını güvenli bir şekilde çıkar
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu"

    throw new Error(`OpenAI ile tarif oluşturulurken bir hata oluştu: ${errorMessage}`)
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
