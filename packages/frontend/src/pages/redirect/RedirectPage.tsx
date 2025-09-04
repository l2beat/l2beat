import { useEffect, useState } from 'react'
import { Logo } from '~/components/Logo'
import { AppLayout } from '~/layouts/AppLayout'

interface Props {
  redirectUrl: string
}

export function RedirectPage({ redirectUrl }: Props) {
  const [countdown, setCountdown] = useState(2)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = redirectUrl
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [redirectUrl])

  return (
    <AppLayout searchBarProjects={[]} terms={[]}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-primary px-4">
        <div className="text-center">
          <div className="mb-8">
            <Logo className="mx-auto h-12 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="mb-4 font-semibold text-2xl text-primary">
              Redirecting...
            </h1>
            <p className="mb-4 text-secondary">
              You will be redirected in {countdown} second
              {countdown !== 1 ? 's' : ''}
            </p>
            <p className="text-secondary text-sm">Destination: {redirectUrl}</p>
          </div>

          <noscript>
            <div className="mb-4 rounded-lg bg-yellow-100 p-4">
              <p className="text-black text-sm">
                JavaScript is disabled. Please click the button below to
                continue.
              </p>
            </div>
          </noscript>

          <a
            href={redirectUrl}
            className="inline-flex items-center rounded-lg bg-brand-red px-6 py-3 font-medium text-base text-white transition-colors hover:bg-brand-red/90 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 dark:bg-brand-red-dark dark:hover:bg-brand-red-dark/90"
          >
            Continue to destination
          </a>
        </div>
      </div>
    </AppLayout>
  )
}
