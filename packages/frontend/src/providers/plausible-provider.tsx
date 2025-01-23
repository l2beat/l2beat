'use client'

import NextPlausibleProvider from 'next-plausible'
import { useTheme } from 'next-themes'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { env } from '~/env'

export function PlausibleProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const { checked } = useRecategorisationPreviewContext()

  return (
    <NextPlausibleProvider
      domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
      enabled={env.NEXT_PUBLIC_PLAUSIBLE_ENABLED}
      pageviewProps={{
        theme: resolvedTheme ?? 'light',
        recategorisationPreview: checked.toString(),
      }}
      hash
      taggedEvents
    >
      {children}
    </NextPlausibleProvider>
  )
}
