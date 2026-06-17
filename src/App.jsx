import React from 'react'
import { Outlet } from 'react-router'
import Navbar from './Components/Navbar/Navbar'
import HeroSection from './Components/HeroSection/HeroSection'
import Services from './Components/Services/Services'
import HowItWorks from './Components/HowItWorks/HowItWorks'
import GetToKnow from './Components/GetToKnow/GetToKnow'
import Testimonials from './Components/Testimonials/Testimonials'
import FAQS from './Components/Faqs/Faqs'
import Footer from './Components/Footer/Footer'


function App() {
  return (
  <>
  <Navbar/>
  <HeroSection/>
  <Services/>
  <HowItWorks/>  
  <GetToKnow/>
  <Testimonials/>
 <FAQS/>
 <Footer/>

  <Outlet/>

  </>
  )
}

export default App