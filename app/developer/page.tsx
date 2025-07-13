import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, Code, Brain, Heart, Users, Star } from "lucide-react"

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Meet Our Team</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Passionate about creating AI-powered healthcare solutions that make a difference
          </p>
        </div>

        {/* Team Members */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Developer 1 */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-sky-200">
                <img 
                  src="/assets/satyajit2.jpg" 
                  alt="Satyajit Nayak"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Satyajit Nayak</h2>
              <p className="text-slate-600 mb-4">AI DEVELOPER</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-slate-600 hover:text-sky-600 transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-600 hover:text-sky-600 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-600 hover:text-sky-600 transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Developer 2 */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-emerald-200">
                <img 
                  src="/assets/suman2.jpg" 
                  alt="Suman Dutta"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Suman Dutta</h2>
              <p className="text-slate-600 mb-4">FULLSTACK DEVELOPER</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Guide */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-amber-200">
                <img 
                  src="/assets/dg2.jpg" 
                  alt="Debasis Guha"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Debasis Guha</h2>
              <p className="text-slate-600 mb-4">Project Guide</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-slate-600 hover:text-amber-600 transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-600 hover:text-amber-600 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-600 hover:text-amber-600 transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About the Team */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-sky-500" />
                <h3 className="text-2xl font-bold text-slate-800">About Our Team</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                We are a dedicated team of developers and mentors with a shared passion for artificial intelligence and healthcare
                technology. Together, we bring diverse expertise in full-stack development, AI implementation, and project guidance
                to create innovative healthcare solutions.
              </p>
              <p className="text-slate-600 leading-relaxed">
                MediBot represents our collective commitment to democratizing healthcare through technology. By combining modern
                AI capabilities with traditional medical knowledge, we aim to make quality healthcare guidance
                accessible to everyone, regardless of their location or economic status.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="h-6 w-6 text-violet-500" />
                <h3 className="text-2xl font-bold text-slate-800">Technical Expertise</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Frontend & Backend</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-sky-100 text-sky-800 border-sky-200">React</Badge>
                    <Badge className="bg-sky-100 text-sky-800 border-sky-200">Next.js</Badge>
                    <Badge className="bg-sky-100 text-sky-800 border-sky-200">TypeScript</Badge>
                    <Badge className="bg-sky-100 text-sky-800 border-sky-200">Node.js</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">AI & Machine Learning</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Python</Badge>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">AI SDK</Badge>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Google AI</Badge>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Healthcare AI</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Goals */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mt-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-6 w-6 text-rose-500" />
              <h3 className="text-2xl font-bold text-slate-800">Our Mission</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2"></div>
                  <p className="text-slate-600">
                    <strong>Accessibility:</strong> Make healthcare guidance available to everyone, especially in
                    underserved communities
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <p className="text-slate-600">
                    <strong>Integration:</strong> Combine traditional Indian medicine wisdom with modern medical
                    knowledge
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                  <p className="text-slate-600">
                    <strong>Education:</strong> Provide comprehensive health education and preventive care guidance
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2"></div>
                  <p className="text-slate-600">
                    <strong>Innovation:</strong> Continuously improve AI capabilities to provide better health
                    insights
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}