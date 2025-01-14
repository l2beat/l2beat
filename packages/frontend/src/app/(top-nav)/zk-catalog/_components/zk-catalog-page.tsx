import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import Image from 'next/image'
import { ChevronIcon } from '~/icons/chevron'
import { VerifiedCountWithDetails } from '../[slug]/_components/verified-count-with-details'
import { type ZkCatalogViewEntry } from '../types'
import { DetailsItem } from './details-item'
import { DetailsLink } from './details-link'
import { VerifierCard } from './verifier-card'

export interface ZkCatalogViewProps {
  items: ZkCatalogViewEntry[]
  askForVerificationLink: string
}

export function ZkCatalogPage(props: ZkCatalogViewProps) {
  return (
    <Accordion className="space-y-3" type="multiple">
      {props.items.map((item) => (
        <AccordionItem key={item.slug} value={item.slug}>
          <AccordionHeader asChild>
            <AccordionTrigger
              asChild
              className="group relative z-10 w-full cursor-pointer flex-col rounded-xl border border-gray-300 bg-gray-100 px-6 py-4 dark:border-gray-800 dark:bg-zinc-900 md:flex-row"
            >
              <div className="grid md:grid-cols-[4fr,4fr,4fr,4fr,4fr,1fr]">
                <div className="mb-3 flex items-center gap-2 md:hidden">
                  <Image
                    width={18}
                    height={18}
                    alt={item.name}
                    src={`/icons/${item.slug}.png`}
                    className="size-[18px]"
                  />
                  <span className="text-lg font-bold">{item.name}</span>
                </div>
                <DetailsItem
                  title="Name"
                  className="hidden flex-col items-start justify-start md:flex"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      width={18}
                      height={18}
                      alt={item.name}
                      src={`/icons/${item.slug}.png`}
                      className="size-[18px]"
                    />
                    <span>{item.name}</span>
                  </div>
                </DetailsItem>
                <DetailsItem
                  title="Number of verifiers"
                  className="flex-row items-baseline justify-between md:flex-col md:items-start md:justify-start"
                >
                  <VerifiedCountWithDetails verifiers={item.verifiers} />
                </DetailsItem>
                <DetailsItem
                  title="Aggregation"
                  tooltip="Shows if recursive proof aggregation is used."
                  className="flex-row items-baseline justify-between md:flex-col md:items-start md:justify-start"
                >
                  {item.aggregation ? 'Yes' : 'No'}
                </DetailsItem>
                <DetailsItem
                  title="Trusted setup"
                  tooltip="Shows if a trusted setup is used anywhere in the proving stack."
                  className="flex-row items-baseline justify-between md:flex-col md:items-start md:justify-start"
                >
                  {item.trustedSetup}
                </DetailsItem>
                <DetailsLink
                  slug={item.slug}
                  className="self-center justify-self-center"
                />
                <div className="flex items-center">
                  <div className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-black dark:border-white md:hidden">
                    <span className="text-base font-bold">Verifiers</span>
                    <ChevronIcon className="fill-current transition-transform duration-300 ease-out group-data-[state=open]:-rotate-180" />
                  </div>
                  <ChevronIcon className="hidden fill-current transition-transform duration-300 ease-out group-data-[state=open]:-rotate-180 md:block" />
                </div>
              </div>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className="relative -top-3 rounded-b-xl border border-t-0 border-gray-300 pt-3 dark:border-gray-800 md:space-y-2 md:px-6 md:pb-6">
            {item.shortDescription ? (
              <div className="my-7 flex flex-col gap-0.5 px-5">
                <div className="text-2xs font-medium uppercase text-gray-500">
                  Description
                </div>
                <div className="text-sm font-medium">
                  {item.shortDescription}
                </div>
              </div>
            ) : null}
            {item.verifiers.map((verifier) => (
              <VerifierCard
                key={`${item.name}-${verifier.name}`}
                verifier={verifier}
                askForVerificationLink={props.askForVerificationLink}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
