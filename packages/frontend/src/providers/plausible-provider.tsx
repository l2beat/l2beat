'use client'

import NextPlausibleProvider from 'next-plausible'
import { useTheme } from 'next-themes'
import { env } from '~/env'

export function PlausibleProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()

  return (
    <NextPlausibleProvider
      domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
      enabled={env.NEXT_PUBLIC_PLAUSIBLE_ENABLED}
      pageviewProps={{
        theme: resolvedTheme ?? 'light',
      }}
      hash
      taggedEvents
    >
      {children}
    </NextPlausibleProvider>
  )
}
