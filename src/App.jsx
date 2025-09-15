import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import NominationForm from './components/NominationForm'
import SubmissionsList from './components/SubmissionsList'
import { autoFillConfig, generateRandomNominator, nominationReasons } from './config/autoFill'

// Fashion-specific reasons for Ngozi Chiadika
const fashionReasons = [
  'She has revolutionized African fashion promotion, creating platforms that showcase our designers to global audiences.',
  'Her innovative marketing strategies have helped countless fashion brands gain international recognition and grow their businesses.',
  'She mentors emerging designers with such passion, teaching them not just creativity but also business skills to succeed.',
  'Through her fashion promotion work, she has created jobs and opportunities for hundreds of people in the creative industry.',
  'She champions sustainable fashion practices, showing that African fashion can be both beautiful and environmentally conscious.',
  'Her fashion events and showcases have become must-attend gatherings that celebrate African creativity and craftsmanship.',
  'She has built bridges between traditional African fashion and modern global trends, preserving our heritage while embracing innovation.',
  'Her dedication to promoting African fashion has changed how the world sees our designs, fabrics, and cultural expressions.',
  'She uses her platform to tell the stories behind African fashion, giving voice to artisans and designers across the continent.',
  'Her work has inspired a new generation of fashion entrepreneurs who now see the global potential of African fashion.',
  'She has created sustainable income streams for local tailors, fabric makers, and fashion artisans through her promotion efforts.',
  'Her fashion promotion initiatives have helped preserve traditional African textile techniques while making them relevant for modern markets.',
  'She consistently advocates for fair trade practices in fashion, ensuring that African designers and artisans receive fair compensation.',
  'Her innovative use of digital platforms has made African fashion accessible to global consumers who previously had no access.',
  'She has transformed fashion shows from simple displays into cultural celebrations that educate and inspire audiences worldwide.',
  'She teaches fashion entrepreneurs how to build sustainable businesses that honor African heritage while competing globally.',
  'Her fashion promotion work has created a network of designers who support and collaborate with each other across Africa.',
  'She has made African fashion accessible to international buyers, opening new markets for our creative talents.',
  'Her dedication to quality and authenticity has elevated the reputation of African fashion in global luxury markets.',
  'She consistently promotes ethical fashion practices, ensuring that growth in the industry benefits everyone involved.',
  'Her fashion showcases have become cultural ambassadors, sharing African stories and values through beautiful designs.',
  'She has created educational programs that teach young people both the art and business of fashion.',
  'Her work has helped preserve traditional weaving, dyeing, and embroidery techniques that were at risk of being lost.',
  'She advocates for African fashion designers to own their intellectual property and build lasting brands.',
  'Her innovative approach to fashion marketing has shown how African brands can compete with international labels.',
  'She has built partnerships between African designers and international retailers, creating sustainable income streams.',
  'Her fashion promotion efforts have attracted international investment to African creative industries.',
  'She consistently highlights the stories of women artisans, giving them recognition and better market access.',
  'Her work has transformed how fashion buyers and consumers view African design—from exotic to essential.',
  'She has created mentorship programs that pair established designers with emerging talents, fostering industry growth.',
  'She organizes fashion weeks that celebrate African creativity and attract international media attention.',
  'Her work has helped African fashion designers access global supply chains and manufacturing partnerships.',
  'She has created online marketplaces that connect African designers directly with international customers.',
  'Her fashion promotion has helped preserve cultural heritage through contemporary design interpretations.',
  'She teaches designers how to price their work fairly and build profitable fashion businesses.',
  'Her networking events have created lasting partnerships between African designers and global fashion houses.',
  'She has developed training programs that teach fashion business skills to creative professionals.',
  'Her work has attracted fashion journalists and influencers to cover African fashion stories.',
  'She consistently promotes size-inclusive fashion that celebrates all body types and ages.',
  'Her fashion showcases have become platforms for social change and cultural dialogue.',
  'She has helped African designers navigate international trade regulations and export requirements.',
  'Her work has created fashion tourism opportunities that bring visitors to African creative hubs.',
  'She teaches sustainable production methods that reduce environmental impact in fashion.',
  'Her promotion efforts have helped African textiles gain recognition in luxury fashion markets.',
  'She has created scholarship programs for young people to study fashion design and business.',
  'Her work has helped establish African fashion as a legitimate investment category.',
  'She consistently advocates for gender equality and women\'s empowerment through fashion.',
  'Her fashion events have raised funds for community development and education projects.',
  'She has helped designers develop e-commerce capabilities to reach global markets.',
  'Her work has preserved traditional African fashion techniques for future generations.',
  'She teaches fashion photography and styling to help designers present their work professionally.',
  'Her promotion has helped African fashion gain coverage in international fashion magazines.',
  'She has created fashion incubators that support emerging designers with resources and mentorship.',
  'Her work has helped establish fashion design programs in African universities.',
  'She consistently promotes ethical labor practices in fashion manufacturing.',
  'Her fashion showcases have become cultural exchanges that build international understanding.',
  'She has helped designers access microfinance and funding opportunities for business growth.',
  'Her work has created fashion retail opportunities in both local and international markets.',
  'She teaches brand development and marketing strategies specifically for African fashion brands.',
  'Her promotion efforts have helped African fashion gain recognition at international trade shows.',
  'She has created fashion competitions that discover and support new talent across Africa.',
  'Her work has helped establish fashion districts and creative clusters in African cities.',
  'She consistently promotes fashion as a tool for economic development and job creation.',
  'Her fashion events have become platforms for discussing social issues and cultural identity.',
  'She has helped designers develop sustainable packaging and shipping solutions.',
  'Her work has created fashion export opportunities that bring foreign currency to African economies.',
  'She teaches intellectual property protection to help designers safeguard their creative work.',
  'Her promotion has helped African fashion gain recognition from international fashion councils.',
  'She has created fashion mentorship programs that pair industry veterans with newcomers.',
  'Her work has helped establish fashion museums and cultural centers celebrating African design.',
  'She consistently promotes fashion education and skills development in underserved communities.',
  'Her fashion showcases have become networking opportunities for industry professionals.',
  'She has helped designers access international fashion weeks and trade exhibitions.',
  'Her work has created fashion journalism opportunities that tell African fashion stories.',
  'She teaches digital marketing strategies specifically tailored for fashion brands.',
  'Her promotion efforts have helped African fashion gain celebrity endorsements and red carpet presence.',
  'She has created fashion styling services that help designers present their collections professionally.',
  'Her work has helped establish fashion buying offices that connect African designers with retailers.',
  'She consistently promotes fashion as a form of cultural expression and identity.',
  'Her fashion events have become fundraising platforms for charitable causes and community projects.',
  'She has helped designers develop quality control systems that meet international standards.',
  'Her work has created fashion consulting services that help brands navigate global markets.',
  'She teaches trend forecasting and market analysis to help designers stay competitive.',
  'Her promotion has helped African fashion gain recognition from international fashion critics.',
  'She has created fashion accelerator programs that fast-track promising designers to market.',
  'Her work has helped establish fashion law practices that protect designers\' rights.',
  'She consistently promotes fashion as a driver of innovation and technological advancement.',
  'Her fashion showcases have become cultural festivals that celebrate African creativity.',
  'She has helped designers access international fashion schools and training programs.',
  'Her work has created fashion investment funds that support African designer businesses.',
  'She teaches customer service and retail management skills to fashion entrepreneurs.',
  'Her promotion efforts have helped African fashion gain recognition in luxury department stores.',
  'She has created fashion research initiatives that document African fashion history and evolution.',
  'Her work has helped establish fashion cooperatives that support small-scale designers.',
  'She consistently promotes fashion as a tool for women\'s economic empowerment.',
  'Her fashion events have become platforms for cross-cultural collaboration and exchange.',
  'She has helped designers develop sustainable sourcing practices for materials and labor.',
  'Her work has created fashion distribution networks that reach both urban and rural markets.',
  'She teaches financial management and business planning specifically for fashion enterprises.',
  'Her promotion has helped African fashion gain recognition from international fashion buyers.',
  'She has created fashion design competitions that offer real business opportunities to winners.',
  'Her work has helped establish fashion trade associations that advocate for industry interests.',
  'She consistently promotes fashion as a form of artistic expression and cultural preservation.',
  'Her fashion showcases have become educational opportunities for students and young professionals.',
  'She has helped designers access international fashion fairs and exhibition opportunities.',
  'Her work has created fashion media platforms that amplify African designer voices.',
  'She teaches production planning and inventory management to fashion business owners.',
  'Her promotion efforts have helped African fashion gain recognition in international fashion awards.',
  'She has created fashion technology initiatives that modernize traditional production methods.',
  'Her work has helped establish fashion retail spaces that showcase African design talent.',
  'She consistently promotes fashion as a bridge between traditional crafts and modern commerce.',
  'Her fashion events have become networking hubs for creative professionals across Africa.',
  'She has helped designers develop export strategies that reach global fashion markets.',
  'Her work has created fashion education scholarships for disadvantaged youth.',
  'She teaches supply chain management and logistics for fashion businesses.',
  'Her promotion has helped African fashion gain recognition from international fashion institutions.',
  'She has created fashion innovation labs that experiment with new materials and techniques.',
  'Her work has helped establish fashion weeks in multiple African cities.',
  'She consistently promotes fashion as a catalyst for urban development and creative economy growth.',
  'Her fashion showcases have become platforms for addressing social and environmental issues.',
  'She has helped designers access international fashion residencies and exchange programs.',
  'Her work has created fashion documentation projects that preserve African design heritage.',
  'She teaches crisis management and business resilience to fashion entrepreneurs.',
  'Her promotion efforts have helped African fashion gain recognition in international fashion museums.',
  'She has created fashion startup incubators that provide comprehensive business support.',
  'Her work has helped establish fashion design as a legitimate career path in African education systems.',
  'She consistently promotes fashion as a tool for cultural diplomacy and international relations.',
  'Her fashion events have become celebrations of African identity and creative excellence.',
  'She has helped designers develop licensing and franchising opportunities for brand expansion.',
  'Her work has created fashion advocacy groups that lobby for industry-friendly policies.',
  'She teaches market research and consumer behavior analysis for fashion brands.',
  'Her promotion has helped African fashion gain recognition from international fashion foundations.',
  'She has created fashion mentorship networks that span across multiple African countries.',
  'Her work has helped establish fashion as a key component of African cultural tourism.',
  'She consistently promotes fashion as a means of preserving and celebrating African heritage.',
  'Her fashion showcases have become models for sustainable and ethical fashion practices.',
  'She has helped designers access international fashion weeks and runway opportunities.',
  'Her work has created fashion policy initiatives that support creative industry development.',
  'She teaches brand storytelling and narrative development for fashion marketing.',
  'Her promotion efforts have helped African fashion gain recognition in international fashion publications.',
  'She has created fashion community centers that serve as hubs for creative collaboration.',
  'Her work has helped establish fashion as a driver of social change and community development.',
  'She consistently promotes fashion as a celebration of African creativity, innovation, and entrepreneurial spirit.',
  'Her fashion events have become transformative experiences that inspire and empower the next generation of African designers.',
  'She has created lasting impact by building an ecosystem where African fashion can thrive globally while staying true to its roots.',
  'Her work continues to open doors, create opportunities, and change perceptions about African fashion worldwide.',
  'She has dedicated her life to ensuring that African fashion takes its rightful place on the global stage.',
  'Her vision and leadership have made African fashion promotion a respected and impactful field of work.',
  'She has built bridges between cultures, generations, and markets through the universal language of fashion.',
  'Her legacy will be measured not just in the success of individual designers, but in the transformation of an entire industry.',
  'She has proven that with passion, dedication, and strategic thinking, African fashion can compete and win globally.',
  'Her work has created a movement that celebrates African creativity while building sustainable economic opportunities.',
  'She continues to inspire, mentor, and empower others to carry forward the mission of promoting African fashion excellence.'
]

// Hardcoded nominees - these are the people being nominated
const nominees = {
  fashion: {
    firstName: 'Ngozi',
    lastName: 'Chiadika',
    instagram: 'https://www.instagram.com/afrifashionpromotion?igsh=a3hqNmNwMW9ocXI2',
    linkedin: 'https://www.linkedin.com/in/ngozi-chiadika?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    email: 'afrifashionpromotion@gmail.com',
    phone: '+234 8165924260',
    website: 'https://afrifashionpromotion.com/',
    category: 'ELOY Award for Fashion',
    reasons: fashionReasons
  },
  finance: {
    firstName: 'Oluchukwu',
    lastName: 'Chiadika',
    instagram: 'https://www.instagram.com/personalfinancegirl',
    linkedin: 'https://www.linkedin.com/in/oluchukwu-chiadika-29366311b/',
    email: 'yourpersonalfinancegirl@gmail.com',
    phone: '+234 808 543 9337',
    website: 'https://yourpersonalfinancegirl.com/',
    categories: ['ELOY Award for Finance', 'ELOY Award in Education', 'ELOY Award for Tech'],
    reasons: {
      finance: nominationReasons.slice(0, 50), // Use first 50 reasons for finance
      education: nominationReasons.slice(50, 100), // Use next 50 for education
      tech: nominationReasons.slice(100, 150) // Use next 50 for tech
    }
  }
}

const generateNomineeData = (nominee, category) => {
  // Use first Instagram if array, otherwise use as is
  const instagram = Array.isArray(nominee.instagram) 
    ? nominee.instagram[0]
    : nominee.instagram
  
  let reasons
  if (nominee === nominees.fashion) {
    reasons = nominee.reasons
  } else {
    const categoryKey = category.includes('Finance') ? 'finance' 
      : category.includes('Education') ? 'education' : 'tech'
    reasons = nominee.reasons[categoryKey]
  }
  
  // Generate random nominator data (person submitting the nomination)
  const nominatorData = generateRandomNominator()
  
  return {
    // Nominator (person submitting) - this should be random
    nominator_first: nominatorData.nominator_first,
    nominator_last: nominatorData.nominator_last,
    nominator_email: nominatorData.nominator_email,
    nominator_phone: nominatorData.nominator_phone,
    
    // Nominee (person being nominated) - this should be fixed
    nominee_first: nominee.firstName,
    nominee_last: nominee.lastName,
    nominee_instagram: instagram,
    nominee_linkedin: nominee.linkedin,
    nominee_email: nominee.email,
    nominee_phone: nominee.phone,
    nominee_website: nominee.website,
    
    // Nomination details
    category: category,
    reason: reasons[Math.floor(Math.random() * reasons.length)] // Random reason from appropriate category
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('nominate')
  const [autoSubmit, setAutoSubmit] = useState(false)
  const [nextSubmitTime, setNextSubmitTime] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [config, setConfig] = useState(autoFillConfig)
  const [currentSubmissions, setCurrentSubmissions] = useState([])
  
  const handleConfigUpdate = (newConfig) => {
    setConfig(newConfig)
  }
  const countdownIntervalRef = useRef(null)

  const getRandomInterval = () => {
    return Math.floor(Math.random() * (120000 - 30000) + 30000) // 30s to 2min
  }

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post('https://eaward.onrender.com/api/submit', formData)
      return response.data
    } catch (error) {
      return { success: false, message: `Submission failed: ${error.message}` }
    }
  }

  const generateFourSubmissions = () => {
    const submissions = []
    
    // 1. Fashion submission - Ngozi Chiadika
    submissions.push(generateNomineeData(nominees.fashion, nominees.fashion.category))
    
    // 2. Finance submission - Oluchukwu Chiadika
    submissions.push(generateNomineeData(nominees.finance, 'ELOY Award for Finance'))
    
    // 3. Education submission - Oluchukwu Chiadika
    submissions.push(generateNomineeData(nominees.finance, 'ELOY Award in Education'))
    
    // 4. Technology submission - Oluchukwu Chiadika
    submissions.push(generateNomineeData(nominees.finance, 'ELOY Award for Tech'))
    
    return submissions
  }

  const scheduleNextSubmit = () => {
    if (!autoSubmit) return
    
    // Generate 4 submissions (1 fashion + 3 for Oluchukwu)
    const submissions = generateFourSubmissions()
    setCurrentSubmissions(submissions)
    
    const interval = getRandomInterval()
    const nextTime = Date.now() + interval
    setNextSubmitTime(nextTime)
    setCountdown(Math.ceil(interval / 1000))
    setIsSubmitting(false)
    
    console.log('Next 4 submissions in:', Math.ceil(interval / 1000), 'seconds')
  }

  const toggleAutoSubmit = () => {
    if (autoSubmit) {
      // Stop auto-submission
      clearInterval(countdownIntervalRef.current)
      setAutoSubmit(false)
      setCountdown(0)
      setNextSubmitTime(0)
      setIsSubmitting(false)
    } else {
      // Start auto-submission
      setAutoSubmit(true)
      
      // Generate first 4 submissions
      const firstSubmissions = generateFourSubmissions()
      setCurrentSubmissions(firstSubmissions)
      
      // Start with random interval
      const interval = getRandomInterval()
      const nextTime = Date.now() + interval
      setNextSubmitTime(nextTime)
      setCountdown(Math.ceil(interval / 1000))
      setIsSubmitting(false)
      
      console.log('First submission in:', Math.ceil(interval / 1000), 'seconds')
    }
  }

  // Countdown timer effect
  useEffect(() => {
    if (autoSubmit && nextSubmitTime > 0 && !isSubmitting) {
      const updateCountdown = () => {
        const remaining = Math.max(0, Math.ceil((nextSubmitTime - Date.now()) / 1000))
        setCountdown(remaining)
        
        if (remaining === 0) {
          clearInterval(countdownIntervalRef.current)
          // Trigger submission when countdown reaches 0
          triggerSubmission()
        }
      }
      
      // Clear any existing interval
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
      
      // Update immediately
      updateCountdown()
      
      // Then update every second
      countdownIntervalRef.current = setInterval(updateCountdown, 1000)
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [autoSubmit, nextSubmitTime, isSubmitting])

  // Trigger submission function
  const triggerSubmission = async () => {
    if (!autoSubmit || isSubmitting || currentSubmissions.length === 0) return
    
    setIsSubmitting(true)
    setCountdown(0)
    
    console.log('Submitting 4 nominations...')
    
    // Submit all 4 nominations
    for (let i = 0; i < currentSubmissions.length; i++) {
      const submission = currentSubmissions[i]
      const result = await handleSubmit(submission)
      console.log(`Submission ${i + 1} result:`, result)
      
      // Small delay between submissions
      if (i < currentSubmissions.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    console.log('All 4 submissions completed')
    
    // Schedule next submission automatically
    scheduleNextSubmit()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-eloy-primary mb-6 drop-shadow-sm">
            ELOY Awards 2025 Nominator
          </h1>
          
          {autoSubmit && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200 shadow-lg">
              <div className="flex items-center justify-center gap-4 text-green-800">
                <div className="animate-spin text-2xl">🎆</div>
                <div className="text-center">
                  <div className="font-bold text-lg">Auto-Nominations Running</div>
                  <div className="text-sm mt-1">
                    {isSubmitting ? (
                      <span className="font-mono text-lg text-orange-600 bg-white px-2 py-1 rounded animate-pulse">
                        📤 Submitting...
                      </span>
                    ) : (
                      <span>
                        Next submission in: <span className="font-mono text-lg text-green-600 bg-white px-2 py-1 rounded">{countdown}s</span>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={toggleAutoSubmit}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                >
                  ⏹️ Stop
                </button>
              </div>
            </div>
          )}
          
          <nav className="flex justify-center gap-4">
            <button
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg ${
                activeTab === 'nominate'
                  ? 'bg-eloy-primary text-white transform -translate-y-1'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:transform hover:-translate-y-1'
              }`}
              onClick={() => setActiveTab('nominate')}
            >
              Submit Nomination
            </button>
            <button
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg ${
                activeTab === 'submissions'
                  ? 'bg-eloy-primary text-white transform -translate-y-1'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:transform hover:-translate-y-1'
              }`}
              onClick={() => setActiveTab('submissions')}
            >
              View Submissions ({autoSubmit ? 'Running' : 'Stopped'})
            </button>
          </nav>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-8">
          {activeTab === 'nominate' ? (
            <NominationForm 
              autoSubmit={autoSubmit}
              toggleAutoSubmit={toggleAutoSubmit}
              countdown={countdown}
              currentSubmissions={currentSubmissions}
              config={config}
              onConfigUpdate={handleConfigUpdate}
            />
          ) : (
            <SubmissionsList />
          )}
        </main>
      </div>
    </div>
  )
}

export default App