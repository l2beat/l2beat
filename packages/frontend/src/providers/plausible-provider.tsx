'use client'

import NextPlausibleProvider from 'next-plausible'
import { useTheme } from 'next-themes'

export function PlausibleProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  return (
    <NextPlausibleProvider
      domain="new-analytics.l2beat.com"
      enabled={true}
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
