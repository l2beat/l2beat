import React from 'react'
import { Link } from '../../../../components/Link'
import { Markdown } from '../../../../components/Markdown'
import { ChevronDownIcon } from '../../../../components/icons'
import { EM_DASH } from '../../../../utils/constants'
import { getExplorerUrlByChainId } from '../../../../utils/getExplorerUrl'
import { EtherscanLink } from '../../components/sections/ContractsSection/EtherscanLink'
import { VerifiedCell } from './VerifiedCell'
import { ZkCatalogProjectDetails } from './ZkCatalogProjectPage'

interface Props {
  items: ZkCatalogProjectDetails['verifiers']
}

export function Verifiers(props: Props) {
  return (
    <table className="w-full" data-role="accordion" data-type="multiple">
      <thead>
        <tr className="border-b border-gray-200 dark:border-zinc-700 align-bottom">
          <th className="px-4 py-2 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50">
            Name
          </th>
          <th className="pr-4 py-2 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50 hidden md:table-cell">
            Verifier
          </th>
          <th className="pr-4 py-2 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50">
            Verification status
          </th>
          <th />
        </tr>
      </thead>
      {props.items.map((item) => (
        <tbody
          data-role="accordion-item"
          className="group/accordion-item hover:!bg-zinc-100 dark:hover:!bg-neutral-800 data-[open]:bg-gray-100 dark:data-[open]:bg-zinc-900 transition-colors"
          key={item.contractAddress.toString()}
        >
          <tr
            data-role="accordion-trigger"
            className="h-14 border-b border-gray-200 dark:border-zinc-700 cursor-pointer group-data-[open]/accordion-item:border-none"
          >
            <td className="px-4 text-base md:text-lg font-medium">
              {item.name}
            </td>
            <td className="pr-4 hidden md:table-cell text-sm md:text-base">
              <EtherscanLink
                etherscanUrl={getExplorerUrlByChainId(item.chainId)}
                address={item.contractAddress.toString()}
              />
            </td>
            <td className="pr-4">
              <VerifiedCell verified={item.verified} />
            </td>
            <td className="pr-4">
              <ChevronDownIcon className="transition-transform duration-300 ease-out group-data-[open]/accordion-item:-rotate-180" />
            </td>
          </tr>
          <tr
            data-role="accordion-content"
            className="hidden group-data-[open]/accordion-item:table-row border-b border-gray-200 dark:border-zinc-700"
          >
            {/* TODO: Check why w-[90%] fixes header altering */}
            <td
              colSpan={3}
              className="md:hidden px-4 pb-5 mt-1 w-[90%] space-y-5"
            >
              <div>
                <p className="text-gray-500 dark:text-gray-50 text-xs mb-2 font-medium">
                  Verifier
                </p>
                <EtherscanLink
                  address={item.contractAddress.toString()}
                  className="break-all"
                  truncate={false}
                />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-50 text-xs mb-2 font-medium">
                  Description
                </p>
                <Markdown>{item.description}</Markdown>
              </div>
              <SubVerifiersTable verifier={item} />
              {item.verified === 'no' ? (
                <div>
                  <Link>Ask for verification</Link>
                </div>
              ) : null}
            </td>
            <td
              colSpan={4}
              className="hidden md:table-cell px-4 pb-5 mt-1 w-[90%] space-y-5"
            >
              <div>
                <p className="text-gray-500 dark:text-gray-50 text-xs mb-2 font-medium">
                  Description
                </p>
                <Markdown>{item.description}</Markdown>
              </div>
              <SubVerifiersTable verifier={item} />
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  )
}

function SubVerifiersTable({
  verifier,
}: { verifier: ZkCatalogProjectDetails['verifiers'][number] }) {
  return (
    <div className="overflow-x-auto whitespace-pre pb-1.5 w-[calc(100vw_-_64px)] md:w-[calc(100vw_-_128px)] lg:w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-zinc-700 align-bottom text-left">
            <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500 dark:text-gray-50">
              Name
            </th>
            <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500 dark:text-gray-50">
              Arithmetization
            </th>
            <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500 dark:text-gray-50">
              PCS
            </th>
            <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500 dark:text-gray-50">
              Proof system
            </th>
            <th className="py-1.5 pr-3 uppercase text-2xs font-semibold text-gray-500 dark:text-gray-50">
              Trusted setup
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {verifier.subVerifiers.map((sV) => (
            <tr
              className="h-8 text-sm border-b last:border-none border-gray-200 dark:border-zinc-700"
              key={`${sV.proofSystem}-${sV.trustedSetup}`}
            >
              <td className="pr-3">{sV.name}</td>
              <td className="pr-3">{sV.proofSystem}</td>
              <td className="pr-3">{sV.mainArithmetization}</td>
              <td className="pr-3">{sV.mainPCS}</td>
              <td className="pr-3">{sV.trustedSetup ?? EM_DASH}</td>
              <td>
                {sV.link ? <Link href={sV.link}>Source code</Link> : EM_DASH}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
