import { notFound } from 'next/navigation'
import type React from 'react'
import { env } from '~/env'

export default function Layout({ children }: { children: React.ReactNode }) {
  if (!env.NEXT_PUBLIC_FEATURE_FLAG_DA_BEAT) {
    return notFound()
  }

  return children
}
