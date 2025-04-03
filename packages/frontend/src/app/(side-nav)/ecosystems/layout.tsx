import { notFound } from 'next/navigation'
import { env } from '~/env'

export default function Layout({ children }: { children: React.ReactNode }) {
  if (!env.NEXT_PUBLIC_ECOSYSTEMS) {
    return notFound()
  }

  return children
}
