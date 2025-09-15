import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('fashion')
  const [currentPage, setCurrentPage] = useState({ fashion: 1, finance: 1 })
  const itemsPerPage = 6

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('https://eaward.onrender.com/api/submissions')
      setSubmissions(response.data.submissions)
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eloy-primary"></div>
      </div>
    )
  }

  // Filter submissions by nominee
  const fashionSubmissions = submissions.filter(s => 
    s.nominee_first === 'Ngozi' && s.nominee_last === 'Chiadika'
  )
  const financeSubmissions = submissions.filter(s => 
    s.nominee_first === 'Oluchukwu' && s.nominee_last === 'Chiadika'
  )

  // Pagination logic
  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = (data) => Math.ceil(data.length / itemsPerPage)

  const currentData = activeTab === 'fashion' ? fashionSubmissions : financeSubmissions
  const currentPageNum = currentPage[activeTab]
  const paginatedData = getPaginatedData(currentData, currentPageNum)
  const totalPages = getTotalPages(currentData)

  const handlePageChange = (page) => {
    setCurrentPage(prev => ({ ...prev, [activeTab]: page }))
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPageNum - 1))}
          disabled={currentPageNum === 1}
          className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ←
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-2 rounded-lg ${
              currentPageNum === i + 1
                ? 'bg-eloy-primary text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPageNum + 1))}
          disabled={currentPageNum === totalPages}
          className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Submission History
        </h2>
        <span className="bg-eloy-primary text-white px-4 py-2 rounded-full text-sm font-medium">
          {submissions.length} Total
        </span>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('fashion')}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg ${
            activeTab === 'fashion'
              ? 'bg-eloy-primary text-white transform -translate-y-1'
              : 'bg-white text-gray-600 hover:bg-gray-50 hover:transform hover:-translate-y-1'
          }`}
        >
          👗 Fashion ({fashionSubmissions.length})
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg ${
            activeTab === 'finance'
              ? 'bg-eloy-primary text-white transform -translate-y-1'
              : 'bg-white text-gray-600 hover:bg-gray-50 hover:transform hover:-translate-y-1'
          }`}
        >
          💰 Finance ({financeSubmissions.length})
        </button>
      </div>

      {paginatedData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            {activeTab === 'fashion' ? '👗' : '💰'}
          </div>
          <p className="text-gray-500 text-lg">
            No {activeTab} submissions yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {paginatedData.map((submission) => (
              <div
                key={submission.id}
                className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-eloy-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    #{submission.id}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(submission.timestamp)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-800 text-sm">Nominator</h4>
                    <p className="text-gray-600">{submission.nominator_first} {submission.nominator_last}</p>
                    <p className="text-gray-500 text-sm">{submission.nominator_email}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-800 text-sm">Nominee</h4>
                    <p className="text-gray-600">{submission.nominee_first} {submission.nominee_last}</p>
                    <p className="text-gray-500 text-sm">{submission.nominee_instagram}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-800 text-sm">Category</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{submission.category}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-800 text-sm">Token</h4>
                    <p className="text-gray-500 text-xs font-mono bg-gray-100 p-2 rounded break-all">
                      {submission.token}
                    </p>
                  </div>
                </div>

                {submission.reason && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">Reason</h4>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                      {submission.reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  )
}

export default SubmissionsList