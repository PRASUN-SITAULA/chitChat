import FeatureSection from '@/components/FeatureSection'
import Footer from '@/components/Footer'
import HeroSection from '@/components/Hero'
// import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export default async function Home() {
  const { userId } = await auth()
  if (userId) {
    redirect('/chat')
  }
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <Footer />
    </>
  )
}
