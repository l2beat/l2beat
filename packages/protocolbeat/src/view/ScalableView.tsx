import clsx from 'clsx'
import { type ForwardedRef, type ReactNode, forwardRef } from 'react'

import type { State } from '../store/State'

export interface ScalableViewProps {
  children: ReactNode
  transform: State['transform']
}

export const ScalableView = forwardRef(
  (props: ScalableViewProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className="relative h-full w-full origin-[0_0] select-none"
        style={{
          transform: `translate(${props.transform.offsetX}px, ${props.transform.offsetY}px) scale(${props.transform.scale})`,
        }}
      >
        {/* infinite grid */}
        <div
          className={clsx(
            'absolute h-full w-full',
            props.transform.scale < 0.5 && 'hidden',
          )}
          style={{
            left:
              (-props.transform.offsetX +
                modulo(props.transform.offsetX, 20 * props.transform.scale)) /
              props.transform.scale,
            top:
              (-props.transform.offsetY +
                modulo(props.transform.offsetY, 20 * props.transform.scale)) /
              props.transform.scale,
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
