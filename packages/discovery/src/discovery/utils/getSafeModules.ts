import { ChainSpecificAddress } from '@l2beat/shared-pure'

import type { IProvider } from '../provider/IProvider'

export async function getModules(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress[] | undefined> {
  // Sentinel value used by Gnosis Safe to indicate the beginning and
  // the end of the circular linked list.
  // https://github.com/safe-global/safe-contracts/blob/52ce39c89cc3e3529963100dd774a6a03c098792/contracts/base/ModuleManager.sol#L23C35-L23C35
  const SENTINEL_MODULES = '0x0000000000000000000000000000000000000001'
  const PAGINATION_SIZE = 10

  let next = SENTINEL_MODULES
  const modules: ChainSpecificAddress[] = []
  do {
    // Result: [modules[], next]
    const result = await provider.callMethod<[string[], string]>(
      address,
      'function getModulesPaginated(address start, uint256 pageSize) view returns (address[] array, address next)',
      [next, PAGINATION_SIZE],
    )

    if (result === undefined) {
      return undefined
    }

    result[0].forEach((module) =>
      modules.push(ChainSpecificAddress.fromLong(provider.chain, module)),
    )
    next = result[1]
  } while (next !== SENTINEL_MODULES)
  return modules
}
