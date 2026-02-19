import { useState, useEffect } from 'react'

function Profile() {
  const [profile, setProfile] = useState({
    companyName: '',
    naicsCodes: '',
    coreCapabilities: '',
    pastPerformance: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.company_name) {
        setProfile({
          companyName: data.company_name || '',
          naicsCodes: data.naics_codes || '',
          coreCapabilities: data.core_capabilities || '',
          pastPerformance: data.past_performance || ''
        })
      }
    } catch (err) {
      console.error('Failed to fetch profile')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch('http://localhost:5000/api/save-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      alert('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">💼</div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">Company Profile</h1>
          <p className="text-gray-600 text-xl">Complete your profile to generate AI-powered proposals</p>
        </div>
        
        {success && (
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-5 rounded-2xl mb-8 shadow-xl text-center font-bold text-lg animate-pulse">
            ✅ Profile saved successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-purple-100">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Company Name</label>
          <input
            type="text"
            value={profile.companyName}
            onChange={(e) => setProfile({...profile, companyName: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">NAICS Codes</label>
          <input
            type="text"
            value={profile.naicsCodes}
            onChange={(e) => setProfile({...profile, naicsCodes: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 541512, 541519"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Core Capabilities</label>
          <textarea
            value={profile.coreCapabilities}
            onChange={(e) => setProfile({...profile, coreCapabilities: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Past Performance</label>
          <textarea
            value={profile.pastPerformance}
            onChange={(e) => setProfile({...profile, pastPerformance: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
        >
          {loading ? '⏳ Saving...' : '💾 Save Profile'}
        </button>
      </form>
      </div>
    </div>
  )
}

export default Profile
