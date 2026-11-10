import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'
import logoGKP from '../assets/logo_GKP.png'
import { authenticateUser } from '../services/authService'
import { useInventaris } from '../hooks/useInventaris'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const { setCurrentUser } = useInventaris()

  function validateForm() {
    const nextErrors = {}

    if (!username.trim()) {
      nextErrors.username = 'Username wajib diisi.'
    }

    if (!password) {
      nextErrors.password = 'Password wajib diisi.'
    }

    return nextErrors
  }

  async function handleLogin(e) {
    e.preventDefault()
    setAuthError('')

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const userProfile = await authenticateUser(username, password)
      setCurrentUser(userProfile)
      navigate('/dashboard')
    } catch (err) {
      setAuthError(
        err?.message || 'Gagal masuk ke sistem. Periksa kembali kredensial Anda.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-[#C2B6FE] p-8 rounded-3xl shadow-lg w-full max-w-md flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <img
            src={logoGKP}
            alt="Logo SIGKP"
            className="h-30 w-30 rounded-lg object-contain mb-2"
          />
        </div>

        {authError && (
          <div
            role="alert"
            className="mb-4 w-full flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-medium text-red-700"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} noValidate className="w-full space-y-4">
          <div>
            <label
              htmlFor="login-username"
              className="block text-sm font-semibold text-slate-800 mb-1"
            >
              Username
            </label>
            <input
              id="login-username"
              name="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (errors.username) {
                  setErrors((prev) => ({ ...prev, username: '' }))
                }
              }}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? 'username-error' : undefined}
              className="w-full px-4 py-2.5 rounded-full bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5B528D]"
            />
            {errors.username && (
              <p
                id="username-error"
                role="alert"
                className="mt-1 pl-3 text-xs font-semibold text-red-700"
              >
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-slate-800 mb-1"
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: '' }))
                }
              }}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className="w-full px-4 py-2.5 rounded-full bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5B528D]"
            />
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="mt-1 pl-3 text-xs font-semibold text-red-700"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 font-bold shadow transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin text-slate-800" />
                <span>Login...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
