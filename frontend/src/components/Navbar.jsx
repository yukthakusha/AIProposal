import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl sticky top-0 z-40">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer">
          <span className="text-4xl animate-pulse">✨</span>
          <span className="bg-white bg-clip-text text-transparent">GovPreneurs AI</span>
        </h1>
        <div className="flex gap-8 items-center">
          <Link to="/" className="hover:text-yellow-300 transition font-semibold flex items-center gap-2 text-lg hover:scale-110 transform">
            <span className="text-2xl">🏠</span> Dashboard
          </Link>
          <Link to="/profile" className="hover:text-yellow-300 transition font-semibold flex items-center gap-2 text-lg hover:scale-110 transform">
            <span className="text-2xl">💼</span> Profile
          </Link>
          <button onClick={handleLogout} className="bg-white text-purple-600 px-6 py-3 rounded-xl hover:bg-yellow-300 hover:text-purple-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105">
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
