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
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        ⚙️ Configuration
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-4 p-6 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-4">Auto-Fill Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominator First Name
              </label>
              <input
                type="text"
                value={config.nominator_first}
                onChange={(e) => handleChange('nominator_first', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominator Last Name
              </label>
              <input
                type="text"
                value={config.nominator_last}
                onChange={(e) => handleChange('nominator_last', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominator Email
              </label>
              <input
                type="email"
                value={config.nominator_email}
                onChange={(e) => handleChange('nominator_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominator Phone
              </label>
              <input
                type="tel"
                value={config.nominator_phone}
                onChange={(e) => handleChange('nominator_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominee First Name
              </label>
              <input
                type="text"
                value={config.nominee_first}
                onChange={(e) => handleChange('nominee_first', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominee Last Name
              </label>
              <input
                type="text"
                value={config.nominee_last}
                onChange={(e) => handleChange('nominee_last', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={config.nominee_instagram}
                onChange={(e) => handleChange('nominee_instagram', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile
              </label>
              <input
                type="text"
                value={config.nominee_linkedin}
                onChange={(e) => handleChange('nominee_linkedin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomination Reason
            </label>
            <textarea
              value={config.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfigPanel