import { formatCurrency } from '@l2beat/shared-pure'
import type { TokenGraphTile as Tile } from '~/server/features/tokens/buildTokenGraphTiles'
import { cn } from '~/utils/cn'
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
      className={cn(
        'flex flex-col rounded-lg border border-divider bg-surface-primary p-4 text-left',
        'transition-colors hover:border-brand',
      )}
    >
      <div className="flex items-center gap-2">
        {tile.iconUrl && (
          <img
            src={tile.iconUrl}
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0 rounded-full"
          />
        )}
        <div className="min-w-0">
          <p className="truncate font-bold text-label-value-15">
            {tile.symbol}
          </p>
          {tile.issuer && (
            <p className="truncate text-label-value-12 text-secondary">
              Issued by <span className="capitalize">{tile.issuer}</span>
            </p>
          )}
        </div>
        {tile.volume !== null && (
          <span className="ml-auto shrink-0 font-medium text-label-value-13 text-secondary">
            {formatCurrency(tile.volume, 'usd')}
          </span>
        )}
      </div>

      <div className="my-3 grow">
        {tile.hasRelations ? (
          <TokenGraphTileDiagram graph={tile.graph} />
        ) : (
          <p className="flex h-full items-center justify-center text-label-value-12 text-secondary">
            No observed relations
          </p>
        )}
      </div>

      <p className="text-label-value-12 text-secondary">
        {tile.deployments}{' '}
        {tile.deployments === 1 ? 'deployment' : 'deployments'}
        {' · '}
        {tile.chains} {tile.chains === 1 ? 'chain' : 'chains'}
      </p>
    </button>
  )
}
