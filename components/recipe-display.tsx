"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Printer, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GenerationType } from "@/app/actions/generate-recipe-direct"

interface RecipeDisplayProps {
  recipe: string
  type: GenerationType
}

export function RecipeDisplay({ recipe, type }: RecipeDisplayProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Bugün Ne Yapsam AI - Tarif",
          text: recipe,
        })
      } catch (err) {
        console.error("Share failed:", err)
      }
    } else {
      alert("Paylaşım özelliği bu tarayıcıda desteklenmiyor.")
    }
  }

  if (!mounted) return null

  return (
    <Card className="bg-white shadow-lg border-orange-200 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl md:text-2xl">
            {type === "recipe" ? "Önerilen Tarif" : "Önerilen Yemek Planı"}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Yazdır</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Paylaş</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="prose max-w-none recipe-content">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-orange-600 mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-orange-500 mt-6 mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-orange-400 mt-4 mb-2" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-3" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-3" {...props} />,
              li: ({ node, ...props }) => <li className="my-1" {...props} />,
              p: ({ node, ...props }) => <p className="my-2" {...props} />,
            }}
          >
            {recipe}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}
