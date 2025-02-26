'use client'

import { useEffect, useState } from 'react'
import { PrimaryCard } from '~/components/primary-card'
import { useEventListener } from '~/hooks/use-event-listener'
import { cn } from '~/utils/cn'
import { AlphabetSelector } from './alphabet-selector/alphabet-selector'

export function Header<T extends { id: string }>({
  glossaryEntries,
}: {
  glossaryEntries: T[]
}) {
  const [isScrolled, setIsScrolled] = useState(false)

  const handleScroll = () => {
    const scrollPosition = window.scrollY
    setIsScrolled(scrollPosition > 182)
  }

  useEffect(handleScroll, [])
  useEventListener('scroll', handleScroll)

  return (
    <>
      <PrimaryCard
        className={cn('w-full md:rounded-b-none md:pb-0', isScrolled && '')}
      >
        <p className="text-lg font-bold leading-[150%]">
          Explore the L2BEAT Glossary, your comprehensive resource for
          understanding the terms and concepts of the L2 ecosystem. Find here
          all essential definitions and insights.
        </p>
        <div
          className={`transition-all duration-300 ${
            isScrolled ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'
          }`}
        >
          <p className="text-lg font-normal leading-[150%]">
            Designed for everyone from developers to enthusiasts, this resource
            simplifies the complexities of L2, helping you navigate
            Ethereum&apos;s advanced landscape with ease.
          </p>
        </div>
      </PrimaryCard>
      {isScrolled && <div className="sticky top-0 h-8 w-full bg-background" />}
      <PrimaryCard
        className={cn(
          'relative w-full bg-surface-primary py-4 md:rounded-t-none',
          isScrolled && 'sticky top-6 md:rounded-t-xl',
        )}
      >
        <AlphabetSelector entries={glossaryEntries} />
        <div className="absolute -bottom-6 left-0 h-6   w-full bg-gradient-to-b from-background to-background/5 md:w-[calc(100%-278px)]" />
      </PrimaryCard>
    </>
  )
}
