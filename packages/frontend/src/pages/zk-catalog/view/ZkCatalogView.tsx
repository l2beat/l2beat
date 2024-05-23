import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/Accordion'
import { Link } from '../../../components/Link'
import { ChevronDownIcon } from '../../../components/icons'
import { cn } from '../../../utils/cn'
import { EM_DASH } from '../../../utils/constants'
import { getExplorerUrlByChainId } from '../../../utils/getExplorerUrl'
import { EtherscanLink } from '../../project/components/sections/ContractsSection/EtherscanLink'
import { LastUsedCell } from '../../project/zk-catalog/view/LastUsedCell'
import { VerifiedCell } from '../../project/zk-catalog/view/VerifiedCell'
import { VerifiedCountWithDetails } from '../../project/zk-catalog/view/VerifiedCountWithDetails'
import { ZkCatalogViewEntry } from '../types'

export interface ZkCatalogViewProps {
  items: ZkCatalogViewEntry[]
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
              className="flex-row justify-between items-baseline md:flex-col md:justify-start md:items-start"
            >
              {item.aggregation ? 'Yes' : 'No'}
            </DetailsItem>
            <DetailsItem
              title="Trusted setup"
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
            {item.verifiers.map((verifier) => (
              <VerifierCard
                key={`${item.name}-${verifier.name}`}
                verifier={verifier}
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
}: {
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex gap-1 flex-col', className)}>
      <p className="text-gray-500 text-2xs uppercase">{title}</p>
      <div className="text-lg font-bold">{children}</div>
    </div>
  )
}

function VerifierCard({
  verifier,
}: {
  verifier: ZkCatalogViewEntry['verifiers'][number]
}) {
  return (
    <div className="space-y-5 md:rounded-lg md:first:mt-7 first:border-none md:first:border-solid md:border border-gray-300 dark:border-gray-800 py-4 px-5 border-t">
      <div className="grid lg:grid-cols-4 space-y-2 lg:space-y-0">
        <DetailsItem title="Name">{verifier.name}</DetailsItem>
        <DetailsItem title="Verifier">
          <EtherscanLink
            etherscanUrl={getExplorerUrlByChainId(verifier.chainId)}
            address={verifier.contractAddress.toString()}
          />
        </DetailsItem>
        <DetailsItem title="Verification status">
          <VerifiedCell verified={verifier.verified} />
        </DetailsItem>
        <DetailsItem title="Last used" className="lg:pl-10">
          <LastUsedCell days={verifier.lastUsedDaysAgo} />
        </DetailsItem>
      </div>
      <div className="overflow-x-auto whitespace-pre pb-1.5 w-[calc(100vw_-_82px)] md:w-[calc(100vw_-_188px)] lg:w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="*:pr-4 text-left text-gray-500 dark:text-gray-50 text-2xs font-semibold uppercase align-bottom pb-1.5">
              <th>Name</th>
              <th>Proof system</th>
              <th>Arithmetization</th>
              <th>PCS</th>
              <th>Trusted setup</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {verifier.subVerifiers.map((sV) => (
              <tr
                key={`${verifier.name}-${sV.name}`}
                className="*:pr-4 border-t h-8 border-gray-300 dark:border-gray-800 text-xs font-medium"
              >
                <td>{sV.name}</td>
                <td>{sV.proofSystem}</td>
                <td>{sV.mainArithmetization}</td>
                <td>{sV.mainPCS}</td>
                <td>{sV.trustedSetup ?? EM_DASH}</td>
                <td>
                  {sV.link ? <Link href={sV.link}>Source code</Link> : EM_DASH}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
