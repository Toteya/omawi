const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:5001/api/v1'

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Request failed: ${res.status} ${text}`)
  }
  return res.json()
}

export async function getComposers() {
  return request('/composers')
}

export async function getSongs(composerId) {
  if (composerId === undefined || composerId === null || composerId === '') {
    return request('/songs')
  }
  return request(`/composers/${composerId}/songs`)
}

export async function getSongMelody(songId) {
  const melodies = await request(`/songs/${songId}/melodies`)
  // Return the filepath of the melody or undefined if melody not found
  // TO BE UPDATED: For now just return the first melody object in the array
  return melodies?.[0]?.filepath
}

export async function getMelodyMedia(filepath) {
  const res = await fetch(`${API_BASE}/melodies/media/${filepath}`)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Request failed: ${res.status} ${text}`)
  }
  return res
}

export async function getSongLyrics(songId) {
  return request(`/songs/${songId}/verses`)
}

export async function loginUser(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function getCurrentUser() {
  return request('/auth/me')
}

export async function signupUser(email, name, password) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, name, password }),
  })
}

export async function logoutUser() {
  return request('/auth/logout', {
    method: 'POST',
  })
}
