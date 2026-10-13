import Contact from './components/Contact.tsx'
import Drinks from './components/Drinks.tsx'
import Footer from './components/Footer.tsx'
import Gallery from './components/Gallery.tsx'
import Header from './components/Header.tsx'
import Hero from './components/Hero.tsx'
import Hours from './components/Hours.tsx'
import Marquee from './components/Marquee.tsx'
import Menu from './components/Menu.tsx'
import MobileBar from './components/MobileBar.tsx'
import SkipLink from './components/SkipLink.tsx'
import Story from './components/Story.tsx'
import { useRevealOnScroll } from './hooks/useRevealOnScroll.ts'
import { LanguageProvider } from './i18n/LanguageProvider.tsx'

function Page() {
  useRevealOnScroll()
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee />
        <Story />
        <Drinks />
        <Menu />
        <Gallery />
        <Hours />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Page />
    </LanguageProvider>
  )
}
