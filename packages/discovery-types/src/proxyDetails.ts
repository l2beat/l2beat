import { z } from 'zod'

import type { ContractValue } from './Discovery'

export interface ProxyDetails {
  type: string
  values: Record<string, ContractValue | undefined>
}

export type ManualProxyType = z.infer<typeof ManualProxyType>
export const ManualProxyType = z.enum([
  'new Arbitrum proxy',
  'call implementation proxy',
  'zkSync Lite proxy',
  'zkSpace proxy',
  'Eternal Storage proxy',
  'Polygon Extension proxy',
  'Optics Beacon proxy',
  'Axelar proxy',
  'LightLink proxy',
  'immutable',
])
