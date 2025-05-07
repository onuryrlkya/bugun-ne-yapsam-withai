"use server"

export async function generateRecipe(ingredients: string) {
  try {
    // Use a relative URL which should work in both development and production
    const response = await fetch("/api/generate-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients }),
      // Add these options to ensure proper handling in a server component
      cache: "no-store",
    })

    // Check if the response is HTML instead of JSON
    const contentType = response.headers.get("content-type") || ""
    if (contentType.includes("text/html")) {
      console.error("Received HTML response instead of JSON")
      const htmlText = await response.text()
      console.error("HTML response:", htmlText.substring(0, 200) + "...")
      throw new Error("Received HTML response instead of JSON")
    }

    if (!response.ok) {
      const errorText = await response.text()
      try {
        const errorData = JSON.parse(errorText)
        throw new Error(errorData.error || `API request failed with status ${response.status}`)
      } catch (e) {
        console.error("Failed to parse error response:", errorText.substring(0, 200) + "...")
        throw new Error(`API request failed with status ${response.status}`)
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Recipe generation error:", error)
    return {
      success: false,
      error: "Tarif oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
    }
  }
}
