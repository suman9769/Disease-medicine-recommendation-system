"use client"

import React,{useState,useRef}from 'react';
import { Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Mic,
  Heart,
  Shield,
  Pill,
  Leaf,
  Home,
  Dumbbell,
  UtensilsCrossed,
  Activity,
  Search,
} from "lucide-react"
import { Header } from "@/components/header"

interface PredictionResult {
  disease: string
  description: string
  severity: string
  precautions: string[]
  medications: string[]
  traditionalMedicines: string[]
  homeRemedies: string[]
  diet: string
  workouts: string[]
  consultationAdvice: string
}

export default function MedicalPredictionApp() {
  const [symptoms, setSymptoms] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState("")
  const [activeSection, setActiveSection] = useState<string>("overview")

  const handlePredict = async () => {
    if (!symptoms.trim()) {
      setError("Please enter your symptoms")
      return
    }

    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: symptoms.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get prediction")
      }

      setResult(data)
      setActiveSection("overview")
    } catch (err) {
      setError("Unable to process your request. Please try again.")
      console.error("Prediction error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setError("Listening... Please describe your symptoms")
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSymptoms(transcript)
        setError("")
      }

      recognition.onerror = () => {
        setError("Speech recognition failed. Please try typing instead.")
      }

      recognition.start()
    } else {
      setError("Speech recognition is not supported in this browser.")
    }
  }



const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
const fileInputRef = useRef<HTMLInputElement>(null)

const handleVideoInput = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click()
  } else {
    setError("Video input is not available.")
  }
}

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file) {
    if (file.type.startsWith("video/")) {
      if (file.size > 500* 1024 * 1024) {
        setError("Video file size must be less than 50MB")
        return
      }
      setUploadedVideo(file)
      setError("")
    } else {
      setError("Please select a valid video file")
    }
  }
}

  const sectionButtons = [
    { key: "overview", label: "Overview", icon: Activity, color: "bg-sky-500 hover:bg-sky-600" },
    { key: "precautions", label: "Precautions", icon: Shield, color: "bg-amber-500 hover:bg-amber-600" },
    { key: "medications", label: "Medicines", icon: Pill, color: "bg-rose-500 hover:bg-rose-600" },
    { key: "traditionalMedicines", label: "Traditional", icon: Leaf, color: "bg-emerald-500 hover:bg-emerald-600" },
    { key: "homeRemedies", label: "Home Care", icon: Home, color: "bg-violet-500 hover:bg-violet-600" },
    { key: "diet", label: "Diet Plan", icon: UtensilsCrossed, color: "bg-orange-500 hover:bg-orange-600" },
    { key: "workouts", label: "Exercise", icon: Dumbbell, color: "bg-indigo-500 hover:bg-indigo-600" },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "moderate":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "severe":
        return "bg-rose-50 text-rose-700 border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const formatContent = (content: string) => {
    return content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  }

  const renderSectionContent = () => {
    if (!result) return null

    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{result.disease}</h3>
                {result.severity && (
                  <Badge className={`${getSeverityColor(result.severity)} border font-medium`}>
                    {result.severity} Condition
                  </Badge>
                )}
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-5">
              <p
                className="text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatContent(result.description) }}
              />
            </div>

            {result.consultationAdvice && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Medical Consultation
                </h4>
                <p
                  className="text-amber-700"
                  dangerouslySetInnerHTML={{ __html: formatContent(result.consultationAdvice) }}
                />
              </div>
            )}
          </div>
        )

      case "precautions":
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              Safety Precautions
            </h3>
            <div className="grid gap-4">
              {result.precautions.map((precaution, index) => (
                <div key={index} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold text-lg">•</span>
                    <span className="text-slate-700" dangerouslySetInnerHTML={{ __html: formatContent(precaution) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "medications":
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Pill className="h-5 w-5 text-rose-600" />
              Modern Medications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.medications.map((medication, index) => (
                <div key={index} className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                  <span
                    className="text-rose-700 font-medium"
                    dangerouslySetInnerHTML={{ __html: formatContent(medication) }}
                  />
                </div>
              ))}
            </div>
          </div>
        )

      case "traditionalMedicines":
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              Traditional Indian Medicines
            </h3>
            <div className="grid gap-4">
              {result.traditionalMedicines?.map((medicine, index) => (
                <div key={index} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <span className="text-emerald-700" dangerouslySetInnerHTML={{ __html: formatContent(medicine) }} />
                </div>
              ))}
            </div>
          </div>
        )

      case "homeRemedies":
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Home className="h-5 w-5 text-violet-600" />
              Home Remedies & Natural Care
            </h3>
            <div className="grid gap-4">
              {result.homeRemedies?.map((remedy, index) => (
                <div key={index} className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                  <span className="text-violet-700" dangerouslySetInnerHTML={{ __html: formatContent(remedy) }} />
                </div>
              ))}
            </div>
          </div>
        )

      case "diet":
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-orange-600" />
              Dietary Recommendations
            </h3>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
              <p
                className="text-orange-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatContent(result.diet) }}
              />
            </div>
          </div>
        )

      case "workouts":
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-indigo-600" />
              Recommended Exercises
            </h3>
            <div className="grid gap-4">
              {result.workouts.map((workout, index) => (
                <div key={index} className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <span className="text-indigo-700" dangerouslySetInnerHTML={{ __html: formatContent(workout) }} />
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">AI Medical Assistant</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get comprehensive health analysis with focus on Indian traditional medicines and home remedies
          </p>
        </div>

        {/* Symptom Input Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-slate-800">Describe Your Symptoms</CardTitle>
            <p className="text-slate-600 mt-2">Enter your symptoms for personalized medical guidance</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Enter symptoms separated by commas (e.g., fever, headache, body ache, fatigue)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="pl-12 py-4 text-lg border-slate-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleSpeechRecognition}
                variant="outline"
                className="flex items-center space-x-2 border-slate-300 hover:bg-slate-50 rounded-xl py-3"
                disabled={isLoading}
              >
                <Mic className="h-4 w-4" />
                <span>Voice Input</span>
              </Button>

              <Button
                onClick={handleVideoInput}
                variant="outline"
                className="flex items-center space-x-2 border-slate-300 hover:bg-slate-50 rounded-xl py-3"
                disabled={isLoading}
              >
                <Video className="h-4 w-4" />
                <span>Video Input</span>
              </Button>

<input
  type="file"
  accept="video/*"
  ref={fileInputRef}
  onChange={handleFileChange}
  className="hidden"
/>
              <Button
                onClick={handlePredict}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg"
                disabled={isLoading || !symptoms.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2" />
                    Get Medical Analysis
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <p className="text-rose-700 text-center">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">Medical Analysis Results</h2>
              <p className="text-slate-600">Comprehensive health guidance with traditional medicine focus</p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-lg p-3">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {sectionButtons.map((section) => {
                  const IconComponent = section.icon
                  return (
                    <Button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      variant={activeSection === section.key ? "default" : "ghost"}
                      className={`flex flex-col items-center space-y-2 p-4 h-auto rounded-xl transition-all duration-200 ${
                        activeSection === section.key
                          ? section.color + " text-white shadow-lg"
                          : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="text-xs font-medium">{section.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Content Display */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">{renderSectionContent()}</CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

