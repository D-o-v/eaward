import React, { useState } from 'react'
import NominationForm from './components/NominationForm'
import SubmissionsList from './components/SubmissionsList'

function App() {
  const [activeTab, setActiveTab] = useState('nominate')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-eloy-primary mb-6 drop-shadow-sm">
            ELOY Awards 2025 Nominator
          </h1>
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
              View Submissions
            </button>
          </nav>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-8">
          {activeTab === 'nominate' ? <NominationForm /> : <SubmissionsList />}
        </main>
      </div>
    </div>
  )
}

export default App