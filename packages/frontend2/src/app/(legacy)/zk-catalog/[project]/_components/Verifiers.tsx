import { EtherscanLink } from '~/app/_components/etherscan-link';
import { Markdown } from '~/app/_components/markdown/markdown';
import { OutLink } from '~/app/_components/out-link';
import { getExplorerUrlByChainId } from '../../_utils/getExplorerUrl';
import { LastUsedCell } from './LastUsedCell';
import { SubVerifiersTable } from './SubVerifiersTable';
import { VerifiedCell } from './VerifiedCell';
import { type ZkCatalogProjectDetails } from './ZkCatalogProjectPage';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/app/_components/accordion';
import { cn } from '~/utils/cn';
import { type ZkCatalogOnchainVerifier } from '../../_utils/types';

interface Props {
  items: ZkCatalogProjectDetails['verifiers'];
  askForVerificationLink: string;
}

const grid = 'grid grid-cols-[4fr,3fr,6fr,2.5fr,0.5fr]';
const headerItemStyle =
  'py-2 text-start font-semibold text-gray-500 text-xs uppercase dark:text-gray-50';

export function Verifiers(props: Props) {
  const grid = 'grid grid-cols-[4fr,3fr,6fr,2.5fr,0.5fr]';

  return (
    <div className="w-full">
      <div
        className={cn(
          'border-gray-200 border-b align-bottom dark:border-zinc-700',
          grid
        )}
      >
        <div className="px-4 py-2 text-start font-semibold text-gray-500 text-xs uppercase dark:text-gray-50">
          Name
        </div>
        <div className="hidden py-2 pr-4 text-start font-semibold text-gray-500 text-xs uppercase md:block dark:text-gray-50">
          Verifier
        </div>
        <div className="py-2 pr-4 text-start font-semibold text-gray-500 text-xs uppercase dark:text-gray-50">
          Verification status
        </div>
        <div className="hidden py-2 pr-4 text-start font-semibold text-gray-500 text-xs uppercase md:block dark:text-gray-50">
          Last used
        </div>
      </div>
      <Accordion type="multiple" className="w-full">
        {props.items.slice(0, 1).map((item) => (
          <AccordionItem
            key={item.contractAddress.toString()}
            value={item.contractAddress.toString()}
            className={cn(
              'hover:!bg-zinc-100 dark:hover:!bg-neutral-800 transition-colors dark:data-[state=open]:bg-zinc-900 data-[state=open]:bg-gray-100 w-full'
            )}
          >
            <AccordionTrigger
              childrenClassName={grid}
              className={cn(
                'h-14 cursor-pointer border-gray-200 border-b dark:border-zinc-700 group-data-[state="open"]/accordion-item:border-none text-left py-4'
              )}
            >
              <div className="px-4 font-medium text-base md:text-lg">
                {item.name}
              </div>
              <div className="hidden pr-4 text-sm md:block md:text-base">
                <EtherscanLink
                  etherscanUrl={getExplorerUrlByChainId(item.chainId)}
                  address={item.contractAddress.toString()}
                />
              </div>
              <div className="pr-4">
                <VerifiedCell
                  verified={item.verified}
                  askForVerificationLink={props.askForVerificationLink}
                  performedBy={
                    item.verified !== 'no' ? item.performedBy : undefined
                  }
                />
              </div>
              <div className="hidden pr-4 md:block">
                <LastUsedCell days={item.lastUsedDaysAgo} />
              </div>
            </AccordionTrigger>

            {/* TODO: Check why w-[90%] fixes header altering */}
            <AccordionContent className="border-gray-200 border-b dark:border-zinc-700">
              <div className="mt-1 w-[90%] space-y-5 px-4 pb-5 md:hidden">
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
                <SubVerifiersTable
                  verifier={item}
                  className="w-[calc(100vw_-_64px)] md:w-[calc(100vw_-_128px)]"
                />
                {item.verified === 'no' ? (
                  <OutLink href={props.askForVerificationLink}>
                    Ask for verification
                  </OutLink>
                ) : null}
              </div>
              <div className="mt-1 w-[90%] space-y-5 px-4 pb-5 md:table-cell">
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

      <div className={cn('mt-20 ')}>
        <div
          className={cn(
            grid,
            'border-gray-200 border-b align-bottom dark:border-zinc-700'
          )}
        >
          <div className={cn(headerItemStyle, 'px-4')}>Name</div>
          <div className={headerItemStyle}>Verifier</div>
          <div className={headerItemStyle}>Verification Status</div>
          <div className={headerItemStyle}>Last Used</div>
          {/* Empty chevron grid cell */}
          <div>^^^</div> {}
        </div>
        <div className="col-span-full">
          {props.items.map((item) => (
            <VerifiersRow
              key={item.contractAddress.toString()}
              askForVerificationLink={props.askForVerificationLink}
              verifier={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type VerifiersRowProps = {
  verifier: ZkCatalogOnchainVerifier;
  askForVerificationLink: string;
};

function VerifiersRow(props: VerifiersRowProps) {
  return (
    <div className="w-full">
      <div
        className={cn(
          'cursor-pointer border-gray-200 border-b dark:border-zinc-700 text-left py-1.5',
          grid
        )}
      >
        <div className="px-4 font-medium text-base md:text-lg flex items-center">
          {props.verifier.name}
        </div>
        <div className="hidden pr-4 text-sm md:text-base md:flex items-center">
          <EtherscanLink
            etherscanUrl={getExplorerUrlByChainId(props.verifier.chainId)}
            address={props.verifier.contractAddress.toString()}
          />
        </div>
        <VerifiedCell
          verified={props.verifier.verified}
          askForVerificationLink={props.askForVerificationLink}
          performedBy={
            props.verifier.verified !== 'no'
              ? props.verifier.performedBy
              : undefined
          }
        />
        <div className="hidden pr-4 md:flex items-center">
          <LastUsedCell days={props.verifier.lastUsedDaysAgo} />
        </div>
        <div className="flex items-center">^^^</div>
      </div>
      <div className="mt-1 w-[90%] space-y-5 px-4 pb-5 md:table-cell">
        <div>
          <p className="mb-2 font-medium text-gray-500 text-xs dark:text-gray-50">
            Description
          </p>
          <Markdown className="font-medium text-xs text-zinc-900/80 dark:text-white/80">
            {props.verifier.description}
          </Markdown>
        </div>
        <SubVerifiersTable
          verifier={props.verifier}
          className="w-[calc(100vw_-_64px)] md:w-[calc(100vw_-_128px)]"
        />
      </div>
    </div>
  );
}
