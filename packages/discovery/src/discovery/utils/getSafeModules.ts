import { EthereumAddress } from '../../utils/EthereumAddress'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { getCallResult } from './getCallResult'

export async function getModules(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<EthereumAddress[] | undefined> {
  // Sentinel value used by Gnosis Safe to indicate the beginning and
  // the end of the circular linked list.
  // https://github.com/safe-global/safe-contracts/blob/52ce39c89cc3e3529963100dd774a6a03c098792/contracts/base/ModuleManager.sol#L23C35-L23C35
  const SENTINEL_MODULES = '0x0000000000000000000000000000000000000001'
  const PAGINATION_SIZE = 10

  let next = SENTINEL_MODULES
  const modules: EthereumAddress[] = []
  do {
    // Result: [modules[], next]
    const result = await getCallResult<[string[], string]>(
      provider,
      address,
      'function getModulesPaginated(address start, uint256 pageSize) view returns (address[] array, address next)',
      [next, PAGINATION_SIZE],
      blockNumber,
      true,
    )

    if (result === undefined) {
      return undefined
    }

    result[0].forEach((module) => modules.push(EthereumAddress(module)))
    next = result[1]
  } while (next !== SENTINEL_MODULES)
  return modules
}
