'use client'

import { PrimaryCard } from '~/components/primary-card'
import { cn } from '~/utils/cn'
import { AlphabetSelector } from './alphabet-selector/alphabet-selector'

export function Header<T extends { id: string }>({
  glossaryEntries,
}: {
  glossaryEntries: T[]
}) {
  return (
    <>
      <PrimaryCard className="relative w-full  md:rounded-b-none md:pb-0">
        <div className="space-y-4">
          <p className="text-lg font-bold leading-[150%]">
            Explore the L2BEAT Glossary, your comprehensive resource for
            understanding the terms and concepts of the L2 ecosystem. Find here
            all essential definitions and insights.
          </p>
          <div className="transition-all duration-300">
            <p className="text-lg font-normal leading-[150%]">
              Designed for everyone from developers to enthusiasts, this
              resource simplifies the complexities of L2, helping you navigate
              Ethereum&apos;s advanced landscape with ease.
            </p>
          </div>
        </div>
      </PrimaryCard>

      <PrimaryCard
        className={cn(
          'sticky top-0 z-10 w-full bg-surface-primary py-4 transition-all',
          'md:top-6 md:rounded-t-none',
        )}
      >
        <AlphabetSelector entries={glossaryEntries} />
        <div className="absolute -bottom-6 left-0 h-6 w-full bg-gradient-to-b from-background to-background/5 md:w-[calc(100%-278px)]" />
      </PrimaryCard>
    </>
  )
}
