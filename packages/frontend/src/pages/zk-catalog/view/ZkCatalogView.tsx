import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/Accordion'
import { Link } from '../../../components/Link'
import { EM_DASH } from '../../../utils/constants'
import { getExplorerUrlByChainId } from '../../../utils/getExplorerUrl'
import { EtherscanLink } from '../../project/components/sections/ContractsSection/EtherscanLink'
import { VerifiedCell } from '../../project/zk-catalog/view/VerifiedCell'
import { VerifiedCountWithDetails } from '../../project/zk-catalog/view/VerifiedCountWithDetails'
import { ZkCatalogViewEntry } from '../types'

export interface ZkCatalogViewProps {
  items: ZkCatalogViewEntry[]
}

export function ZkCatalogView(props: ZkCatalogViewProps) {
  return (
    <Accordion className="space-y-3" type="multiple">
      {props.items.map((item) => (
        <AccordionItem key={item.slug}>
          <AccordionTrigger
            className="py-4 relative z-10 px-6 bg-gray-100 dark:bg-zinc-900 dark:border-gray-800 rounded-xl border border-gray-300"
            childrenClassName="grid grid-cols-5"
          >
            <DetailsItem title="Name">
              <div className="flex items-center gap-2">
                <img src={`/icons/${item.slug}.png`} className="size-[18px]" />
                <span>{item.name}</span>
              </div>
            </DetailsItem>
            <DetailsItem title="Number of verifiers">
              <VerifiedCountWithDetails verifiers={item.verifiers} />
            </DetailsItem>
            <DetailsItem title="Aggregation">
              {item.aggregation ? 'Yes' : 'No'}
            </DetailsItem>
            <DetailsItem title="Trusted setup">
              {item.hasTrustedSetup ? 'Yes' : 'No'}
            </DetailsItem>
            <a
              href={`/zk-catalog/${item.slug}`}
              className="self-center justify-self-center"
            >
              <button className="w-max text-sm rounded-lg h-8 px-6 bg-black text-white dark:bg-white dark:text-black">
                Details page
              </button>
            </a>
          </AccordionTrigger>
          <AccordionContent className="border relative pt-[36px] rounded-b-xl px-6 pb-6 -top-3 border-t-0 border-gray-300 dark:border-gray-800 space-y-2">
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
    <div className={className}>
      <p className="text-gray-500 text-2xs mb-1 uppercase">{title}</p>
      <div className="text-lg font-bold">{children}</div>
    </div>
  )
}

function VerifierCard({
  verifier,
}: { verifier: ZkCatalogViewEntry['verifiers'][number] }) {
  return (
    <div className="space-y-5 rounded-lg border border-gray-300 dark:border-gray-800 py-4 px-5">
      <div className="grid lg:grid-cols-4 space-y-2 lg:space-y-0">
        <DetailsItem title="Name">{verifier.name}</DetailsItem>
        <DetailsItem title="Verifier" className="lg:col-span-2">
          <EtherscanLink
            className="hidden md:block"
            etherscanUrl={getExplorerUrlByChainId(verifier.chainId)}
            address={verifier.contractAddress.toString()}
            truncate={false}
          />
          <EtherscanLink
            className="md:hidden"
            etherscanUrl={getExplorerUrlByChainId(verifier.chainId)}
            address={verifier.contractAddress.toString()}
            truncate={true}
          />
        </DetailsItem>
        <DetailsItem title="Verification status">
          <VerifiedCell verified={verifier.verified} />
        </DetailsItem>
      </div>
      <div className="overflow-x-auto whitespace-pre pb-1.5 w-[calc(100vw_-_120px)] md:w-[calc(100vw_-_168px)] lg:w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-50 text-2xs font-semibold uppercase align-bottom pb-1.5">
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
                className="border-t h-8 border-gray-300 dark:border-gray-800 text-xs font-medium"
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
