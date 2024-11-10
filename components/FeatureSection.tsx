import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Video, Lock, Zap } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Instant Messaging',
    description:
      'Send and receive messages in real-time with friends and family.',
  },
  {
    icon: Video,
    title: 'Video Calls',
    description: 'Connect face-to-face with crystal clear video calls.',
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Your conversations are secure with our advanced encryption.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Experience swift message delivery and seamless performance.',
  },
]

export default function FeatureSection() {
  return (
    <section className="py-10 bg-white/10 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Why Choose ChitChat?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/20 backdrop-blur-sm border-none"
            >
              <CardHeader>
                <feature.icon className="h-10 w-10 text-purple-500 mb-4" />
                <CardTitle className="text-xl font-semibold text-black">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
