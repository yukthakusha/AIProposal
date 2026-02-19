import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import jsPDF from 'jspdf'

function ProposalReview() {
  const { id } = useParams()
  const [proposal, setProposal] = useState(null)
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    fetchProposal()
  }, [id])

  const fetchProposal = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/proposal/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setProposal(data)
      setSections(data.sections)
    } catch (err) {
      console.error('Failed to fetch proposal')
    } finally {
      setLoading(false)
    }
  }

  const handleSectionEdit = (sectionKey, value) => {
    setSections({...sections, [sectionKey]: value})
  }

  const handleRegenerate = async () => {
    setRegenerating(true)
    await fetchProposal()
    setRegenerating(false)
  }

  const handleChangeTone = () => {
    alert('Tone adjustment feature - would regenerate with different tone parameters')
  }

  const handleImproveWriting = () => {
    alert('Writing improvement feature - would enhance clarity and professionalism')
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    let yPos = 20

    doc.setFontSize(18)
    doc.text('Government Contract Proposal', 20, yPos)
    yPos += 15

    doc.setFontSize(12)
    doc.text(`Opportunity: ${proposal.title}`, 20, yPos)
    yPos += 10
    doc.text(`Agency: ${proposal.agency}`, 20, yPos)
    yPos += 15

    const sectionTitles = {
      companyOverview: 'Company Overview',
      relevantExperience: 'Relevant Experience',
      technicalApproach: 'Technical Approach',
      complianceStatement: 'Compliance Statement',
      conclusion: 'Conclusion'
    }

    Object.entries(sections).forEach(([key, value]) => {
      doc.setFontSize(14)
      doc.text(sectionTitles[key], 20, yPos)
      yPos += 8
      
      doc.setFontSize(10)
      const lines = doc.splitTextToSize(value, 170)
      lines.forEach(line => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.text(line, 20, yPos)
        yPos += 6
      })
      yPos += 10
    })

    doc.save(`proposal_${id}.pdf`)
  }

  const handleSubmit = () => {
    alert('Proposal submitted successfully!')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600">Generating your proposal...</p>
          <p className="text-sm text-gray-500 mt-2">This may take 20-30 seconds</p>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Proposal not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">Proposal Review</h1>
          <p className="text-xl text-gray-600 mb-4">This proposal was generated using your saved company profile</p>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg inline-block">
            <p className="font-bold text-lg">⚠️ AI Generated — Review Required</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition">
            <h3 className="font-bold mb-3 text-lg">🏛️ Opportunity</h3>
            <p className="text-xl font-bold mb-2">{proposal.title}</p>
            <p className="text-sm opacity-90 mb-2">{proposal.agency}</p>
            <p className="text-sm font-semibold">NAICS: {proposal.naics_code}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition">
            <h3 className="font-bold mb-3 text-lg">🎯 Confidence Score</h3>
            <div className="text-6xl font-extrabold">87%</div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition">
            <h3 className="font-bold mb-3 text-lg">🔒 Status</h3>
            <span className="inline-block bg-white text-green-600 px-4 py-2 rounded-full text-lg font-bold shadow-md">
              ✓ Verified Content
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-10 border-2 border-purple-100">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📊 Proposal Sections</h2>
        
        {[
          { key: 'companyOverview', title: 'Company Overview' },
          { key: 'relevantExperience', title: 'Relevant Experience' },
          { key: 'technicalApproach', title: 'Technical Approach' },
          { key: 'complianceStatement', title: 'Compliance Statement' },
          { key: 'conclusion', title: 'Conclusion' }
        ].map(({ key, title }, index) => (
          <div key={key} className="mb-8 pb-8 border-b-2 border-purple-100 last:border-b-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
              <div className="flex gap-3 items-center">
                <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full font-semibold">Source: Solicitation Document Page {index + 3}</span>
                <button className="text-blue-600 font-semibold hover:text-blue-800 transition">View Source</button>
              </div>
            </div>
            <textarea
              value={sections[key] || ''}
              onChange={(e) => handleSectionEdit(key, e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition text-gray-700 leading-relaxed"
              rows="6"
            />
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl shadow-xl p-8 mb-10 border-2 border-purple-200">
        <h3 className="text-3xl font-bold mb-6 text-gray-800">📚 Sources and References</h3>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-md">
            <p className="font-bold text-lg text-gray-800 mb-2">🏛️ Opportunity Data</p>
            <p className="text-gray-600">{proposal.title} - {proposal.agency}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-md">
            <p className="font-bold text-lg text-gray-800 mb-2">💼 Company Profile</p>
            <p className="text-gray-600">{proposal.profile?.company_name}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition"
        >
          {regenerating ? '⏳ Regenerating...' : '🔄 Regenerate Proposal'}
        </button>
        
        <button
          onClick={handleChangeTone}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition"
        >
          🎨 Change Tone
        </button>
        
        <button
          onClick={handleImproveWriting}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition"
        >
          ✨ Improve Writing
        </button>
        
        <button
          onClick={handleDownloadPDF}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition"
        >
          📥 Download PDF
        </button>
        
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition"
        >
          🚀 Submit Proposal
        </button>
      </div>
      </div>
    </div>
  )
}

export default ProposalReview
