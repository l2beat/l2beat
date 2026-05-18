import type { FrameworkTableEntry } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { cn } from '~/utils/cn'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'
import { BridgingTypeBreakdown } from './BridgingTypeBreakdown'
import { ChainPathRow, TokenRow } from './Rows'
import { ScrollList, Section } from './Section'
import { BreakdownSkeleton, EmptyState, RowsSkeleton } from './states'

export function FrameworkColumn({
  framework,
  entry,
  isFirst,
  isLoading,
}: {
  framework: InteropTokenFramework
  entry: FrameworkTableEntry | undefined
  isFirst: boolean
  isLoading: boolean
}) {
  return (
    <div
      className={cn(
        'flex w-60 shrink-0 flex-col p-4 md:w-67.5 md:p-5',
        !isFirst && 'border-divider border-l',
      )}
    >
      <div className="flex items-center gap-2">
        <img
          src={framework.iconUrl}
          alt={framework.name}
          className="size-7 rounded-xs"
        />
        <span className="font-medium text-heading-24">{framework.label}</span>
      </div>

      <div className="mt-5 space-y-8">
        <Section
          title="Tokens by Volume"
          subtitle={
            entry && entry.tokens.length > 0
              ? `${formatInteger(entry.tokens.length)} total tokens`
              : undefined
          }
        >
          <ScrollList>
            {isLoading ? (
              <RowsSkeleton />
            ) : !entry || entry.tokens.length === 0 ? (
              <EmptyState />
            ) : (
              entry.tokens.map((token) => (
                <TokenRow key={token.id} token={token} />
              ))
            )}
          </ScrollList>
        </Section>

        <Section title="Chain Paths by Volume">
          <ScrollList>
            {isLoading ? (
              <RowsSkeleton />
            ) : !entry || entry.chainPaths.length === 0 ? (
              <EmptyState />
            ) : (
              entry.chainPaths.map((path, i) => (
                <ChainPathRow
                  key={`${path.src.id}-${path.dst.id}-${i}`}
                  path={path}
                />
              ))
            )}
          </ScrollList>
        </Section>

        <Section title="Bridging Type Breakdown">
          {isLoading ? (
            <BreakdownSkeleton />
          ) : !entry || entry.bridgingTypeBreakdown.length === 0 ? (
            <EmptyState />
          ) : (
            <BridgingTypeBreakdown items={entry.bridgingTypeBreakdown} />
          )}
        </Section>
      </div>
    </div>
  )
}
