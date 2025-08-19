import {
  assert,
  ChainSpecificAddress,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../../provider/IProvider'
import type { Handler, HandlerResult } from '../../Handler'

export type YieldFiDefinition = v.infer<typeof YieldFiDefinition>
export const YieldFiDefinition = v.strictObject({
  type: v.literal('yieldfi'),
})

export class YieldFiHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(readonly field: string) {}

  async execute(
    provider: IProvider,
    token: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const pastManagers = await getPastManagers(provider, token)
    const pastAdmins = await getPastAdmins(provider, token)

    return {
      field: this.field,
      value: {
        pastMinters: pastManagers,
        pastMinterManagers: pastAdmins,
      },
    }
  }
}

async function getPastAdmins(
  provider: IProvider,
  token: ChainSpecificAddress,
): Promise<ChainSpecificAddress[]> {
  const abi = [
    'event AdministratorSet(address indexed caller, address indexed newAdministrator)',
  ]
  const iface = new utils.Interface(abi)
  const topic0 = iface.getEventTopic('AdministratorSet')

  function parseAdminSet(log: providers.Log, chainShortName: string) {
    const [, newAdministrator] = iface.parseLog(log).args

    return ChainSpecificAddress.from(chainShortName, newAdministrator)
  }

  const currentAdmin = await provider.callMethod<EthereumAddress>(
    token,
    'function administrator() view returns (address)',
    [],
  )
  assert(currentAdmin)

  const logs = await provider.getLogs(token, [topic0])
  const chainShortName = ChainSpecificAddress.chain(token)
  return [
    ChainSpecificAddress.from(chainShortName, currentAdmin),
    ...logs.map((log) => parseAdminSet(log, chainShortName)),
  ]
}

async function getPastManagers(
  provider: IProvider,
  token: ChainSpecificAddress,
): Promise<ChainSpecificAddress[]> {
  const abi = [
    'event ManagerSet(address indexed caller, address indexed manager)',
  ]
  const iface = new utils.Interface(abi)
  const topic0 = iface.getEventTopic('ManagerSet')

  function parseManagerSet(
    log: providers.Log,
    chainShortName: string,
  ): ChainSpecificAddress {
    const [, manager] = iface.parseLog(log).args

    return ChainSpecificAddress.from(chainShortName, manager)
  }

  const currentManager = await provider.callMethod<EthereumAddress>(
    token,
    'function manager() view returns (address)',
    [],
  )

  assert(currentManager)

  const logs = await provider.getLogs(token, [topic0])
  const chainShortName = ChainSpecificAddress.chain(token)
  return [
    ChainSpecificAddress.from(chainShortName, currentManager),
    ...logs.map((log) => parseManagerSet(log, chainShortName)),
  ]
}
