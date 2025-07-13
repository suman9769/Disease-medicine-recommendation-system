import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Users, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">About MediBot</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Empowering healthcare through AI-driven medical assistance with a focus on traditional Indian medicine and
            accessible treatments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-rose-500" />
                <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                To democratize healthcare by providing intelligent, accessible medical guidance that combines modern
                medical knowledge with traditional Indian healing practices. We believe everyone deserves quality
                healthcare information.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-emerald-500" />
                <h2 className="text-2xl font-bold text-slate-800">Our Vision</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                To create a world where advanced AI technology bridges the gap between traditional wisdom and modern
                medicine, making healthcare guidance accessible to everyone, everywhere.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">AI-Powered Analysis</h3>
                <p className="text-slate-600 text-sm">
                  Advanced artificial intelligence provides comprehensive symptom analysis and health recommendations
                </p>
              </div>
              <div className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Traditional Medicine</h3>
                <p className="text-slate-600 text-sm">
                  Integration of traditional Indian medicinal knowledge with modern healthcare practices
                </p>
              </div>
              <div className="text-center">
                <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Home Remedies</h3>
                <p className="text-slate-600 text-sm">
                  Practical home remedies using common household ingredients for natural healing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Important Notice</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <p className="text-amber-800 leading-relaxed">
                <strong>Medical Disclaimer:</strong> MediBot is an AI-powered educational tool designed to provide
                general health information and guidance. It is not a substitute for professional medical advice,
                diagnosis, or treatment. Always consult with qualified healthcare professionals for any medical concerns
                or before making any decisions related to your health or treatment.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
