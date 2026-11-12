import { cn } from '~/utils/cn'
import { TYPE } from './Article'
import { SOURCES } from './footnotes'

/**
 * How the page is written and what each footnote points to, so a reader can
 * check any number on it without taking our word for it.
 */
export function Sources() {
  return (
    <section
      id="sources"
      className="scroll-mt-14 bg-surface-primary px-4 py-10 font-inter md:mt-4 md:rounded-xl md:px-8 md:py-12 xl:px-12"
    >
      <div className="grid gap-10 md:pl-[3.75rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <h2 className="font-semibold text-[19px] tracking-[-0.01em] md:text-[21px]">
            How this page is written
          </h2>
          <div
            className={cn(
              TYPE.note,
              'mt-4 space-y-3 text-[14px] leading-[1.55]',
            )}
          >
            <p>
              Numbers in sentences come from the head of the chain, the newest
              block, which is not final yet. If a reorg replaces that block, the
              page rewrites what it said and prints a correction under the
              headline.
            </p>
            <p>
              History is one point per day, by UTC day. Comparisons use complete
              days only; today's partial day is drawn hollow and dashed, and
              moves as blocks land.
            </p>
            <p>
              Blocks and transactions update every slot, 12 seconds. Staking
              updates every epoch, 32 slots. Dollar values use the price at the
              latest block.
            </p>
            <p className="text-[13px] italic">
              Prototype: the chain and its history are simulated until the head
              indexer is live.
            </p>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-[19px] tracking-[-0.01em] md:text-[21px]">
            Sources
          </h2>
          <ol className="mt-4 space-y-2.5">
            {SOURCES.map((source, i) => (
              <li
                key={source.id}
                id={`source-${source.id}`}
                className="grid scroll-mt-20 grid-cols-[1.75rem_minmax(0,1fr)] text-[14px] leading-[1.45] target:text-primary"
              >
                <span className="font-semibold text-secondary tabular-nums">
                  {i + 1}
                </span>
                <span>
                  <a
                    href={source.href}
                    className="font-medium text-link hover:underline"
                  >
                    {source.title}
                  </a>
                  <span className="text-secondary">, {source.publisher}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
