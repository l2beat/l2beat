import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/Accordion'
import { ChevronDownIcon, InfoIcon } from '../../../components/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/tooltip/Tooltip'
import { cn } from '../../../utils/cn'
import { getExplorerUrlByChainId } from '../../../utils/getExplorerUrl'
import { EtherscanLink } from '../../project/components/sections/ContractsSection/EtherscanLink'
import { LastUsedCell } from '../../project/zk-catalog/view/LastUsedCell'
import { SubVerifiersTable } from '../../project/zk-catalog/view/SubVerifiersTable'
import { VerifiedCell } from '../../project/zk-catalog/view/VerifiedCell'
import { VerifiedCountWithDetails } from '../../project/zk-catalog/view/VerifiedCountWithDetails'
import { ZkCatalogViewEntry } from '../types'

export interface ZkCatalogViewProps {
  items: ZkCatalogViewEntry[]
  askForVerificationLink: string
}

// TODO: Add storybook after research team provides the config files
export function ZkCatalogView(props: ZkCatalogViewProps) {
  return (
    <Accordion className="space-y-3" type="multiple">
      {props.items.map((item) => (
        <AccordionItem key={item.slug}>
          <AccordionTrigger
            className="relative z-10 flex-col rounded-xl border border-gray-300 bg-gray-100 px-6 py-4 md:flex-row dark:border-gray-800 dark:bg-zinc-900"
            childrenClassName="grid md:grid-cols-5"
            indicator={
              <>
                <button className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-black md:hidden dark:border-white">
                  <span className="font-bold text-base">Verifiers</span>
                  <ChevronDownIcon className="transition-transform duration-300 ease-out group-data-[open]/accordion-item:rotate-180" />
                </button>
                <ChevronDownIcon className="hidden transition-transform duration-300 ease-out md:block group-data-[open]/accordion-item:rotate-180" />
              </>
            }
          >
            <div className="mb-3 flex items-center gap-2 md:hidden">
              <img src={`/icons/${item.slug}.png`} className="size-[18px]" />
              <span className="font-bold text-lg">{item.name}</span>
            </div>
            <DetailsItem
              title="Name"
              className="hidden flex-col items-start justify-start md:flex"
            >
              <div className="flex items-center gap-2">
                <img src={`/icons/${item.slug}.png`} className="size-[18px]" />
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
          </AccordionTrigger>
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

function DetailsItem({
  title,
  children,
  className,
  tooltip,
}: {
  title: string
  children: React.ReactNode
  className?: string
  tooltip?: string
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <div className="flex items-center gap-1.5 font-semibold text-2xs text-gray-500 uppercase">
        {title}
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="fill-current md:size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      <div className="font-bold text-lg">{children}</div>
    </div>
  )
}

function VerifierCard({
  verifier,
  askForVerificationLink,
}: {
  verifier: ZkCatalogViewEntry['verifiers'][number]
  askForVerificationLink: string
}) {
  return (
    <div className="border-gray-300 border-t px-5 py-4 md:first:mt-7 md:rounded-lg md:border dark:border-gray-800">
      <div className="grid space-y-2 lg:grid-cols-4 lg:space-y-0">
        <DetailsItem title="Name">{verifier.name}</DetailsItem>
        <DetailsItem title="Verifier">
          <EtherscanLink
            etherscanUrl={getExplorerUrlByChainId(verifier.chainId)}
            address={verifier.contractAddress.toString()}
          />
        </DetailsItem>
        <DetailsItem title="Verification status">
          <VerifiedCell
            verified={verifier.verified}
            askForVerificationLink={askForVerificationLink}
          />
        </DetailsItem>
        <DetailsItem title="Last used" className="lg:pl-10">
          <LastUsedCell days={verifier.lastUsedDaysAgo} />
        </DetailsItem>
      </div>
      <SubVerifiersTable
        verifier={verifier}
        className="mt-7 w-[calc(100vw_-_82px)] md:w-[calc(100vw_-_188px)]"
      />
    </div>
  )
}

function DetailsLink({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  return (
    <a
      href={`/zk-catalog/${slug}`}
      className={cn(
        'mt-7 flex h-10 w-full items-center justify-center rounded-lg bg-black px-6 font-bold text-base text-white md:mt-0 md:h-8 md:w-max dark:bg-white dark:text-black',
        className,
      )}
    >
      Details
    </a>
  )
}
