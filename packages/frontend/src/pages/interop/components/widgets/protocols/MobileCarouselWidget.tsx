'use client'

import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from '~/components/core/Carousel'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { cn } from '~/utils/cn'
import { TopProtocolsByTransfers } from './TopProtocolsByTransfers'
import { TopProtocolsByVolume } from './TopProtocolsByVolume'

interface Props {
  interopChains: InteropChainWithIcon[]
  flows: InteropDashboardData['flows'] | undefined
  topProtocols: InteropDashboardData['topProtocols'] | undefined
  isLoading: boolean
}

export function MobileCarouselWidget({ topProtocols, isLoading }: Props) {
  return (
    <div className="relative h-full max-md:min-h-[213px] max-md:border-divider max-md:border-b min-[1600px]:hidden">
      <Carousel opts={{ loop: false }} className="h-full">
        <CarouselContent viewportClassName="h-full" className="-ml-5 h-full">
          <CarouselItem className="pl-5">
            <TopProtocolsByVolume
              topProtocols={topProtocols}
              isLoading={isLoading}
            />
          </CarouselItem>
          <CarouselItem className="pl-5">
            <TopProtocolsByTransfers
              topProtocols={topProtocols}
              isLoading={isLoading}
            />
          </CarouselItem>
        </CarouselContent>
        <DotButtons />
      </Carousel>
    </div>
  )
}

function DotButtons() {
  const { api } = useCarousel()
  const [selected, setSelected] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setSelected(api.selectedScrollSnap())
    }

    onSelect()
    api.on('select', onSelect)

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <div className="-translate-x-1/2 absolute bottom-3 left-1/2 z-20 flex">
      <DotElement onClick={() => api?.scrollTo(0)} selected={selected === 0} />
      <DotElement onClick={() => api?.scrollTo(1)} selected={selected === 1} />
    </div>
  )
}

function DotElement({
  onClick,
  wrapperClassName,
  selected,
}: {
  onClick: () => void
  wrapperClassName?: string
  selected: boolean
}) {
  return (
    <div
      className={cn(
        'flex size-4 cursor-pointer items-center justify-center',
        wrapperClassName,
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'size-2 rounded-xs',
          selected ? 'bg-brand' : 'bg-secondary',
        )}
      />
    </div>
  )
}
