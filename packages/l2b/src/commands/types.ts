import { EthereumAddress } from '@l2beat/shared-pure'
import { Type } from 'cmd-ts'

export const EthereumAddressValue: Type<string, EthereumAddress> = {
  async from(str): Promise<EthereumAddress> {
    return new Promise((resolve, _) => {
      resolve(EthereumAddress(str))
    })
  },
}
