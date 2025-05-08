import React from 'react'
import Navbar from "../components/Navbar/Navbar.jsx"
import Banner from "../components/Banner/Banner.jsx"
import Feature from "../components/FeatureSection/Feature.jsx"
import Footer from "../components/Footer/Footer.jsx"
import SignupPage from './Signup.jsx'
const Home = () => {
  return (
    <div>
      <SignupPage/>
      <Navbar/>
      <Banner/>
      <Feature/>
      <Footer/>
    </div>
  )
}

export default Home
 