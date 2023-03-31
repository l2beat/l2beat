import { EthereumAddress } from '@l2beat/shared'

import { ArrayFromTwoEventsHandler } from '../../handlers/user/ArrayFromTwoEventsHandler'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { DiscoveryLogger } from '../../utils/DiscoveryLogger'
import { getCallResult } from '../../utils/getCallResult'

export async function getProxyGovernance(
  provider: DiscoveryProvider,
  address: EthereumAddress,
) {
  const eventHandler = new ArrayFromTwoEventsHandler(
    'governance',
    {
      type: 'arrayFromTwoEvents',
      addEvent: 'event LogNewGovernorAccepted(address acceptedGovernor)',
      addKey: 'acceptedGovernor',
      removeEvent: 'event LogRemovedGovernor(address removedGovernor)',
      removeKey: 'removedGovernor',
    },
    [
      'event LogNewGovernorAccepted(address acceptedGovernor)',
      'event LogRemovedGovernor(address removedGovernor)',
    ],
    DiscoveryLogger.SILENT,
  )
  const fullGovernance = (await eventHandler.execute(provider, address))
    .value as string[]
  const isGovernorAll = await Promise.all(
    fullGovernance.map((governor) =>
      getCallResult(
        provider,
        address,
        'function proxyIsGovernor(address testGovernor) view returns (bool)',
        [governor],
      ),
    ),
  )
  const filteredGovernance = fullGovernance.filter((_, i) => isGovernorAll[i])
  return filteredGovernance.map((governor) => EthereumAddress(governor))
}
