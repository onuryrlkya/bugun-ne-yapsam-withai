import { NextResponse } from "next/server"

// OpenRouter API endpoint
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
// DeepSeek model identifier
const DEEPSEEK_MODEL = "deepseek/deepseek-r1:free"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { ingredients, type } = await request.json()

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

    // Prepare the request to OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer sk-dd99198369aa4f048951be0879391e39",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://bugun-ne-yapsam-ai.vercel.app",
        "X-Title": "Bugün Ne Yapsam AI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
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

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenRouter API error:", errorData)

      let errorMessage = "Tarif oluşturulurken bir hata oluştu."

      if (response.status === 401 || response.status === 403) {
        errorMessage = "API yetkilendirme hatası. Lütfen sistem yöneticisiyle iletişime geçin."
      } else if (response.status === 429) {
        errorMessage = "Çok fazla istek gönderildi. Lütfen birkaç dakika bekleyip tekrar deneyin."
      }

      return NextResponse.json({ success: false, error: errorMessage }, { status: response.status })
    }

    // Parse the response
    const data = await response.json()

    // Extract the recipe text from the response
    const recipeText = data.choices?.[0]?.message?.content

    if (!recipeText) {
      console.error("Invalid response format:", data)
      return NextResponse.json({ success: false, error: "API'den geçerli bir yanıt alınamadı." }, { status: 500 })
    }

    return NextResponse.json({ success: true, recipe: recipeText, type })
  } catch (error: any) {
    console.error("Recipe generation error:", error)

    // Provide a generic error message
    return NextResponse.json(
      {
        success: false,
        error: "Tarif oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 500 },
    )
  }
}
