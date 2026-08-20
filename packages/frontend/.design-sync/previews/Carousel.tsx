import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@l2beat/frontend'

const SLIDES = [
  { name: 'Arbitrum One', tvs: '$18.2B', kind: 'Rollup' },
  { name: 'OP Mainnet', tvs: '$7.4B', kind: 'Rollup' },
  { name: 'Base', tvs: '$11.9B', kind: 'Rollup' },
]

// Mirrors the app's own usage (MobileCarouselWidget): a relative wrapper, an
// overflow-hidden viewport, and one full-width slide at a time.
export function OneSlideAtATime() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <Carousel opts={{ loop: true }}>
        <CarouselContent viewportClassName="overflow-hidden" className="ml-0">
          {SLIDES.map((s) => (
            <CarouselItem key={s.name} className="pl-0">
              <div className="rounded-lg bg-surface-primary px-12 py-8 text-center text-primary">
                <div className="font-bold text-lg">{s.name}</div>
                <div className="pt-1 text-secondary text-sm">
                  {s.kind} · {s.tvs} TVS
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  )
}
