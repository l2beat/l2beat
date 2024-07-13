import React from 'react'

import { AccordionHeader } from '@radix-ui/react-accordion'
import Image from 'next/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/app/_components/accordion'
import ChevronDownIcon from '~/icons/chevron.svg'
import { VerifiedCountWithDetails } from '../[project]/_components/VerifiedCountWithDetails'
import { type ZkCatalogViewEntry } from '../types'
import { DetailsItem } from './DetailsItem'
import { DetailsLink } from './DetailsLink'
import { VerifierCard } from './VerifierCard'

export interface ZkCatalogViewProps {
  items: ZkCatalogViewEntry[]
  askForVerificationLink: string
}

// TODO: Add storybook after research team provides the config files
export function ZkCatalogPage(props: ZkCatalogViewProps) {
  return (
    <Accordion className="space-y-3" type="multiple">
      {props.items.map((item) => (
        <AccordionItem key={item.slug} value={item.slug}>
          <AccordionHeader asChild>
            <AccordionTrigger
              asChild
              className="relative w-full z-10 flex-col rounded-xl border border-gray-300 bg-gray-100 px-6 py-4 md:flex-row dark:border-gray-800 dark:bg-zinc-900 cursor-pointer"
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
                  <span className="font-bold text-lg">{item.name}</span>
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
                  <div className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-black md:hidden dark:border-white">
                    <span className="font-bold text-base">Verifiers</span>
                    <ChevronDownIcon className='fill-current transition-transform duration-300 ease-out group-data-[state="open"]/accordion-item:rotate-180' />
                  </div>
                  <ChevronDownIcon className='fill-current hidden transition-transform duration-300 ease-out md:block group-data-[state="open"]/accordion-item:rotate-180' />
                </div>
              </div>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className="-top-3 relative rounded-b-xl border border-gray-300 border-t-0 pt-3 md:space-y-2 dark:border-gray-800 md:px-6 md:pb-6">
            {item.shortDescription ? (
              <div className="my-7 px-5">
                <DetailsItem title="Description">
                  {item.shortDescription}
                </DetailsItem>
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
