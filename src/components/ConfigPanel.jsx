import React, { useState } from 'react'
import { autoFillConfig, nomineeConfigs, getNomineeConfig } from '../config/autoFill'

const ConfigPanel = ({ config: initialConfig, onConfigUpdate }) => {
  const [config, setConfig] = useState(initialConfig)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNominee, setSelectedNominee] = useState('ngozi')

  const handleChange = (field, value) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    onConfigUpdate(newConfig)
  }
  
  const handleNomineeChange = (nomineeType) => {
    setSelectedNominee(nomineeType)
    const newConfig = getNomineeConfig(nomineeType)
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
          <h3 className="font-bold text-eloy-primary mb-6 text-lg">Select Nominee</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Nominee Configuration
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => handleNomineeChange('ngozi')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedNominee === 'ngozi'
                    ? 'border-eloy-primary bg-eloy-primary text-white'
                    : 'border-gray-300 hover:border-eloy-primary'
                }`}
              >
                <div className="text-2xl mb-2">👗</div>
                <div className="font-semibold text-sm">Ngozi Chiadika</div>
                <div className="text-xs opacity-75">Fashion</div>
              </button>
              <button
                onClick={() => handleNomineeChange('oluchukwu_finance')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedNominee === 'oluchukwu_finance'
                    ? 'border-eloy-primary bg-eloy-primary text-white'
                    : 'border-gray-300 hover:border-eloy-primary'
                }`}
              >
                <div className="text-2xl mb-2">💰</div>
                <div className="font-semibold text-sm">Oluchukwu Chiadika</div>
                <div className="text-xs opacity-75">Finance</div>
              </button>
              <button
                onClick={() => handleNomineeChange('oluchukwu_education')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedNominee === 'oluchukwu_education'
                    ? 'border-eloy-primary bg-eloy-primary text-white'
                    : 'border-gray-300 hover:border-eloy-primary'
                }`}
              >
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-semibold text-sm">Oluchukwu Chiadika</div>
                <div className="text-xs opacity-75">Education</div>
              </button>
              <button
                onClick={() => handleNomineeChange('oluchukwu_technology')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedNominee === 'oluchukwu_technology'
                    ? 'border-eloy-primary bg-eloy-primary text-white'
                    : 'border-gray-300 hover:border-eloy-primary'
                }`}
              >
                <div className="text-2xl mb-2">💻</div>
                <div className="font-semibold text-sm">Oluchukwu Chiadika</div>
                <div className="text-xs opacity-75">Technology</div>
              </button>
            </div>
          </div>
          
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
              <input
                type="text"
                value={config.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-eloy-primary focus:outline-none bg-gray-50"
                readOnly
              />
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-bold text-eloy-primary mb-6 text-lg">Optional Nominee Contact (Alternating)</h3>
            <p className="text-sm text-gray-600 mb-4">
              These fields will be used when the system randomly decides to fill optional nominee information:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nominee Email Address
                </label>
                <input
                  type="email"
                  value={config.nominee_email}
                  onChange={(e) => handleChange('nominee_email', e.target.value)}
                  placeholder="nominee@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-eloy-primary focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nominee Phone Number
                </label>
                <input
                  type="tel"
                  value={config.nominee_phone}
                  onChange={(e) => handleChange('nominee_phone', e.target.value)}
                  placeholder="+2348123456789"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-eloy-primary focus:outline-none"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nominee Website
                </label>
                <input
                  type="url"
                  value={config.nominee_website}
                  onChange={(e) => handleChange('nominee_website', e.target.value)}
                  placeholder="https://www.nominee-website.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-eloy-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">📝 How it works:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• <strong>Nominee Selection:</strong> Choose from Ngozi (Fashion) or Oluchukwu (Finance/Education/Technology)</li>
              <li>• <strong>Fixed fields:</strong> Nominee name, Instagram, LinkedIn, and category stay the same</li>
              <li>• <strong>Random fields:</strong> Nominator details (Your Name, Email, Phone) and reasons change each time</li>
              <li>• <strong>Optional fields:</strong> Nominee email/phone/website alternate randomly:</li>
              <li className="ml-4">- 30% chance: All empty</li>
              <li className="ml-4">- 30% chance: 1-2 fields filled with configured data</li>
              <li className="ml-4">- 40% chance: All fields filled with configured data</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfigPanel