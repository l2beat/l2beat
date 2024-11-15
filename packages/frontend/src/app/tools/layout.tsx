import { notFound } from 'next/navigation'
import { env } from '~/env'

export default function Layout({ children }: { children: React.ReactNode }) {
  if (!env.NEXT_PUBLIC_FEATURE_FLAG_INTERNAL_TOOLS) {
    return notFound()
  }
  return <div className="p-4">{children}</div>
}
