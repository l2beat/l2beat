import { chainsByDevId } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'

export function getExplorerUrl(devId: string) {
  const chain = chainsByDevId.get(devId)
  assert(chain !== undefined, 'Could not find chain config for devId: ' + devId)
  assert(
    chain.explorerUrl !== undefined,
    'Chain config has no explorerUrl, devId: ' + chain.devId,
  )

  return chain.explorerUrl
}
