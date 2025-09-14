import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { autoFillConfig, generateRandomContact } from '../config/autoFill'

const NominationForm = () => {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    ...autoFillConfig,
    ...generateRandomContact()
  })
  const [autoSubmit, setAutoSubmit] = useState(false)
  const [submitInterval, setSubmitInterval] = useState(null)
  const [nextSubmitTime, setNextSubmitTime] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await axios.post('/api/submit', formData)
      
      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message })
        // Auto-fill with new random contact data
        setFormData({
          ...autoFillConfig,
          ...generateRandomContact()
        })
      } else {
        setMessage({ type: 'error', text: response.data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Submission failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const getRandomInterval = () => {
    return Math.floor(Math.random() * (120000 - 30000) + 30000) // 30s to 2min
  }

  const scheduleNextSubmit = () => {
    const interval = getRandomInterval()
    setNextSubmitTime(Date.now() + interval)
    
    const timeout = setTimeout(() => {
      if (!loading && autoSubmit) {
        // Generate new random data and submit
        const newData = {
          ...autoFillConfig,
          ...generateRandomContact()
        }
        setFormData(newData)
        handleSubmit({ preventDefault: () => {} })
        scheduleNextSubmit() // Schedule next random submission
      }
    }, interval)
    
    setSubmitInterval(timeout)
  }

  const toggleAutoSubmit = () => {
    if (autoSubmit) {
      clearTimeout(submitInterval)
      setSubmitInterval(null)
      setAutoSubmit(false)
      setCountdown(0)
    } else {
      // Fill with random data and start
      const newData = {
        ...autoFillConfig,
        ...generateRandomContact()
      }
      setFormData(newData)
      setAutoSubmit(true)
      scheduleNextSubmit()
    }
  }

  // Countdown timer effect
  useEffect(() => {
    let countdownInterval
    if (autoSubmit && nextSubmitTime > 0) {
      countdownInterval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((nextSubmitTime - Date.now()) / 1000))
        setCountdown(remaining)
        if (remaining === 0) {
          clearInterval(countdownInterval)
        }
      }, 1000)
    }
    return () => {
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, [autoSubmit, nextSubmitTime])

  useEffect(() => {
    return () => {
      if (submitInterval) {
        clearTimeout(submitInterval)
      }
    }
  }, [submitInterval])

  return (
    <div className="max-w-4xl mx-auto">
      {message && (
        <div className={`mb-6 p-4 rounded-lg font-medium ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="text-center mb-8">
        <button
          type="button"
          onClick={toggleAutoSubmit}
          className={`px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105 ${
            autoSubmit 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {autoSubmit ? '⏹️ STOP AUTO SUBMIT' : '🚀 START AUTO SUBMIT'}
        </button>
        
        {autoSubmit && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-4 text-blue-800">
              <span className="animate-pulse text-2xl">🔄</span>
              <div className="text-center">
                <div className="font-bold text-lg">Auto-Submit Active</div>
                <div className="text-sm">
                  Next submission in: <span className="font-mono text-lg">{countdown}s</span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Random intervals: 30s - 2min
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Form Data (Auto-Generated)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Nominee:</strong> {formData.nominee_first} {formData.nominee_last}</div>
          <div><strong>Email:</strong> {formData.nominee_email || 'Not provided'}</div>
          <div><strong>Phone:</strong> {formData.nominee_phone || 'Not provided'}</div>
          <div><strong>Reason:</strong> {formData.reason?.substring(0, 100)}...</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-eloy-primary">
            Your Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="nominator_first"
                value={formData.nominator_first}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="nominator_last"
                value={formData.nominator_last}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="nominator_phone"
                value={formData.nominator_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="nominator_email"
                value={formData.nominator_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-eloy-primary">
            Nomination Details
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nominee First Name *
                </label>
                <input
                  type="text"
                  name="nominee_first"
                  value={formData.nominee_first}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nominee Last Name *
                </label>
                <input
                  type="text"
                  name="nominee_last"
                  value={formData.nominee_last}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Handle *
                </label>
                <input
                  type="text"
                  name="nominee_instagram"
                  value={formData.nominee_instagram}
                  onChange={handleChange}
                  placeholder="@username"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile *
                </label>
                <input
                  type="text"
                  name="nominee_linkedin"
                  value={formData.nominee_linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn URL"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Nomination
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Why do you nominate this person?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all resize-y"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-eloy-primary">
            Optional Nominee Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nominee Email
              </label>
              <input
                type="email"
                name="nominee_email"
                value={formData.nominee_email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nominee Phone
              </label>
              <input
                type="tel"
                name="nominee_phone"
                value={formData.nominee_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nominee Website
            </label>
            <input
              type="url"
              name="nominee_website"
              value={formData.nominee_website}
              onChange={handleChange}
              placeholder="https://"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-eloy-primary to-eloy-secondary text-white font-semibold py-4 px-6 rounded-lg hover:from-eloy-secondary hover:to-eloy-primary transform hover:-translate-y-1 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Submitting...' : 'Submit Nomination'}
        </button>
      </form>
    </div>
  )
}

export default NominationForm