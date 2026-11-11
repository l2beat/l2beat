import { Logo } from '~/components/Logo'

/**
 * Sits in the diagram's frame behind the graph, so it stays put while the
 * graph pans. Slightly wider than a single-column node card (268px).
 */
export function DiagramWatermark() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <Logo animated={false} className="h-[118px] w-72 opacity-[0.07]" />
    </div>
  )
}
