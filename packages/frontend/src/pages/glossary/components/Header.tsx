import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'
import { AlphabetSelector } from './alphabet-selector/AlphabetSelector'

export function Header<T extends { id: string }>({
  glossaryEntries,
}: {
  glossaryEntries: T[]
}) {
  return (
    <>
      <PrimaryCard className="relative z-10 w-full md:rounded-b-none md:pb-0">
        <div className="space-y-4">
          <p className="font-bold text-lg leading-[150%]">
            Explore the L2BEAT Glossary, your comprehensive resource for
            understanding the terms and concepts of the L2 ecosystem. Find here
            all essential definitions and insights.
          </p>
          <p className="font-normal text-lg leading-[150%]">
            Designed for everyone from developers to enthusiasts, this resource
            simplifies the complexities of L2, helping you navigate
            Ethereum&apos;s advanced landscape with ease.
          </p>
        </div>
        <div className="-bottom-2 absolute left-0 h-2 w-full bg-surface-primary" />
      </PrimaryCard>
      <div className="fixed top-0 z-1 hidden h-8 w-full bg-background md:block" />
      <PrimaryCard className="sticky top-0 z-10 w-full bg-surface-primary py-4 md:top-6 md:rounded-t-xl">
        <AlphabetSelector entries={glossaryEntries} />
        {/* Mobile gradient */}
        <div
          className={cn(
            '-bottom-4 absolute inset-x-0 h-4 w-full bg-linear-to-b from-background to-background/5 md:top-20 md:hidden md:h-10 md:w-[calc(100%-278px)] md:via-40% md:via-background',
          )}
        />
      </PrimaryCard>
      {/* Gradient */}
      <div
        className={cn(
          'sticky top-16 hidden h-4 w-full bg-linear-to-b from-background to-background/5 md:top-20 md:block md:h-10 md:w-full md:via-40% md:via-background lg:w-[calc(100%-278px)]',
        )}
      />
    </>
  )
}
