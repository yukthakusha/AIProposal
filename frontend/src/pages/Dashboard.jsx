import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(null)
  const [showGenerating, setShowGenerating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/opportunities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setOpportunities(data)
    } catch (err) {
      console.error('Failed to fetch opportunities')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateProposal = async (opportunityId) => {
    setGenerating(opportunityId)
    setShowGenerating(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ opportunityId })
      })

      const data = await response.json()

      if (response.ok) {
        setShowGenerating(false)
        navigate(`/proposal/${data.proposalId}`)
      } else {
        setShowGenerating(false)
        alert(data.error || 'Failed to generate proposal. Please complete your company profile first.')
      }
    } catch (err) {
      setShowGenerating(false)
      alert('Failed to generate proposal')
    } finally {
      setGenerating(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading opportunities...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {showGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-md transform scale-100 animate-pulse">
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">✨</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">Generating proposal...</h3>
            <p className="text-gray-600 text-lg">AI is crafting your custom proposal</p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Government Contract Opportunities</h1>
          <p className="text-gray-600 text-xl">Select an opportunity to generate your AI-powered proposal</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp) => (
            <div key={opp.id} className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border-2 border-transparent hover:border-blue-400 transform hover:-translate-y-2">
              <div className="flex items-start justify-between mb-4">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md">{opp.naics_code}</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Deadline</span>
                  <span className="text-sm font-semibold text-red-600">{opp.deadline}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">{opp.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏛️</span>
                <p className="text-sm text-gray-600 font-semibold">{opp.agency}</p>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">{opp.description}</p>
              
              <button
                onClick={() => handleGenerateProposal(opp.id)}
                disabled={generating === opp.id}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                {generating === opp.id ? '⏳ Generating...' : '✨ Generate Proposal'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
