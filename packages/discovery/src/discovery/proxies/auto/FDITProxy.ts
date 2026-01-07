import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import { FunctionSelectorDecoder } from '../../utils/FunctionSelectorDecoder'
import type { ProxyDetails } from '../types'

export async function detectFditProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const packages = await provider.callMethod<EthereumAddress[]>(
    address,
    'function getPackagesUsedByCurrentComponent() external view returns (address[] memory)',
    [],
  )
  if (!packages || packages.length === 0) {
    return undefined
  }

  const packageAddresses = packages.map((pkg) =>
    ChainSpecificAddress.fromLong(provider.chain, pkg),
  )
  const selectors = await Promise.all(
    packages.map(async (pkg) => {
      const result = await provider.callMethod<string[]>(
        address,
        'function getFunctionSelectorsOfPackage(address packageAddress) external view returns (bytes4[] memory)',
        [pkg],
      )
      if (!result) {
        return undefined
      }
      return {
        package: ChainSpecificAddress.fromLong(provider.chain, pkg),
        selectors: result,
      }
    }),
  )

  if (selectors.some((value) => value === undefined)) {
    return undefined
  }

  const decoder = new FunctionSelectorDecoder(provider)
  await decoder.fetchTargets(packageAddresses)

  const facets: Record<string, string[]> = {}
  for (const entry of selectors) {
    if (!entry) {
      continue
    }
    const decodedSelectors = await Promise.all(
      entry.selectors.map((selector) =>
        decoder.decodeSelector(entry.package, selector),
      ),
    )
    facets[entry.package.toString()] = decodedSelectors
  }

  const implementations = [
    ...new Set(packageAddresses.map((pkg) => pkg.toString())),
  ]

  return {
    type: 'FDIT proxy',
    values: {
      $implementation: implementations,
      FDITFacets: facets,
    },
  }
}
