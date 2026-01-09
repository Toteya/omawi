import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import About from './pages/About.jsx'
import Admin from './pages/Admin.jsx'
import Navbar from './components/Navbar.jsx'
import PageWrapper from './layouts/PageWrapper.jsx'
import './App.css'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { status, user } = useAuth()
  if (status === 'loading') {
    return <div>Loading...</div>
  }
  if (status === 'unauthenticated') {
    return <Navigate to='/login' />
  }
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to='/' />
  }
  return children
}

function App() {
  
  return (
    <>
      <AuthProvider>
        <Navbar />
        <PageWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </PageWrapper>
      </AuthProvider>
    </>
  )
}

export default App
