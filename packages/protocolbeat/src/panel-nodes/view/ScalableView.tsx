import clsx from 'clsx'
import { type ForwardedRef, type ReactNode, forwardRef } from 'react'

import { useStore } from '../store/store'

export interface ScalableViewProps {
  children: ReactNode
}

export const ScalableView = forwardRef(
  (props: ScalableViewProps, ref: ForwardedRef<HTMLDivElement>) => {
    const transform = useStore((state) => state.transform)
    return (
      <div
        ref={ref}
        className="relative h-full w-full origin-[0_0] select-none"
        style={{
          transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${transform.scale})`,
        }}
      >
        {/* infinite grid */}
        <div
          className={clsx(
            'absolute h-full w-full',
            transform.scale < 0.5 && 'hidden',
          )}
          style={{
            left:
              (-transform.offsetX +
                modulo(transform.offsetX, 20 * transform.scale)) /
              transform.scale,
            top:
              (-transform.offsetY +
                modulo(transform.offsetY, 20 * transform.scale)) /
              transform.scale,
          }}
        >
          <div className="pointer-events-none absolute top-[-220%] left-[-220%] h-[440%] w-[440%] bg-[url(/grid.svg)] bg-center" />
        </div>

        {props.children}
      </div>
    )
  },
)

function modulo(value: number, mod: number) {
  return ((value % mod) + mod) % mod
}
