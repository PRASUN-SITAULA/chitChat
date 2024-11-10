import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageCircle } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-blue-700 to-red-600 blur-3xl opacity-65"></div>
      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Connect with friends, instantly
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-100">
            ChitChat brings you closer to your loved ones. Send messages, share
            moments, and stay connected no matter where you are.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            {/* Add a button for the sign up form */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white text-black border-white hover:bg-purple-700 hover:text-white font-semibold"
            >
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-purple-600 text-white border-white hover:bg-purple-700 font-semibold"
            >
              <Link href="/features">
                Learn More
                <MessageCircle className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
