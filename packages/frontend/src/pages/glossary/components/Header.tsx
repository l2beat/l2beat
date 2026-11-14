import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
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
          <p className="text-base leading-[170%]">
            Explore the ETHBEAT Glossary, your comprehensive resource for
            understanding the terms and concepts of the L2 ecosystem. Find here
            all essential definitions and insights.
          </p>
          <p className="text-base leading-[170%]">
            Designed for everyone from developers to enthusiasts, this resource
            simplifies the complexities of L2, helping you navigate
            Ethereum&apos;s advanced landscape with ease.
          </p>
        </div>
        <div className="-bottom-2 absolute left-0 h-2 w-full bg-surface-primary" />
      </PrimaryCard>
      <div className="fixed top-0 z-1 hidden h-8 w-full bg-background md:block" />
      <PrimaryCard className="sticky top-0 z-10 w-full border-divider border-b bg-surface-primary py-4 md:top-6 md:rounded-t-xl">
        <AlphabetSelector entries={glossaryEntries} />
      </PrimaryCard>
    </>
  )
}
