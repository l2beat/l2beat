import { EtherscanLink } from '~/app/_components/etherscan-link';
import { Markdown } from '~/app/_components/markdown/markdown';
import { getExplorerUrlByChainId } from '../../_utils/getExplorerUrl';
import { LastUsedCell } from './LastUsedCell';
import { SubVerifiersTable } from './SubVerifiersTable';
import { VerifiedCell } from './VerifiedCell';
import { type ZkCatalogProjectDetails } from './ZkCatalogProjectPage';
import ChevronDownIcon from '~/icons/chevron.svg';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/app/_components/accordion';
import { cn } from '~/utils/cn';
import { OutLink } from '~/app/_components/out-link';

interface Props {
  items: ZkCatalogProjectDetails['verifiers'];
  askForVerificationLink: string;
}

export function Verifiers(props: Props) {
  const grid =
    'grid md:grid-cols-[8fr,3fr,6fr,2.5fr,0.5fr] grid-cols-[18fr,2.5fr,0.5fr]';

  return (
    <div className="w-full">
      <div
        className={cn(
          'border-gray-200 border-b align-bottom dark:border-zinc-700',
          grid
        )}
      >
        <div className="px-4 py-2 text-start font-semibold text-gray-500 text-xs uppercase dark:text-gray-50 flex items-end md:items-start">
          Name
        </div>
        <div className="hidden py-2 pr-4 text-start font-semibold text-gray-500 text-xs uppercase md:block dark:text-gray-50">
          Verifier
        </div>
        <div className="py-2 pr-5 md:pl-0 text-start font-semibold text-gray-500 text-xs uppercase dark:text-gray-50">
          Verification status
        </div>
        <div className="hidden py-2 pr-4 text-start font-semibold text-gray-500 text-xs uppercase md:block dark:text-gray-50">
          Last used
        </div>
      </div>
      <Accordion type="multiple" className="w-full">
        {props.items.map((item) => (
          <AccordionItem
            key={item.contractAddress.toString()}
            value={item.contractAddress.toString()}
            className={cn(
              'hover:!bg-zinc-100 dark:hover:!bg-neutral-800 transition-colors dark:data-[state=open]:bg-zinc-900 data-[state=open]:bg-gray-100 w-full'
            )}
          >
            <AccordionTrigger
              childrenClassName={grid}
              mergeIndicator
              indicator={
                <div className="flex items-center">
                  <ChevronDownIcon className='fill-current transition-transform duration-300 ease-out group-data-[state="open"]/accordion-item:rotate-180' />
                </div>
              }
              className={cn(
                'md:h-14 cursor-pointer border-gray-200 border-b dark:border-zinc-700 group-data-[state="open"]/accordion-item:border-none text-left md:py-4'
              )}
            >
              <div className="px-4 font-medium text-base md:text-lg flex items-center">
                {item.name}
              </div>
              <div className="hidden text-sm md:text-base md:flex items-center">
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
              <div className="hidden md:flex items-center">
                <LastUsedCell days={item.lastUsedDaysAgo} />
              </div>
            </AccordionTrigger>

            <AccordionContent className="border-gray-200 border-b dark:border-zinc-700">
              <div className="mt-1 space-y-5 px-4 pb-5 md:hidden">
                <div>
                  <p className="mb-2 font-medium text-gray-500 text-xs dark:text-gray-50">
                    Verifier
                  </p>
                  <EtherscanLink
                    address={item.contractAddress.toString()}
                    className="break-all"
                  />
                </div>
                <div>
                  <p className="mb-2 font-medium text-gray-500 text-xs dark:text-gray-50">
                    Last used
                  </p>
                  <LastUsedCell days={item.lastUsedDaysAgo} />
                </div>
                <div>
                  <p className="mb-2 font-medium text-gray-500 text-xs dark:text-gray-50">
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
              <div className="hidden mt-1 space-y-5 px-4 pb-5 md:block">
                <div>
                  <p className="mb-2 font-medium text-gray-500 text-xs dark:text-gray-50">
                    Description
                  </p>
                  <Markdown className="font-medium text-xs text-zinc-900/80 dark:text-white/80">
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
  );
}
