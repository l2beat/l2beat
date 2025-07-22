import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { MainPageHeader } from '~/components/MainPageHeader'
import { ChevronIcon } from '~/icons/Chevron'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { DetailsItem } from './components/DetailsItem'
import { DetailsLink } from './components/DetailsLink'
import { VerifierCard } from './components/VerifierCard'
import { VerifiedCountWithDetails } from './project/components/VerifiedCountWithDetails'
import type { ZkCatalogEntry } from './utils/getZkCatalogV1Entries'

interface Props extends AppLayoutProps {
  entries: ZkCatalogEntry[]
}

export function ZkCatalogPageV1({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>ZK Catalog V1</MainPageHeader>
        <p className="mx-6 text-secondary text-xs max-md:mt-6">
          ZK Catalog by L2BEAT is a community-driven resource offering detailed
          insights into the ZK technology utilized by various blockchain
          projects. It aims to enhance transparency and understanding of ZK tech
          implementations across the industry.
        </p>
        <ProjectList entries={entries} />
      </SideNavLayout>
    </AppLayout>
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
                <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr_130px_70px]">
                  <div className="mb-3 flex items-center gap-2 md:hidden">
                    <img
                      width={18}
                      height={18}
                      alt={entry.name}
                      src={entry.icon}
                      className="size-[18px]"
                    />
                    <span className="font-bold text-lg">{entry.name}</span>
                  </div>
                  <DetailsItem
                    title="Name"
                    className="hidden flex-col items-start justify-start md:flex"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        width={18}
                        height={18}
                        alt={entry.name}
                        src={entry.icon}
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
                    <div className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-black md:hidden dark:border-white">
                      <span className="font-bold text-base">Verifiers</span>
                      <ChevronIcon className="group-data-[state=open]:-rotate-180 fill-current transition-transform duration-300 ease-out" />
                    </div>
                    <ChevronIcon className="group-data-[state=open]:-rotate-180 hidden fill-current transition-transform duration-300 ease-out md:block" />
                  </div>
                </div>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className="-top-3 relative rounded-b-xl border border-divider border-t-0 bg-surface-primary pt-3 md:space-y-2 md:px-6 md:pb-6">
              {entry.shortDescription ? (
                <div className="my-7 flex flex-col gap-0.5 px-5">
                  <div className="font-medium text-2xs text-secondary uppercase">
                    Description
                  </div>
                  <div className="font-medium text-sm">
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
