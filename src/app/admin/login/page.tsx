'use client'

/**
 * src/app/admin/login/page.tsx
 *
 * Page de connexion admin — formulaire de login NextAuth (Credentials).
 * Accessible à /admin/login — hors du segment [locale] intentionnellement.
 */

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'

import { Suspense } from 'react'

function LoginContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/admin'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    })

    setLoading(false)

    if (res?.error) {
      setError('Email ou mot de passe incorrect.')
    } else if (res?.url) {
      router.push(res.url)
    }
  }

  return (
        <div style={{ width: '100%', maxWidth: 400, padding: '0 1rem' }}>

          {/* Logo / titre */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: '#c9a96e', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <Lock size={22} color="#fff" />
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 700, color: '#100e0b', margin: 0 }}>
              Xmedia Admin
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#7a6e65', marginTop: '0.5rem' }}>
              Connexion espace administration
            </p>
          </div>

          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            style={{ background: '#fdf9f5', border: '1px solid #d8d0c8', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {error && (
              <p style={{ fontSize: '0.875rem', color: '#c47f8a', padding: '0.75rem', background: '#f2e5e7', borderLeft: '3px solid #c47f8a', margin: 0 }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label htmlFor="email" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a5048' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ padding: '0.75rem 1rem', border: '1px solid #d8d0c8', background: '#fff', fontSize: '0.9375rem', outline: 'none', color: '#100e0b' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label htmlFor="password" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a5048' }}>
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ padding: '0.75rem 1rem', border: '1px solid #d8d0c8', background: '#fff', fontSize: '0.9375rem', outline: 'none', color: '#100e0b' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem', padding: '0.875rem',
                background: loading ? '#9e9289' : '#100e0b',
                color: '#fdf9f5', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '0.5rem', transition: 'background 200ms',
              }}
            >
              {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9e9289', marginTop: '1.5rem' }}>
            Accès réservé aux administrateurs Xmedia
          </p>
        </div>
  )
}

export default function AdminLoginPage() {
  return (
    <html lang="en">
      <body style={{ background: '#f8f5f0', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <Suspense fallback={<div>Chargement...</div>}>
          <LoginContent />
        </Suspense>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </body>
    </html>
  )
}
