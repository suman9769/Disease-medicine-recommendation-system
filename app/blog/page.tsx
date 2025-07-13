import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Healthcare: Bridging Traditional and Modern Medicine",
    excerpt:
      "Exploring how artificial intelligence is revolutionizing healthcare by integrating traditional healing practices with modern medical science.",
    author: "Dr. Sarah Patel",
    date: "March 15, 2024",
    category: "AI Healthcare",
    readTime: "5 min read",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "Home Remedies That Actually Work: Science-Backed Natural Treatments",
    excerpt:
      "A comprehensive guide to traditional home remedies that have been validated by modern scientific research.",
    author: "Alex Johnson",
    date: "March 10, 2024",
    category: "Natural Medicine",
    readTime: "7 min read",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "Understanding Symptoms: When to Seek Medical Help",
    excerpt:
      "Learn to identify warning signs and understand when symptoms require immediate medical attention versus home care.",
    author: "Dr. Rajesh Kumar",
    date: "March 5, 2024",
    category: "Health Education",
    readTime: "6 min read",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    title: "The Power of Preventive Care: Building Healthy Habits",
    excerpt:
      "Discover how simple daily habits and preventive measures can significantly improve your long-term health outcomes.",
    author: "Dr. Priya Sharma",
    date: "February 28, 2024",
    category: "Prevention",
    readTime: "4 min read",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 5,
    title: "Traditional Indian Spices and Their Medicinal Properties",
    excerpt:
      "Explore the therapeutic benefits of common Indian spices and how to incorporate them into your daily health routine.",
    author: "Dr. Amit Verma",
    date: "February 22, 2024",
    category: "Traditional Medicine",
    readTime: "8 min read",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 6,
    title: "Mental Health and Physical Wellness: The Mind-Body Connection",
    excerpt:
      "Understanding how mental health impacts physical wellness and practical strategies for holistic health management.",
    author: "Dr. Lisa Chen",
    date: "February 18, 2024",
    category: "Mental Health",
    readTime: "6 min read",
    image: "/placeholder.svg?height=200&width=400",
  },
]

const categories = [
  "All",
  "AI Healthcare",
  "Natural Medicine",
  "Health Education",
  "Prevention",
  "Traditional Medicine",
  "Mental Health",
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Health & Wellness Blog</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Expert insights, health tips, and the latest in medical AI technology
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Badge
              key={category}
              className={`cursor-pointer px-4 py-2 ${
                category === "All"
                  ? "bg-sky-500 text-white hover:bg-sky-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Post */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-12">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="Featured post"
                  className="w-full h-64 lg:h-full object-cover rounded-l-xl"
                />
                <Badge className="absolute top-4 left-4 bg-rose-500 text-white">Featured</Badge>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-3 bg-sky-100 text-sky-800 border-sky-200">AI Healthcare</Badge>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  The Future of AI in Healthcare: Bridging Traditional and Modern Medicine
                </h2>
                <p className="text-slate-600 mb-6">
                  Exploring how artificial intelligence is revolutionizing healthcare by integrating traditional healing
                  practices with modern medical science.
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Dr. Sarah Patel</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>March 15, 2024</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium">
                  Read More <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <Card
              key={post.id}
              className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <Badge className="absolute top-3 left-3 bg-white/90 text-slate-700 border-0">{post.readTime}</Badge>
                </div>
                <div className="p-6">
                  <Badge className="mb-3 bg-emerald-100 text-emerald-800 border-emerald-200">{post.category}</Badge>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <button className="text-sky-600 hover:text-sky-700 text-sm font-medium">Read More</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-sky-500 to-blue-600 text-white mt-16">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated with Health Insights</h2>
            <p className="mb-6 opacity-90">
              Subscribe to our newsletter for the latest health tips, AI healthcare updates, and wellness advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl text-slate-800 border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-sky-600 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                Subscribe
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
