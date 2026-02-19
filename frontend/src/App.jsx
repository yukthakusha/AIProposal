import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ProposalReview from './pages/ProposalReview'
import Navbar from './components/Navbar'

function App() {
  const isAuthenticated = () => !!localStorage.getItem('token')

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Dashboard />
            </>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Profile />
            </>
          </ProtectedRoute>
        } />
        <Route path="/proposal/:id" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <ProposalReview />
            </>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
