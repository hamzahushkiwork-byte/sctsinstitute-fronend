import HeroSlider from '../components/HeroSlider'
import WelcomeSection from '../components/WelcomeSection'
import HomeHighlights from '../components/HomeHighlights'
import HeartSection from '../components/HeartSection'
import TrainingProgramsSection from '../components/TrainingProgramsSection'
import HolisticApproachSection from '../components/HolisticApproachSection'

function Home() {
  return (
    <div>
      <HeroSlider />
      <WelcomeSection />
      <HomeHighlights />
      <HeartSection />
      <TrainingProgramsSection />
      <HolisticApproachSection />
    </div>
  )
}

export default Home
