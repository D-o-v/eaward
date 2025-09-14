import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { autoFillConfig, generateRandomNominator } from '../config/autoFill'
import ConfigPanel from './ConfigPanel'

const NominationForm = ({ autoSubmit, toggleAutoSubmit, countdown }) => {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    ...autoFillConfig,
    ...generateRandomNominator()
  })

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
        
        // Auto-fill with new random nominator data
        const newData = {
          ...autoFillConfig,
          ...generateRandomNominator()
        }
        setFormData(newData)
        

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

      <div className="text-center mb-8">
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
          >
            ⚙️ Configuration
          </button>
          <button
            type="button"
            onClick={toggleAutoSubmit}
            className={`px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 shadow-2xl transform hover:scale-105 ${
              autoSubmit 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
            }`}
          >
            {autoSubmit ? '⏹️ STOP AUTO NOMINATIONS' : '🚀 START AUTO NOMINATIONS'}
          </button>
        </div>

      </div>

      <div className="bg-gradient-to-r from-eloy-primary to-eloy-secondary p-6 rounded-xl mb-8 text-white shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          📝 Current Submission Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <strong>👤 Nominator:</strong> {formData.nominator_first} {formData.nominator_last}
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <strong>📧 Nominator Email:</strong> {formData.nominator_email}
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <strong>📱 Nominator Phone:</strong> {formData.nominator_phone || 'Not provided'}
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <strong>👩 Nominee:</strong> {formData.nominee_first} {formData.nominee_last}
          </div>
        </div>
        <div className="mt-4 bg-white bg-opacity-20 p-4 rounded-lg">
          <strong>💬 Reason:</strong> {formData.reason?.substring(0, 150)}...
        </div>
      </div>

      {showConfig && <ConfigPanel />}

      <form onSubmit={handleSubmit} className="space-y-8">
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
                  value={formData.nominator_first}
                  onChange={handleChange}
                  placeholder="First"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  name="nominator_last"
                  value={formData.nominator_last}
                  onChange={handleChange}
                  placeholder="Last"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
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
                  value={formData.nominee_first}
                  onChange={handleChange}
                  placeholder="First"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  name="nominee_last"
                  value={formData.nominee_last}
                  onChange={handleChange}
                  placeholder="Last"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eloy-primary focus:border-transparent transition-all"
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
      </form>
    </div>
  )
}

export default NominationForm