"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, MessageSquare, Languages, RotateCcw, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TranslatorInterfaceProps {
  userALang: string
  userBLang: string
}

const languageNames: Record<string, { name: string; native: string }> = {
  hi: { name: "Hindi", native: "हिन्दी" },
  en: { name: "English", native: "English" },
  bn: { name: "Bengali", native: "বাংলা" },
  te: { name: "Telugu", native: "తెలుగు" },
  mr: { name: "Marathi", native: "मराठी" },
  ta: { name: "Tamil", native: "தமிழ்" },
  gu: { name: "Gujarati", native: "ગુજરાતી" },
  kn: { name: "Kannada", native: "ಕನ್ನಡ" },
  ml: { name: "Malayalam", native: "മലയാളം" },
  pa: { name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  or: { name: "Odia", native: "ଓଡ଼ିଆ" },
  as: { name: "Assamese", native: "অসমীয়া" },
}

interface Message {
  id: string
  speaker: "A" | "B"
  originalText: string
  translatedText: string
  timestamp: Date
  fromLang: string
  toLang: string
}

export default function TranslatorInterface({ userALang, userBLang }: TranslatorInterfaceProps) {
  const [isListening, setIsListening] = useState(false)
  const [currentSpeaker, setCurrentSpeaker] = useState<"A" | "B">("A")
  const [messages, setMessages] = useState<Message[]>([])
  const [currentText, setCurrentText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any>(null)
  const { toast } = useToast()

  // Enhanced mock translation with more realistic responses
  const translateText = useCallback(async (text: string, fromLang: string, toLang: string): Promise<string> => {
    setIsTranslating(true)

    // Simulate realistic API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Enhanced mock translations
   const mockTranslations: Record<string, Record<string, Record<string, string>>> = {
      hello: {
        en: { hi: "नमस्ते", bn: "হ্যালো", ta: "வணக்கம்", te: "హలో" },
        hi: { en: "Hello", bn: "হ্যালো", ta: "வணக்கம்", te: "హలో" },
      },
      "how are you": {
        en: {
          hi: "आप कैसे हैं?",
          bn: "আপনি কেমন আছেন?",
          ta: "நீங்கள் எப்படி இருக்கிறீர்கள்?",
          te: "మీరు ఎలా ఉన్నారు?",
        },
        hi: {
          en: "How are you?",
          bn: "আপনি কেমন আছেন?",
          ta: "நீங்கள் எப்படி இருக்கிறீர்கள்?",
          te: "మీరు ఎలా ఉన్నారు?",
        },
      },
      "thank you": {
        en: { hi: "धन्यवाद", bn: "ধন্যবাদ", ta: "நன்றி", te: "ధన్యవాదాలు" },
        hi: { en: "Thank you", bn: "ধন্যবাদ", ta: "நன்றி", te: "ధన్యవాదాలు" },
      },
      goodbye: {
        en: { hi: "अलविदा", bn: "বিদায়", ta: "பிரியாவிடை", te: "వీడ్కోలు" },
        hi: { en: "Goodbye", bn: "বিদায়", ta: "பிரியாவிடை", te: "వీడ్కోలు" },
      },
      yes: {
        en: { hi: "हाँ", bn: "হ্যাঁ", ta: "ஆம்", te: "అవును" },
        hi: { en: "Yes", bn: "হ্যাঁ", ta: "ஆம்", te: "అవును" },
      },
      no: {
        en: { hi: "नहीं", bn: "না", ta: "இல்லை", te: "కాదు" },
        hi: { en: "No", bn: "না", ta: "இல்லை", te: "కాదు" },
      },
      "what is your name": {
        en: { hi: "आपका नाम क्या है?", bn: "তোমার নাম কী?", ta: "உங்கள் பெயர் என்ன?", te: "మీ పేరు ఏమిటి?" },
        hi: { en: "What is your name?", bn: "তোমার নাম কী?", ta: "உங்கள் பெயர் என்ன?", te: "మీ పేరు ఏమిటి?" },
      },
      "i am fine": {
        en: { hi: "मैं ठीक हूँ", bn: "আমি ভাল আছি", ta: "நான் நலமாக இருக்கிறேன்", te: "నేను బాగున్నాను" },
        hi: { en: "I am fine", bn: "আমি ভাল আছি", ta: "நான் நலமாக இருக்கிறேன்", te: "నేను బాగున్నాను" },
      },
      "i love you": {
        en: { hi: "मैं तुमसे प्यार करता हूँ", bn: "আমি তোমায় ভালোবাসি", ta: "நான் உன்னை காதலிக்கிறேன்", te: "నేను నిన్ను ప్రేమిస్తున్నాను" },
        hi: { en: "I love you", bn: "আমি তোমায় ভালোবাসি", ta: "நான் உன்னை காதலிக்கிறேன்", te: "నేను నిన్ను ప్రేమిస్తున్నాను" },
      },
      sorry: {
        en: { hi: "माफ़ कीजिए", bn: "দুঃখিত", ta: "மன்னிக்கவும்", te: "క్షమించండి" },
        hi: { en: "Sorry", bn: "দুঃখিত", ta: "மன்னிக்கவும்", te: "క్షమించండి" },
      },
      please: {
        en: { hi: "कृपया", bn: "অনুগ্রহ করে", ta: "தயவு செய்து", te: "దయచేసి" },
        hi: { en: "Please", bn: "অনুগ্রহ করে", ta: "தயவு செய்து", te: "దయచేసి" },
      },
    }

    const lowerText = text.toLowerCase().trim()
    const translation = mockTranslations[lowerText]?.[fromLang]?.[toLang]

    setIsTranslating(false)
    return translation || `[${languageNames[toLang]?.name}: ${text}]`
  }, [])

  // Auto-translate when recording stops
  const handleRecordingComplete = useCallback(
    async (finalText: string) => {
      if (!finalText.trim()) return

      setIsProcessing(true)
      const fromLang = currentSpeaker === "A" ? userALang : userBLang
      const toLang = currentSpeaker === "A" ? userBLang : userALang

      try {
        const translatedText = await translateText(finalText, fromLang, toLang)

        const newMessage: Message = {
          id: Date.now().toString(),
          speaker: currentSpeaker,
          originalText: finalText,
          translatedText,
          timestamp: new Date(),
          fromLang,
          toLang,
        }

        setMessages((prev) => [...prev, newMessage])

        // Auto-play translated text
        if (audioEnabled && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(translatedText)
          utterance.lang = toLang
          utterance.rate = 0.9
          speechSynthesis.speak(utterance)
        }

        // Auto-switch to other speaker after translation
        setTimeout(() => {
          setCurrentSpeaker((prev) => (prev === "A" ? "B" : "A"))
        }, 1000)
      } catch (error) {
        toast({
          title: "Translation Error",
          description: "Failed to translate. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
        setCurrentText("")
      }
    },
    [currentSpeaker, userALang, userBLang, translateText, audioEnabled, toast],
  )

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = true
      recognition.maxAlternatives = 1
      recognition.lang = currentSpeaker === "A" ? userALang : userBLang

      recognition.onstart = () => {
        setIsListening(true)
        setCurrentText("")
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setCurrentText(finalTranscript + interimTranscript)

        // Auto-process when final result is received
        if (finalTranscript) {
          handleRecordingComplete(finalTranscript)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        toast({
          title: "Speech Recognition Error",
          description: "Please check microphone permissions and try again.",
          variant: "destructive",
        })
      }

      recognitionRef.current = recognition
    } else {
      toast({
        title: "Browser Not Supported",
        description: "Please use Chrome or Safari for speech recognition.",
        variant: "destructive",
      })
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [currentSpeaker, userALang, userBLang, handleRecordingComplete, toast])

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing) {
      recognitionRef.current.lang = currentSpeaker === "A" ? userALang : userBLang
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const clearHistory = () => {
    setMessages([])
    setCurrentText("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Mobile-First Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-green-500 rounded-md flex items-center justify-center">
                  <Languages className="w-3 h-3 text-white" />
                </div>
                <h1 className="text-lg font-bold">Vani AI</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAudioEnabled(!audioEnabled)}>
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Language Display */}
        <div className="flex items-center justify-center mb-4">
          <Badge variant="outline" className="text-sm px-3 py-1">
            {languageNames[userALang]?.native} ↔ {languageNames[userBLang]?.native}
          </Badge>
        </div>

        {/* Main Interface - Mobile Stack */}
        <div className="space-y-4">
          {/* Current Speaker & Controls */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-lg">
                Current Speaker:{" "}
                {currentSpeaker === "A" ? languageNames[userALang]?.native : languageNames[userBLang]?.native}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Speaker Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={currentSpeaker === "A" ? "default" : "outline"}
                  onClick={() => setCurrentSpeaker("A")}
                  disabled={isListening || isProcessing}
                  className="h-12"
                >
                  <div className="text-center">
                    <div className="font-medium">Speaker A</div>
                    <div className="text-xs opacity-75">{languageNames[userALang]?.native}</div>
                  </div>
                </Button>
                <Button
                  variant={currentSpeaker === "B" ? "default" : "outline"}
                  onClick={() => setCurrentSpeaker("B")}
                  disabled={isListening || isProcessing}
                  className="h-12"
                >
                  <div className="text-center">
                    <div className="font-medium">Speaker B</div>
                    <div className="text-xs opacity-75">{languageNames[userBLang]?.native}</div>
                  </div>
                </Button>
              </div>

              {/* Recording Button */}
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`w-full h-16 text-lg ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : isListening ? (
                  <>
                    <MicOff className="w-6 h-6 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>

              {/* Current Input Display */}
              {(currentText || isTranslating) && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-700 mb-2">
                    {isTranslating ? "Translating..." : "Listening..."}
                  </div>
                  <p className="text-sm">{currentText}</p>
                  {isTranslating && (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      <span className="text-xs text-blue-600">
                        Converting to {languageNames[currentSpeaker === "A" ? userBLang : userALang]?.name}...
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Clear Button */}
              <Button variant="outline" onClick={clearHistory} className="w-full bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            </CardContent>
          </Card>

          {/* Conversation History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5" />
                Conversation ({messages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Languages className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Start speaking to begin translation</p>
                  <p className="text-xs mt-1">Messages will appear here automatically</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={message.speaker === "A" ? "default" : "secondary"} className="text-xs">
                          Speaker {message.speaker} • {languageNames[message.fromLang]?.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>
                      </div>

                      {/* Original Text */}
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs font-medium text-blue-700 mb-1">
                          Original ({languageNames[message.fromLang]?.name})
                        </div>
                        <p className="text-sm">{message.originalText}</p>
                      </div>

                      {/* Translated Text */}
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-xs font-medium text-green-700 mb-1">
                          Translated ({languageNames[message.toLang]?.name})
                        </div>
                        <p className="text-sm font-medium">{message.translatedText}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
