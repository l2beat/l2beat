import { formatCurrency } from '@l2beat/shared-pure'
import type { TokenGraphTile as Tile } from '~/server/features/tokens/buildTokenGraphTiles'
import { TokenGraphTileDiagram } from './TokenGraphTileDiagram'

export function TokenGraphTile({
  tile,
  onOpen,
}: {
  tile: Tile
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col rounded-lg border border-divider bg-surface-primary p-4 text-left transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-brand/50"
    >
      <span className="flex w-full items-center gap-2">
        <img
          src={tile.iconUrl}
          alt=""
          width={24}
          height={24}
          className="size-6 shrink-0 rounded-full"
        />
        <span className="min-w-0">
          <span className="block truncate font-bold text-label-value-15">
            {tile.symbol}
          </span>
          {tile.issuer && (
            <span className="block truncate text-label-value-12 text-secondary">
              Issued by <span className="capitalize">{tile.issuer}</span>
            </span>
          )}
        </span>
        {tile.volume !== null && (
          <span className="ml-auto shrink-0 font-medium text-label-value-13 text-secondary">
            {formatCurrency(tile.volume, 'usd')}
          </span>
        )}
      </span>

      <span className="my-3 block w-full">
        <TokenGraphTileDiagram graph={tile.graph} />
      </span>

      <span className="text-label-value-12 text-secondary">
        {count(tile.deploymentsCount, 'deployment')}
        {' · '}
        {count(tile.chainsCount, 'chain')}
        {tile.bridgesCount > 0 && (
          <>
            {' · '}
            {count(tile.bridgesCount, 'bridge')}
          </>
        )}
      </span>
    </button>
  )
}

function count(value: number, noun: string): string {
  return `${value} ${noun}${value === 1 ? '' : 's'}`
}
