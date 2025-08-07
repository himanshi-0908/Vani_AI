"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Languages, Mic, Users, Zap, Shield, Globe, ArrowRight } from "lucide-react"
import TranslatorInterface from "./translator/page"

const indianLanguages = [
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "en", name: "English", native: "English" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ta", name: "Tamil", native: "தমிழ்" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
]

export default function HomePage() {
  const [userALanguage, setUserALanguage] = useState("")
  const [userBLanguage, setUserBLanguage] = useState("")
  const [showTranslator, setShowTranslator] = useState(false)

  const handleStartTranslation = () => {
    if (userALanguage && userBLanguage) {
      setShowTranslator(true)
    }
  }

  if (showTranslator) {
    return <TranslatorInterface userALang={userALanguage} userBLang={userBLanguage} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Mobile-First Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-lg flex items-center justify-center">
                <Languages className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                  Vani AI
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">वाणी • Voice • বাণী</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              🇮🇳 India
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            Break Language Barriers
            <span className="block text-transparent bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text">
              Across India
            </span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Real-time voice translation between Indian languages. Speak naturally, understand instantly.
          </p>

          {/* Language Selection - Mobile First */}
          <Card className="max-w-lg mx-auto mb-6 sm:mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                Setup Translation
              </CardTitle>
              <CardDescription className="text-sm">Choose languages for both speakers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Language</label>
                  <Select value={userALanguage} onValueChange={setUserALanguage}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your language" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.name}</span>
                            <span className="text-muted-foreground text-sm">({lang.native})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-center py-2">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Other Person's Language</label>
                  <Select value={userBLanguage} onValueChange={setUserBLanguage}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select target language" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.name}</span>
                            <span className="text-muted-foreground text-sm">({lang.native})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleStartTranslation}
                disabled={!userALanguage || !userBLanguage}
                className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 h-12"
                size="lg"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Translation
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features - Mobile Grid */}
      <section className="container mx-auto px-4 py-8 sm:py-16">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Choose Vani AI?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          <Card className="text-center p-4">
            <CardHeader className="pb-4">
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-orange-500 mb-2 sm:mb-4" />
              <CardTitle className="text-lg">Real-Time Translation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Instant speech-to-text conversion and translation with minimal delay
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-4">
            <CardHeader className="pb-4">
              <Globe className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-green-500 mb-2 sm:mb-4" />
              <CardTitle className="text-lg">12+ Indian Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Support for major Indian languages including Hindi, Bengali, Tamil, and more
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-4">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-blue-500 mb-2 sm:mb-4" />
              <CardTitle className="text-lg">Accuracy Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                See both original and translated text to ensure perfect understanding
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">© 2024 Vani AI. Connecting India through language.</p>
            <p className="text-xs mt-2">भारत को भाषा के माध्यम से जोड़ना</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
