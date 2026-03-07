import { Outlet } from 'react-router-dom'
import Header from './Header'
import ScrollIndicator from './ScrollIndicator'
import PartnersSection from './PartnersSection'
import Footer from './Footer'

export default function PublicLayout() {
  return (
    <>
      <Header />
      <ScrollIndicator />
      <Outlet />
      <PartnersSection />
      <Footer />
    </>
  )
}



