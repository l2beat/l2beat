import type { DaAttributes } from './DaLayer'

export type DasErasureCodingScheme =
  | typeof OneDReedSolomon
  | typeof TwoDReedSolomon

const OneDReedSolomon = {
  type: 'OneDReedSolomon',
  value: '1D Reed-Solomon',
  description: 'TODO',
} as const

const TwoDReedSolomon = {
  type: 'TwoDReedSolomon',
  value: '2D Reed-Solomon',
  description: 'TODO',
} as const

export const DasErasureCodingScheme = {
  OneDReedSolomon,
  TwoDReedSolomon,
} satisfies DaAttributes
