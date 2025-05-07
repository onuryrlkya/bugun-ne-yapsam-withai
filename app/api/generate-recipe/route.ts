import OpenAI from "openai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("API route called")

    const { ingredients } = await request.json()
    console.log("Ingredients received:", ingredients)

    if (!ingredients) {
      return NextResponse.json({ error: "Ingredients are required" }, { status: 400 })
    }

    // Initialize OpenAI client with OpenRouter base URL and API key
    console.log("Initializing OpenAI client with OpenRouter")
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: "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",
    })

    const prompt = `
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

Lütfen sadece verdiğim malzemeleri kullanarak yapılabilecek bir tarif önerin. Eğer malzemeler yeterli değilse, eksik malzemeleri belirtin ve alternatif öneriler sunun.
`

    console.log("Sending request to OpenRouter")
    // Make the request to OpenRouter using the OpenAI client
    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      // @ts-ignore - Extra headers are not in the type definition but supported by OpenRouter
      extra_headers: {
        "HTTP-Referer": "https://bugun-ne-yapsam-ai.vercel.app",
        "X-Title": "Bugün Ne Yapsam AI",
      },
    })

    console.log("Received response from OpenRouter")
    // Extract the recipe text from the response
    const recipeText = completion.choices[0].message.content

    return NextResponse.json({ success: true, recipe: recipeText })
  } catch (error) {
    console.error("Recipe generation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Tarif oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 500 },
    )
  }
}
