import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import type { Metadata } from 'next'
import Image from 'next/image'
import { MainPageHeader } from '~/components/main-page-header'
import { ChevronIcon } from '~/icons/chevron'
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers'
import { ps } from '~/server/projects'
import { getDefaultMetadata } from '~/utils/metadata'
import { VerifiedCountWithDetails } from './[slug]/_components/verified-count-with-details'
import { DetailsItem } from './_components/details-item'
import { DetailsLink } from './_components/details-link'
import { VerifierCard } from './_components/verifier-card'
import type { ZkCatalogEntry } from './_utils/get-zk-catalog-entries'
import { getZkCatalogEntries } from './_utils/get-zk-catalog-entries'

export const metadata: Metadata = getDefaultMetadata({
  title: 'ZK Catalog - L2BEAT',
  description: 'A catalog of the ZK projects with detailed research.',
  openGraph: {
    url: '/zk-catalog',
  },
})

export default async function Page() {
  const verifiers = await getVerifiers()
  const projects = await ps.getProjects({
    select: ['proofVerification'],
    whereNot: ['isArchived'],
  })
  const entries = getZkCatalogEntries(projects, verifiers)

  return (
    <>
      <MainPageHeader>ZK Catalog</MainPageHeader>
      <p className="mx-6 text-xs text-secondary max-md:mt-6">
        ZK Catalog by L2BEAT is a community-driven resource offering detailed
        insights into the ZK technology utilized by various blockchain projects.
        It aims to enhance transparency and understanding of ZK tech
        implementations across the industry.
      </p>
      <ProjectList entries={entries} />
    </>
  )
}

function ProjectList({ entries }: { entries: ZkCatalogEntry[] }) {
  return (
    <main className="mt-4 md:mt-6">
      <Accordion className="space-y-3" type="multiple">
        {entries.map((entry) => (
          <AccordionItem key={entry.slug} value={entry.slug}>
            <AccordionHeader asChild>
              <AccordionTrigger
                asChild
                className="group relative z-10 w-full cursor-pointer flex-col rounded-xl border border-divider bg-surface-primary px-6 py-4 md:flex-row"
              >
                <div className="grid md:grid-cols-[1.5fr,1fr,1fr,1fr,130px,70px]">
                  <div className="mb-3 flex items-center gap-2 md:hidden">
                    <Image
                      width={18}
                      height={18}
                      alt={entry.name}
                      src={`/icons/${entry.slug}.png`}
                      className="size-[18px]"
                    />
                    <span className="text-lg font-bold">{entry.name}</span>
                  </div>
                  <DetailsItem
                    title="Name"
                    className="hidden flex-col items-start justify-start md:flex"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        width={18}
                        height={18}
                        alt={entry.name}
                        src={`/icons/${entry.slug}.png`}
                        className="size-[18px]"
                      />
                      <span>{entry.name}</span>
                    </div>
                  </DetailsItem>
                  <DetailsItem
                    title="Number of verifiers"
                    className="flex-row items-baseline justify-between md:flex-col md:items-start md:justify-start"
                  >
                    <VerifiedCountWithDetails verifiers={entry.verifiers} />
                  </DetailsItem>
                  <DetailsItem
                    title="Aggregation"
                    tooltip="Shows if recursive proof aggregation is used."
                    className="flex-row items-baseline justify-between md:flex-col md:items-start md:justify-start"
                  >
                    {entry.aggregation ? 'Yes' : 'No'}
                  </DetailsItem>
                  <DetailsItem
                    title="Trusted setup"
                    tooltip="Shows if a trusted setup is used anywhere in the proving stack."
                    className="flex-row items-baseline justify-between md:flex-col md:items-start md:justify-start"
                  >
                    {entry.trustedSetup}
                  </DetailsItem>
                  <DetailsLink
                    slug={entry.slug}
                    className="self-center justify-self-center"
                  />
                  <div className="flex items-center justify-center">
                    <div className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-black dark:border-white md:hidden">
                      <span className="text-base font-bold">Verifiers</span>
                      <ChevronIcon className="fill-current transition-transform duration-300 ease-out group-data-[state=open]:-rotate-180" />
                    </div>
                    <ChevronIcon className="hidden fill-current transition-transform duration-300 ease-out group-data-[state=open]:-rotate-180 md:block" />
                  </div>
                </div>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className="relative -top-3 rounded-b-xl border border-t-0 border-divider bg-surface-primary pt-3 md:space-y-2 md:px-6 md:pb-6">
              {entry.shortDescription ? (
                <div className="my-7 flex flex-col gap-0.5 px-5">
                  <div className="text-2xs font-medium uppercase text-secondary">
                    Description
                  </div>
                  <div className="text-sm font-medium">
                    {entry.shortDescription}
                  </div>
                </div>
              ) : null}
              {entry.verifiers.map((verifier) => (
                <VerifierCard
                  key={`${entry.name}-${verifier.name}`}
                  verifier={verifier}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  )
}
