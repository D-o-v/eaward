import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

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

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <p className="text-gray-500 text-lg">No submissions yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {submissions.map((submission) => (
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
      )}
    </div>
  )
}

export default SubmissionsList