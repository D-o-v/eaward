import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { autoFillConfig, generateRandomNominator } from '../config/autoFill'
import ConfigPanel from './ConfigPanel'

// Submission Tabs Component
const SubmissionTabs = ({ currentSubmissions }) => {
  const [activeTab, setActiveTab] = useState(0)

  const getTabInfo = (index) => {
    switch(index) {
      case 0: return { icon: '👗', title: 'Fashion', color: 'from-pink-500 to-purple-600' }
      case 1: return { icon: '💰', title: 'Finance', color: 'from-green-500 to-blue-600' }
      case 2: return { icon: '🎓', title: 'Education', color: 'from-blue-500 to-indigo-600' }
      case 3: return { icon: '💻', title: 'Technology', color: 'from-purple-500 to-pink-600' }
      default: return { icon: '📝', title: 'Submission', color: 'from-gray-500 to-gray-600' }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-eloy-primary border-opacity-20">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {currentSubmissions.map((_, index) => {
          const tabInfo = getTabInfo(index)
          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                activeTab === index
                  ? `bg-gradient-to-r ${tabInfo.color} text-white`
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="text-2xl mb-1">{tabInfo.icon}</div>
              <div className="text-sm font-bold">{tabInfo.title}</div>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {currentSubmissions.map((submission, index) => {
          if (activeTab !== index) return null
          
          const tabInfo = getTabInfo(index)
          
          return (
            <div key={index} className="space-y-6">
              <div className={`bg-gradient-to-r ${tabInfo.color} text-white p-4 rounded-lg text-center`}>
                <div className="text-3xl mb-2">{tabInfo.icon}</div>
                <h4 className="text-xl font-bold">{submission.category}</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nominee Info */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg border border-blue-200">
                  <h5 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    🏆 Nominee Information
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> <span className="text-blue-700 font-bold">{submission.nominee_first} {submission.nominee_last}</span></div>
                    <div><strong>Instagram:</strong> <span className="text-blue-700 break-all">{submission.nominee_instagram}</span></div>
                    <div><strong>LinkedIn:</strong> <span className="text-blue-700 text-xs break-all">{submission.nominee_linkedin}</span></div>
                    <div><strong>Email:</strong> <span className="text-blue-700">{submission.nominee_email}</span></div>
                    <div><strong>Phone:</strong> <span className="text-blue-700">{submission.nominee_phone}</span></div>
                    {submission.nominee_website && (
                      <div><strong>Website:</strong> <span className="text-blue-700 text-xs break-all">{submission.nominee_website}</span></div>
                    )}
                  </div>
                </div>

                {/* Nominator Info */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border border-green-200">
                  <h5 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    👤 Nominator Information
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> <span className="text-green-700">{submission.nominator_first} {submission.nominator_last}</span></div>
                    <div><strong>Email:</strong> <span className="text-green-700">{submission.nominator_email}</span></div>
                    <div><strong>Phone:</strong> <span className="text-green-700">{submission.nominator_phone || 'Not provided'}</span></div>
                  </div>
                </div>
              </div>

              {/* Nomination Reason */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-4 rounded-lg border border-yellow-200">
                <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                  💬 Nomination Reason
                </h5>
                <div className="bg-white p-3 rounded border border-orange-200">
                  <p className="text-orange-700 text-sm leading-relaxed italic">
                    "{submission.reason}"
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="bg-gray-50 p-4 text-center border-t">
        <p className="text-sm text-gray-600">
          ⏰ These submissions will be sent automatically when the countdown reaches 0
        </p>
      </div>
    </div>
  )
}



const NominationForm = ({ autoSubmit, toggleAutoSubmit, countdown, currentSubmissions, config, onConfigUpdate }) => {
  const [categories, setCategories] = useState([])
  
  // Show hardcoded nominees when auto-submit is active
  const getDisplayFormData = () => {
    if (autoSubmit && currentSubmissions && currentSubmissions.length > 0) {
      return currentSubmissions[0] // Show first submission (Fashion)
    }
    return {
      ...autoFillConfig,
      ...generateRandomNominator()
    }
  }
  
  const [formData, setFormData] = useState(getDisplayFormData())
  
  // Update form display when auto-submit changes
  useEffect(() => {
    setFormData(getDisplayFormData())
  }, [autoSubmit, currentSubmissions])

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://eaward.onrender.com/api/categories')
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
        const details = response.data.submission_details
        const detailsText = `
✅ SUCCESS: ${response.data.message}

📡 SUBMISSION DETAILS:
• URL: ${details.url}
• Method: ${details.method}
• Referer: ${details.referer_url}
• Token: ${details.form_data?.token}
• Form ID: ${details.form_data?.form_id}

📤 HEADERS SENT:
${Object.entries(details.headers || {}).map(([k,v]) => `• ${k}: ${v}`).join('\n')}

📋 PAYLOAD SENT:
${Object.entries(details.payload || {}).map(([k,v]) => `• ${k}: ${v}`).join('\n')}

📥 ELOY RESPONSE:
• Status: ${details.response?.status_code}
• Content: ${details.response?.content}
        `
        
        setMessage({ type: 'success', text: detailsText })
        
        // Auto-fill with new random nominator data only if not in auto-submit mode
        if (!autoSubmit) {
          const newData = {
            ...autoFillConfig,
            ...generateRandomNominator()
          }
          setFormData(newData)
        }
        

      } else {
        const details = response.data.submission_details
        const errorText = `❌ ERROR: ${response.data.message}\n\nDetails: ${JSON.stringify(details, null, 2)}`
        setMessage({ type: 'error', text: errorText })
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Submission failed: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="max-w-4xl mx-auto">
      {message && (
        <div className={`mb-6 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <pre className="whitespace-pre-wrap">{message.text}</pre>
        </div>
      )}

      {!autoSubmit && (
        <div className="text-center mb-8">
          <button
            type="button"
            onClick={toggleAutoSubmit}
            className="px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 shadow-2xl transform hover:scale-105 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            🚀 START AUTO NOMINATIONS
          </button>
        </div>
      )}

      {autoSubmit && currentSubmissions && currentSubmissions.length === 4 ? (
        <SubmissionTabs currentSubmissions={currentSubmissions} />
      ) : (
        <div>
          {/* <div className="text-center mb-8">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg mr-4"
            >
              ⚙️ Configuration
            </button>
          </div>
          
          {showConfig && <ConfigPanel config={config} onConfigUpdate={onConfigUpdate} />} */}
          
          {/* <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="nominator_first"
                      value={formData.nominator_first || ''}
                      onChange={handleChange}
                      placeholder="First"
                      required
                      readOnly={autoSubmit}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all ${autoSubmit ? 'bg-gray-100' : ''}`}
                    />
                    <input
                      type="text"
                      name="nominator_last"
                      value={formData.nominator_last || ''}
                      onChange={handleChange}
                      placeholder="Last"
                      required
                      readOnly={autoSubmit}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all ${autoSubmit ? 'bg-gray-100' : ''}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your phone number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                      Nigeria +234
                    </span>
                    <input
                      type="tel"
                      name="nominator_phone"
                      value={formData.nominator_phone?.replace('+234', '') || ''}
                      onChange={(e) => handleChange({target: {name: 'nominator_phone', value: '+234' + e.target.value}})}
                      placeholder="0802 123 4567"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your email address *
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
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomination Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                  >
                    <option value="">ELOY Award for Entrepreneur</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nominee name *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="nominee_first"
                      value={formData.nominee_first || ''}
                      onChange={handleChange}
                      placeholder="First"
                      required
                      readOnly={autoSubmit}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all ${autoSubmit ? 'bg-gray-100' : ''}`}
                    />
                    <input
                      type="text"
                      name="nominee_last"
                      value={formData.nominee_last || ''}
                      onChange={handleChange}
                      placeholder="Last"
                      required
                      readOnly={autoSubmit}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all ${autoSubmit ? 'bg-gray-100' : ''}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nominee Instagram Handle *
                  </label>
                  <input
                    type="text"
                    name="nominee_instagram"
                    value={formData.nominee_instagram}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nominee Linkedin page *
                  </label>
                  <input
                    type="text"
                    name="nominee_linkedin"
                    value={formData.nominee_linkedin}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for nomination
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all resize-y"
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nominee email address (if known)
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
                    Nominee Phone number (if known)
                  </label>
                  <input
                    type="tel"
                    name="nominee_phone"
                    value={formData.nominee_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nominee website
                  </label>
                  <input
                    type="url"
                    name="nominee_website"
                    value={formData.nominee_website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="consent"
                  checked={true}
                  readOnly
                  className="mt-1 h-4 w-4 text-eloy-primary focus:ring-eloy-primary border-gray-300 rounded"
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  By submitting your data, you consent that your data can be processed by ELOY Awards Foundation for registration & marketing purposes in accordance with our privacy policy * *
                  <span className="block mt-1 font-semibold text-green-600">YES</span>
                </label>
              </div>
            </section>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-eloy-primary to-eloy-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Submitting...' : '🚀 Submit Nomination'}
              </button>
            </div>
          </form> */}
        </div>
      )}
    </div>
  )
}

export default NominationForm