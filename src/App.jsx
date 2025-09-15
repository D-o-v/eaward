import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import NominationForm from './components/NominationForm'
import SubmissionsList from './components/SubmissionsList'
import { autoFillConfig, generateRandomNominator } from './config/autoFill'

// Hardcoded nominees
const nominees = {
  fashion: {
    firstName: 'Ngozi',
    lastName: 'Chiadika',
    instagram: ['https://www.instagram.com/afrifashionpromotion?igsh=a3hqNmNwMW9ocXI2', 'https://www.instagram.com/gozifego?igsh=MWY3M3FzeXIybmp4ZQ=='],
    linkedin: 'https://www.linkedin.com/in/ngozi-chiadika?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    email: 'afrifashionpromotion@gmail.com',
    phone: '+234 8165924260',
    website: 'https://afrifashionpromotion.com/',
    category: 'ELOY Award for Fashion',
    reasons: [
      'Exceptional leadership in promoting African fashion globally',
      'Outstanding contribution to fashion industry development',
      'Innovative approach to fashion promotion and marketing',
      'Dedicated mentor to emerging fashion designers',
      'Pioneering work in sustainable fashion practices',
      'Excellence in fashion brand development and growth'
    ]
  },
  finance: {
    firstName: 'Oluchukwu',
    lastName: 'Chiadika',
    instagram: ['https://www.instagram.com/personalfinancegirl', '@personalfinancegirl'],
    linkedin: 'https://www.linkedin.com/in/oluchukwu-chiadika-29366311b/',
    email: 'yourpersonalfinancegirl@gmail.com',
    phone: '+234 808 543 9337',
    website: 'https://yourpersonalfinancegirl.com/',
    categories: ['ELOY Award for Finance', 'ELOY Award in Education', 'ELOY Award for Tech'],
    reasons: {
      finance: [
        'Outstanding expertise in personal finance education',
        'Exceptional contribution to financial literacy programs',
        'Innovative approach to financial planning and advisory',
        'Dedicated mentor in financial empowerment',
        'Excellence in financial content creation and education'
      ],
      education: [
        'Exceptional educational content creation and delivery',
        'Outstanding contribution to financial education programs',
        'Innovative teaching methods in personal finance',
        'Dedicated educator empowering individuals financially',
        'Excellence in educational outreach and impact'
      ],
      tech: [
        'Innovative use of technology in financial education',
        'Outstanding contribution to fintech solutions',
        'Excellence in digital financial literacy platforms',
        'Pioneering work in financial technology adoption',
        'Exceptional tech-driven financial empowerment initiatives'
      ]
    }
  }
}

const generateNomineeData = (nominee, category) => {
  const randomInstagram = Array.isArray(nominee.instagram) 
    ? nominee.instagram[Math.floor(Math.random() * nominee.instagram.length)]
    : nominee.instagram
  
  let reasons
  if (nominee === nominees.fashion) {
    reasons = nominee.reasons
  } else {
    const categoryKey = category.includes('Finance') ? 'finance' 
      : category.includes('Education') ? 'education' : 'tech'
    reasons = nominee.reasons[categoryKey]
  }
  
  return {
    firstName: nominee.firstName,
    lastName: nominee.lastName,
    instagram: randomInstagram,
    linkedin: nominee.linkedin,
    email: nominee.email,
    phone: nominee.phone,
    website: nominee.website,
    category: category,
    reason: reasons[Math.floor(Math.random() * reasons.length)]
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

  const generateThreeSubmissions = () => {
    const submissions = []
    
    // 1. Fashion submission
    submissions.push(generateNomineeData(nominees.fashion, nominees.fashion.category))
    
    // 2. Finance submission (always Finance)
    submissions.push(generateNomineeData(nominees.finance, 'ELOY Award for Finance'))
    
    // 3. Random Education or Tech submission
    const randomCategory = Math.random() < 0.5 ? 'ELOY Award in Education' : 'ELOY Award for Tech'
    submissions.push(generateNomineeData(nominees.finance, randomCategory))
    
    return submissions
  }

  const scheduleNextSubmit = () => {
    if (!autoSubmit) return
    
    // Generate 3 submissions (1 fashion + 2 finance)
    const submissions = generateThreeSubmissions()
    setCurrentSubmissions(submissions)
    
    const interval = getRandomInterval()
    const nextTime = Date.now() + interval
    setNextSubmitTime(nextTime)
    setCountdown(Math.ceil(interval / 1000))
    setIsSubmitting(false)
    
    console.log('Next 3 submissions in:', Math.ceil(interval / 1000), 'seconds')
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
      
      // Generate first 3 submissions
      const firstSubmissions = generateThreeSubmissions()
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
    
    console.log('Submitting 3 nominations...')
    
    // Submit all 3 nominations
    for (let i = 0; i < currentSubmissions.length; i++) {
      const submission = currentSubmissions[i]
      const result = await handleSubmit(submission)
      console.log(`Submission ${i + 1} result:`, result)
      
      // Small delay between submissions
      if (i < currentSubmissions.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    console.log('All 3 submissions completed')
    
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