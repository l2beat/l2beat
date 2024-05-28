import React from 'react'
import { Link } from '../../../../components/Link'
import { Markdown } from '../../../../components/Markdown'
import { ChevronDownIcon } from '../../../../components/icons'
import {} from '../../../../components/tooltip/Tooltip'
import { getExplorerUrlByChainId } from '../../../../utils/getExplorerUrl'
import { EtherscanLink } from '../../components/sections/ContractsSection/EtherscanLink'
import { LastUsedCell } from './LastUsedCell'
import { SubVerifiersTable } from './SubVerifiersTable'
import { VerifiedCell } from './VerifiedCell'
import { ZkCatalogProjectDetails } from './ZkCatalogProjectPage'

interface Props {
  items: ZkCatalogProjectDetails['verifiers']
  askForVerificationLink: string
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
          <th className="pr-4 py-2 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50 hidden md:table-cell">
            Last used
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
              <VerifiedCell
                verified={item.verified}
                askForVerificationLink={props.askForVerificationLink}
              />
            </td>
            <td className="pr-4 hidden md:table-cell">
              <LastUsedCell days={item.lastUsedDaysAgo} />
            </td>
            <td className="pr-4">
              <ChevronDownIcon className="transition-transform duration-300 ease-out group-data-[open]/accordion-item:rotate-180" />
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
                />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-50 text-xs mb-2 font-medium">
                  Last used
                </p>
                <LastUsedCell days={item.lastUsedDaysAgo} />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-50 text-xs mb-2 font-medium">
                  Description
                </p>
                <Markdown className="text-xs">{item.description}</Markdown>
              </div>
              <SubVerifiersTable
                verifier={item}
                className="w-[calc(100vw_-_64px)] md:w-[calc(100vw_-_128px)]"
              />
              {item.verified === 'no' ? (
                <Link href={props.askForVerificationLink}>
                  Ask for verification
                </Link>
              ) : null}
            </td>
            <td
              colSpan={5}
              className="hidden md:table-cell px-4 pb-5 mt-1 w-[90%] space-y-5"
            >
              <div>
                <p className="text-gray-500 dark:text-gray-50 text-xs mb-2 font-medium">
                  Description
                </p>
                <Markdown className="text-xs font-medium text-zinc-900/80 dark:text-white/80">
                  {item.description}
                </Markdown>
              </div>
              <SubVerifiersTable
                verifier={item}
                className="w-[calc(100vw_-_64px)] md:w-[calc(100vw_-_128px)]"
              />
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  )
}
