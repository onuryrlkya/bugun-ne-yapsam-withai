import { NextResponse } from "next/server"

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

    // Dokümantasyondaki gibi tam olarak API çağrısını yapıyoruz
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "HTTP-Referer": "https://bugun-ne-yapsam-ai.vercel.app",
        "X-Title": "Bugün Ne Yapsam AI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-zero:free",
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

    // Yanıtı kontrol et
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error("Error details:", errorText)

      return NextResponse.json(
        {
          success: false,
          error: `API isteği başarısız oldu: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      )
    }

    // Yanıtı işle
    const data = await response.json()
    console.log("API response:", JSON.stringify(data, null, 2))

    // Yanıttan tarif metnini çıkar
    const recipeText = data.choices?.[0]?.message?.content

    if (!recipeText) {
      console.error("Invalid response format:", data)
      return NextResponse.json({ success: false, error: "API'den geçerli bir yanıt alınamadı." }, { status: 500 })
    }

    return NextResponse.json({ success: true, recipe: recipeText, type })
  } catch (error: any) {
    console.error("Recipe generation error:", error)

    return NextResponse.json(
      {
        success: false,
        error: `Tarif oluşturulurken bir hata oluştu: ${error.message || "Bilinmeyen hata"}`,
      },
      { status: 500 },
    )
  }
}
