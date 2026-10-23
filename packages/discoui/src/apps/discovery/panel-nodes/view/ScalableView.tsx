import clsx from 'clsx'
import type { ReactNode } from 'react'

import { useStore } from '../store/store'

export interface ScalableViewProps {
  children?: ReactNode
}

export function ScalableView(props: ScalableViewProps) {
  const { scale, offsetX, offsetY } = useStore((state) => state.transform)

  const size = getGridCellSize(scale)

  return (
    <div
      className="relative h-full w-full origin-top-left select-none"
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
      }}
    >
      {/* infinite grid */}
      <div
        className={clsx('absolute h-full w-full')}
        style={{
          left: (-offsetX + modulo(offsetX, size * scale)) / scale,
          top: (-offsetY + modulo(offsetY, size * scale)) / scale,
        }}
      >
        <div
          className="pointer-events-none absolute bg-[url(/grid.svg)] bg-top-left"
          style={{
            backgroundSize: size,
            top: -20 + '%',
            left: -20 + '%',
            height: 100 / scale + 20 + '%',
            width: 100 / scale + 20 + '%',
          }}
        />
      </div>

      {props.children}
    </div>
  )
}

export function getGridCellSize(scale: number): number {
  if (scale < 0.25) return 180
  if (scale < 0.8) return 60
  return 20
}

function modulo(value: number, mod: number) {
  return ((value % mod) + mod) % mod
}
