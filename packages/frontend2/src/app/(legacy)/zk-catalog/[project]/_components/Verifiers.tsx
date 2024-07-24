import { EtherscanLink } from '~/app/_components/etherscan-link'
import { Markdown } from '~/app/_components/markdown/markdown'
import ChevronDownIcon from '~/icons/chevron.svg'
import { getExplorerUrlByChainId } from '../../_utils/getExplorerUrl'
import { LastUsedCell } from './LastUsedCell'
import { SubVerifiersTable } from './SubVerifiersTable'
import { VerifiedCell } from './VerifiedCell'
import { type ZkCatalogProjectDetails } from './ZkCatalogProjectPage'

import { AccordionHeader, AccordionTrigger } from '@radix-ui/react-accordion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '~/app/_components/accordion'
import { OutLink } from '~/app/_components/out-link'
import { cn } from '~/utils/cn'

interface Props {
  items: ZkCatalogProjectDetails['verifiers']
  askForVerificationLink: string
}

export function Verifiers(props: Props) {
  const grid =
    'grid md:grid-cols-[8fr,3fr,6fr,3fr,1fr] grid-cols-[7fr,2.5fr,1fr]'

  return (
    <div className="w-full">
      <div
        className={cn(
          'border-b border-gray-200 align-bottom dark:border-zinc-700',
          grid,
        )}
      >
        <div className="flex items-end px-4 py-2 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50 md:items-start">
          Name
        </div>
        <div className="hidden py-2 pr-4 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50 md:block">
          Verifier
        </div>
        <div className="py-2 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50 md:pl-0">
          Verification status
        </div>
        <div className="hidden py-2 pr-4 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-50 md:block">
          Last used
        </div>
      </div>
      <Accordion type="multiple" className="w-full">
        {props.items.map((item) => (
          <AccordionItem
            key={`${item.contractAddress.toString()}-${+item.chainId}`}
            value={`${item.contractAddress.toString()}-${+item.chainId}`}
            className={cn(
              'w-full transition-colors hover:!bg-zinc-100 data-[state=open]:bg-gray-100 dark:hover:!bg-neutral-800 dark:data-[state=open]:bg-zinc-900',
            )}
          >
            <AccordionHeader asChild>
              <AccordionTrigger asChild>
                <div
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between border-b border-gray-200 text-left data-[state=open]:border-none dark:border-zinc-700 md:h-14',
                    grid,
                  )}
                >
                  <div className="flex items-center pl-4 text-base font-medium md:text-lg">
                    {item.name}
                  </div>
                  <div className="hidden items-center text-sm md:flex md:text-base">
                    <EtherscanLink
                      etherscanUrl={getExplorerUrlByChainId(item.chainId)}
                      address={item.contractAddress.toString()}
                    />
                  </div>
                  <div className="flex items-center">
                    <VerifiedCell
                      verified={item.verified}
                      askForVerificationLink={props.askForVerificationLink}
                      performedBy={
                        item.verified !== 'no' ? item.performedBy : undefined
                      }
                    />
                  </div>
                  <div className="hidden items-center md:flex">
                    <LastUsedCell days={item.lastUsedDaysAgo} />
                  </div>
                  <div className="flex items-center px-1.5 md:p-0">
                    <ChevronDownIcon className="fill-current transition-transform duration-300 ease-out group-data-[state=open]:-rotate-180" />
                  </div>
                </div>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className="border-b border-gray-200 dark:border-zinc-700">
              <div className="mt-1 space-y-5 px-4 pb-5 md:hidden">
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-50">
                    Verifier
                  </p>
                  <EtherscanLink
                    address={item.contractAddress.toString()}
                    className="break-all"
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-50">
                    Last used
                  </p>
                  <LastUsedCell days={item.lastUsedDaysAgo} />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-50">
                    Description
                  </p>
                  <Markdown className="text-xs">{item.description}</Markdown>
                </div>
                <SubVerifiersTable verifier={item} />
                {item.verified === 'no' ? (
                  <OutLink href={props.askForVerificationLink}>
                    Ask for verification
                  </OutLink>
                ) : null}
              </div>
              <div className="mt-1 hidden space-y-5 px-4 pb-5 md:block">
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-50">
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
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
