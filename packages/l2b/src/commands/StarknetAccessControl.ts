import { HttpClient } from '@l2beat/shared'
import { command, option, restPositionals, type Type } from 'cmd-ts'
import { getAccessControlState } from '../implementations/starknet-access-control/getAccessControlState'
import { StarknetClient } from '../implementations/starknet-access-control/StarknetClient'
import { HttpUrl } from './types'

export const StarknetAddressValue: Type<string, string> = {
  from(str): Promise<string> {
    return new Promise((resolve, _) => {
      const address = str.startsWith('0x') ? str.slice(2) : str

      const isValidHex = /^[0-9a-fA-F]{64}$/.test(address)

      if (!isValidHex) {
        throw new Error(
          `Invalid Starknet address: ${str}. Must be a 64-character hex string with optional 0x prefix.`,
        )
      }

      resolve(`0x${address.toLowerCase()}`)
    })
  },
}

export const StarknetAccessControl = command({
  name: 'starknet-access-control',
  description: 'Resolve access control for a list of starknet addresses',
  args: {
    addresses: restPositionals({
      type: StarknetAddressValue,
      displayName: 'addresses',
      description: 'Addresses for which we want to resolve access control',
    }),
    endpoint: option({
      type: HttpUrl,
      long: 'endpoint',
      short: 'e',
    }),
  },
  handler: async (args) => {
    const httpClient = new HttpClient()
    const client = new StarknetClient(args.endpoint, httpClient)

    for (const address of args.addresses) {
      const state = await getAccessControlState(address, client)
      console.log(`State ${address}:\n${JSON.stringify(state, null, 2)}`)
    }
  },
})
