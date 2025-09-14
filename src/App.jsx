import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import NominationForm from './components/NominationForm'
import SubmissionsList from './components/SubmissionsList'
import { autoFillConfig, generateRandomNominator } from './config/autoFill'

function App() {
  const [activeTab, setActiveTab] = useState('nominate')
  const [autoSubmit, setAutoSubmit] = useState(false)
  const [nextSubmitTime, setNextSubmitTime] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [config, setConfig] = useState(autoFillConfig)
  const [currentFormData, setCurrentFormData] = useState({
    ...config,
    ...generateRandomNominator(config)
  })
  
  const handleConfigUpdate = (newConfig) => {
    setConfig(newConfig)
    // Update current form data with new config
    setCurrentFormData({
      ...newConfig,
      ...generateRandomNominator(newConfig)
    })
  }
  const submitIntervalRef = useRef(null)
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

  const scheduleNextSubmit = () => {
    if (!autoSubmit) return
    
    // Generate fresh random data immediately
    const newData = {
      ...config,
      ...generateRandomNominator(config)
    }
    
    // Update displayed form data immediately
    setCurrentFormData(newData)
    
    const interval = getRandomInterval()
    const nextTime = Date.now() + interval
    setNextSubmitTime(nextTime)
    setCountdown(Math.ceil(interval / 1000))
    
    const timeout = setTimeout(async () => {
      if (autoSubmit) {
        // Show submitting status
        setIsSubmitting(true)
        setCountdown(0)
        
        // Submit the data
        const result = await handleSubmit(newData)
        console.log('Auto-submission result:', result)
        
        // Hide submitting status
        setIsSubmitting(false)
        
        // Continue the cycle
        scheduleNextSubmit()
      }
    }, interval)
    
    submitIntervalRef.current = timeout
  }

  const toggleAutoSubmit = () => {
    if (autoSubmit) {
      // Stop auto-submission
      clearTimeout(submitIntervalRef.current)
      clearInterval(countdownIntervalRef.current)
      setAutoSubmit(false)
      setCountdown(0)
      setNextSubmitTime(0)
      setIsSubmitting(false)
    } else {
      // Start auto-submission
      setAutoSubmit(true)
      setIsSubmitting(false)
      
      // Generate and show first submission data
      const firstData = {
        ...config,
        ...generateRandomNominator(config)
      }
      setCurrentFormData(firstData)
      
      // Set initial countdown
      const initialDelay = 3000
      const startTime = Date.now() + initialDelay
      setNextSubmitTime(startTime)
      setCountdown(Math.ceil(initialDelay / 1000))
      
      // Submit first one after countdown
      const firstTimeout = setTimeout(async () => {
        setIsSubmitting(true)
        setCountdown(0)
        
        const result = await handleSubmit(firstData)
        console.log('First auto-submission result:', result)
        
        setIsSubmitting(false)
        
        // Start the continuous cycle
        scheduleNextSubmit()
      }, initialDelay)
      
      submitIntervalRef.current = firstTimeout
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
        }
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (submitIntervalRef.current) clearTimeout(submitIntervalRef.current)
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
                    ) : countdown > 0 ? (
                      <span>
                        Next submission in: <span className="font-mono text-lg text-green-600 bg-white px-2 py-1 rounded">{countdown}s</span>
                      </span>
                    ) : (
                      <span className="font-mono text-lg text-blue-600 bg-white px-2 py-1 rounded">
                        ⚙️ Preparing...
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
              currentFormData={currentFormData}
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