import { createContext, useContext, useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:5001/api/v1'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    status: 'loading',
    user: null,
  })

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Not authenticated')
      const user = await res.json()
      setState({ status: 'authenticated', user })
    } catch {
      setState({ status: 'unauthenticated', user: null })
    }
  }

  const login = async (email, password, remember) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember }),
      credentials: 'include',
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Login failed: ${res.status} ${text}`)
    }
    await checkSession()
  }

  const signup = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
      credentials: 'include',
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Signup failed: ${res.status} ${text}`)
    }
    await checkSession()
  }

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    setState({ status: 'unauthenticated', user: null })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
