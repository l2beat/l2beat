import { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { IProvider } from '../provider/IProvider'

export interface HandlerResult {
  field: string
  value?: ContractValue
  error?: string
  fragment?: utils.FunctionFragment
  ignoreRelative?: boolean
}

export interface Handler {
  field: string
  dependencies: string[]
  execute(
    provider: IProvider,
    address: EthereumAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult>
}
