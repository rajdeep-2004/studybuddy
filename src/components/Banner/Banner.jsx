import React from 'react'
import "./Banner.css"
import { Link } from 'react-router-dom'

const Banner = () => {
  return (
        <div className='content'>
            <h1>Study Smarter, Together</h1>
            <p>Form study groups, share resources, and ace your exams with Study Buddy - the ultimate collaborative learning platform.</p>
            <Link to="/dashboard"><button className="cta">Get Started</button></Link>
        </div>

  )
}

export default Banner
