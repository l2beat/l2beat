import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { env } from '~/env'
import { oswald } from '~/fonts/oswald'
import { cn } from '~/utils/cn'
import { getDefaultMetadata } from '~/utils/metadata'

export const metadata: Metadata = getDefaultMetadata({
  title: 'L2BEAT - Insight',
  description: 'Get insights about your L2 assets.',
})

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  if (!env.NEXT_PUBLIC_FEATURE_FLAG_ASSET_RISKS) {
    return notFound()
  }

  return (
    <div className={cn(oswald.variable, 'insight bg-[#0B0B1C] text-white')}>
      {children}
    </div>
  )
}
