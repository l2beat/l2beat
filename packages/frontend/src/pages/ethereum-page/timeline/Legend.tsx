/** How to read a tile, once, above the strip rather than on every tile */
export function Legend() {
  return (
    <dl className="flex flex-wrap items-center gap-x-5 gap-y-2 text-label-value-12 text-secondary">
      <Item glyph={<Glyph top />}>Gas used, up from the chain</Item>
      <Item glyph={<Glyph />}>Blobs, down from the chain</Item>
      <Item
        glyph={
          <span className="w-4 border-primary/50 border-t border-dashed" />
        }
      >
        Target
      </Item>
      <Item
        glyph={
          <span className="size-3 rounded-[3px] border-2 border-brand shadow-[0_0_6px_var(--brand)]" />
        }
      >
        Head
      </Item>
    </dl>
  )
}

function Item({
  glyph,
  children,
}: {
  glyph: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-1.5">
      <dt className="flex items-center">{glyph}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function Glyph({ top = false }: { top?: boolean }) {
  return (
    <span className="relative flex h-4 w-2.5 flex-col overflow-hidden rounded-[2px] bg-surface-tertiary/60">
      <span className="h-1/2">
        {top && <span className="mt-[3px] block h-[5px] bg-primary/75" />}
      </span>
      <span className="h-1/2 border-primary/30 border-t">
        {!top && <span className="block h-[4px] bg-chart-teal" />}
      </span>
    </span>
  )
}
