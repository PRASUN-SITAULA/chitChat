import FeatureSection from '@/components/FeatureSection'
import Footer from '@/components/Footer'
import HeroSection from '@/components/Hero'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await currentUser()
  if (!user) {
    return { error: 'Unauthorized User' }
  } else {
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
