import clsx from 'clsx'
import { type ForwardedRef, forwardRef, type ReactNode } from 'react'

import { useStore } from '../store/store'

export interface ScalableViewProps {
  children: ReactNode
}

export const ScalableView = forwardRef(
  (props: ScalableViewProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { scale, offsetX, offsetY } = useStore((state) => state.transform)

    const size = scale < 0.25 ? 180 : scale < 0.8 ? 60 : 20

    return (
      <div
        ref={ref}
        className="relative h-full w-full origin-[0_0] select-none"
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
            className="pointer-events-none absolute bg-[url(/grid.svg)] bg-left-top"
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
  },
)

function modulo(value: number, mod: number) {
  return ((value % mod) + mod) % mod
}
