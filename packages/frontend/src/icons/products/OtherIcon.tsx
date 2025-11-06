import type { JSX, SVGAttributes } from 'react'
import { GrowThePieIcon } from './GrowThePie'
import { RollupCodesIcon } from './RollupCodes'

export type OtherIconType = 'growthepie' | 'rollup.codes'

interface Props extends SVGAttributes<SVGElement> {
  product: OtherIconType
}

export function OtherIcon({ product, ...props }: Props): JSX.Element {
  switch (product) {
    case 'growthepie':
      return <GrowThePieIcon {...props} />
    case 'rollup.codes':
      return <RollupCodesIcon {...props} />
  }
}
