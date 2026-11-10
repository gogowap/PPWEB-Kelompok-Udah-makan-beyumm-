import apiClient from './apiClient'

export async function authenticateUser(username, password) {
  const cleanUser = String(username ?? '').trim()
  const cleanPass = String(password ?? '')

  const response = await apiClient.get('/users.json')
  const users = Array.isArray(response.data) ? response.data : []

  const matchedUser = users.find(
    (u) => u.username.toLowerCase() === cleanUser.toLowerCase()
  )

  if (matchedUser) {
    if (matchedUser.password !== cleanPass) {
      throw new Error('Password yang Anda masukkan tidak sesuai.')
    }
    return {
      id: matchedUser.id,
      username: matchedUser.username,
      nama: matchedUser.nama,
      role: matchedUser.role,
    }
  }

  return {
    id: Date.now(),
    username: cleanUser,
    nama: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
    role: 'Staf Gudang',
  }
}
