import { ArrowRightIcon } from '~/icons/ArrowRight'
import { ChainSelect } from './ChainSelect'
import type { InteropChainWithIcon } from './types'

export function ChainPairSelector({
  chains,
  src,
  dst,
  onSrcChange,
  onDstChange,
}: {
  chains: InteropChainWithIcon[]
  src: string
  dst: string
  onSrcChange: (id: string) => void
  onDstChange: (id: string) => void
}) {
  return (
    <div className="mt-4 flex items-center gap-2">
      <ChainSelect
        chains={chains}
        value={src}
        onChange={onSrcChange}
        excludeId={dst}
      />
      <button
        type="button"
        onClick={() => {
          onSrcChange(dst)
          onDstChange(src)
        }}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-divider bg-surface-primary transition-colors hover:bg-surface-secondary"
        aria-label="Swap chains"
      >
        <ArrowRightIcon className="size-4 fill-brand" />
      </button>
      <ChainSelect
        chains={chains}
        value={dst}
        onChange={onDstChange}
        excludeId={src}
      />
    </div>
  )
}
