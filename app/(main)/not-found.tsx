import Link from 'next/link'
import { Frown, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-red-500 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-white tracking-widest">
            404
          </h1>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center animate-bounce">
            <Frown className="text-white w-24 h-24 opacity-50" />
          </div>
        </div>
        <p className="text-2xl font-medium text-white">
          Oops! The page you`&apos;re looking for doesn`&apos;t exist.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300 ease-in-out group"
          >
            <Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Go back home
          </Link>
        </div>
        <p className="mt-2 text-sm text-white">
          Lost? Don`&apos;t worry, we`&apos;ve got you covered.
        </p>
      </div>
    </div>
  )
}
