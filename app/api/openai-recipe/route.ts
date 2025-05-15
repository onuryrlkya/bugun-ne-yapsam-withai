import { NextResponse } from "next/server"
import OpenAI from "openai"

// OpenAI istemcisini oluştur
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // İstek gövdesini ayrıştır
    const { ingredients, type } = await request.json()

    // Uygun prompt'u oluştur
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

    // OpenAI API'sine istek gönder
    const response = await openai.chat.completions.create({
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
    })

    // Yanıttan tarif metnini çıkar
    const recipeText = response.choices[0]?.message?.content

    if (!recipeText) {
      console.error("Invalid response format:", response)
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
