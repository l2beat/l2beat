import { EthereumAddress, formatSeconds } from '@l2beat/shared-pure'

import { ScalingProjectPermissionedAccount } from '../../../../common'
import { ProjectDiscovery } from '../../../ProjectDiscovery'

const discovery = new ProjectDiscovery('arbitrum')

const getSequencerFailureString = () => {
  const maxTimeVariation = discovery.getContractValue<number[]>(
    'SequencerInbox',
    'maxTimeVariation',
  )
  const delaySeconds = maxTimeVariation[2]

  return `In the event of sequencer failure, after ${formatSeconds(
    delaySeconds,
  )} users can force transactions to be included in the L2 chain by sending it to the L1.`
}

const getProposerFailureString = (delayBlocks: number) => {
  const delay = formatSeconds(delayBlocks * 12)

  return `Anyone can become a Proposer after approximately ${delay} (${delayBlocks} blocks) of inactivity from the currently whitelisted Proposers.`
}

// HARDCODED
const OLD_BRIDGE = EthereumAddress('0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515')

const DERI_VALIDATORS: ScalingProjectPermissionedAccount[] = [
  {
    address: EthereumAddress('0xD217853C6A59e51dC1a48CEF21d9E53FCaA8a3f0'),
    type: 'EOA',
  },
]

export const ARBITRUM = {
  OLD_BRIDGE,
  getSequencerFailureString,
  getProposerFailureString,
  DERI: {
    VALIDATORS: DERI_VALIDATORS,
  },
}
