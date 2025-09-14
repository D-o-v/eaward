import React, { useState } from 'react'
import { autoFillConfig } from '../config/autoFill'

const ConfigPanel = ({ onConfigUpdate }) => {
  const [config, setConfig] = useState(autoFillConfig)
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (field, value) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    onConfigUpdate(newConfig)
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-eloy-primary hover:bg-eloy-secondary text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
      >
        ⚙️ Configuration Settings
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-4 p-6 bg-white rounded-lg border-2 border-eloy-primary shadow-lg">
          <h3 className="font-bold text-eloy-primary mb-6 text-lg">Fixed Nominee Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nominee First Name
              </label>
              <input
                type="text"
                value={config.nominee_first}
                onChange={(e) => handleChange('nominee_first', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-eloy-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nominee Last Name
              </label>
              <input
                type="text"
                value={config.nominee_last}
                onChange={(e) => handleChange('nominee_last', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-eloy-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nominee Instagram Handle
              </label>
              <input
                type="text"
                value={config.nominee_instagram}
                onChange={(e) => handleChange('nominee_instagram', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-eloy-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nominee LinkedIn Profile
              </label>
              <input
                type="text"
                value={config.nominee_linkedin}
                onChange={(e) => handleChange('nominee_linkedin', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-eloy-primary focus:outline-none"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomination Category
              </label>
              <select
                value={config.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-eloy-primary focus:outline-none"
              >
                <option value="ELOY Award for Entrepreneur">ELOY Award for Entrepreneur</option>
                <option value="ELOY Award for Finance">ELOY Award for Finance</option>
                <option value="ELOY Award for Tech">ELOY Award for Tech</option>
                <option value="ELOY Award for Media">ELOY Award for Media</option>
                <option value="ELOY Award for Fashion">ELOY Award for Fashion</option>
                <option value="ELOY for Health & Wellness">ELOY for Health & Wellness</option>
                <option value="ELOY Award in Education">ELOY Award in Education</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">📝 Note:</h4>
            <p className="text-blue-700 text-sm">
              These are the <strong>fixed nominee details</strong> that will stay the same for all submissions. 
              The nominator details (Your Name, Email, Phone) and reasons will be randomly generated for each submission.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfigPanel