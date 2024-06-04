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
            className="py-4 relative z-10 px-6 bg-gray-100 dark:bg-zinc-900 dark:border-gray-800 rounded-xl border border-gray-300 flex-col md:flex-row"
            childrenClassName="grid md:grid-cols-5"
            indicator={
              <>
                <button className="w-full border border-black h-10 rounded-lg dark:border-white md:hidden flex items-center justify-center gap-1.5">
                  <span className="text-base font-bold">Verifiers info</span>
                  <ChevronDownIcon className="transition-transform duration-300 ease-out group-data-[open]/accordion-item:rotate-180" />
                </button>
                <ChevronDownIcon className="hidden md:block transition-transform duration-300 ease-out group-data-[open]/accordion-item:rotate-180" />
              </>
            }
          >
            <div className="flex gap-2 items-center mb-3 md:hidden">
              <img src={`/icons/${item.slug}.png`} className="size-[18px]" />
              <span className="text-lg font-bold">{item.name}</span>
            </div>
            <DetailsItem
              title="Name"
              className="flex-col justify-start items-start hidden md:flex"
            >
              <div className="flex items-center gap-2">
                <img src={`/icons/${item.slug}.png`} className="size-[18px]" />
                <span>{item.name}</span>
              </div>
            </DetailsItem>
            <DetailsItem
              title="Number of verifiers"
              className="flex-row justify-between items-baseline md:flex-col md:justify-start md:items-start"
            >
              <VerifiedCountWithDetails verifiers={item.verifiers} />
            </DetailsItem>
            <DetailsItem
              title="Aggregation"
              tooltip="Shows if recursive proof aggregation is used."
              className="flex-row justify-between items-baseline md:flex-col md:justify-start md:items-start"
            >
              {item.aggregation ? 'Yes' : 'No'}
            </DetailsItem>
            <DetailsItem
              title="Trusted setup"
              tooltip="Shows if a trusted setup is used anywhere in the proving stack."
              className="flex-row justify-between items-baseline md:flex-col md:justify-start md:items-start"
            >
              {item.hasTrustedSetup ? 'Yes' : 'No'}
            </DetailsItem>
            <DetailsLink
              slug={item.slug}
              className="self-center justify-self-center"
            />
          </AccordionTrigger>
          <AccordionContent className="border relative pt-3 md:pb-6 rounded-b-xl md:px-6 -top-3 border-t-0 border-gray-300 dark:border-gray-800 md:space-y-2">
            {item.shortDescription ? (
              <div className="px-5 my-7">
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
    <div className={cn('flex gap-0.5 flex-col', className)}>
      <div className="flex items-center gap-1.5 text-gray-500 text-2xs uppercase font-semibold">
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
      <div className="text-lg font-bold">{children}</div>
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
    <div className="md:rounded-lg md:first:mt-7 md:border border-gray-300 dark:border-gray-800 py-4 px-5 border-t">
      <div className="grid lg:grid-cols-4 space-y-2 lg:space-y-0">
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
        className="w-[calc(100vw_-_82px)] md:w-[calc(100vw_-_188px)] mt-7"
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
        'flex items-center font-bold justify-center w-full text-base rounded-lg px-6 bg-black text-white dark:bg-white dark:text-black mt-7 md:mt-0 md:w-max h-10 md:h-8',
        className,
      )}
    >
      Details page
    </a>
  )
}
