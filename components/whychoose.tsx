import { BookOpen, Lightbulb, Heart } from "lucide-react"

export default function WhyLearnSection() {
  const features = [
    {
      icon: <BookOpen className="w-12 h-12 text-emerald-400" />,
      number: "01",
      title: "Learn",
      description:
        "Master new skills through interactive lessons and practical exercises designed to enhance your understanding.",
    },
    {
      icon: <Lightbulb className="w-12 h-12 text-emerald-400" />,
      number: "02",
      title: "Experience",
      description:
        "Put your knowledge into practice with real-world projects and hands-on activities that solidify your learning.",
    },
    {
      icon: <Heart className="w-12 h-12 text-emerald-400" />,
      number: "03",
      title: "Feel",
      description:
        "Connect with your learning journey emotionally and build confidence as you progress through each milestone.",
    },
  ]

  return (
    <section className="bg-white py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why learn with our courses?</h2>
          <p className="">Transform your learning journey through our innovative approach</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 rounded-lg border border-indigo-800 bg-indigo-950 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  <span className="opacity-80">{feature.number}. </span>
                  {feature.title}
                </h3>
                <p className="text-indigo-200">{feature.description}</p>
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-emerald-400/10 to-transparent -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

