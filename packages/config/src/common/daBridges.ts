import { ProjectId } from '@l2beat/shared-pure'
import { probabilityOfCompromise } from '../common'
import { type DaProjectTableValue, getDacSentiment } from './dataAvailability'

const NONE: DaProjectTableValue = {
  value: 'None',
  sentiment: 'bad',
  description:
    'There is no bridge that can attest if the data has been made available.',
  orderHint: -2,
}

const NONE_WITH_DA_CHALLENGES: DaProjectTableValue = {
  value: 'None + DA challenges',
  sentiment: 'bad',
  description:
    'There is no bridge that can attest if the data has been made available. However, there is a mechanism that allows users to challenge the unavailability of data.',
  orderHint: -1,
}

const ENSHRINED: DaProjectTableValue = {
  value: 'Enshrined',
  sentiment: 'good',
  description:
    'The validating bridge has access to all the data, as it is posted onchain.',
  projectId: ProjectId('ethereum'),
}

const OPTIMISTIC: DaProjectTableValue = {
  value: 'Optimistic',
  sentiment: 'bad',
  description:
    'There is a mechanism that allows validators to request that the Sequencer posts data onchain via L1 contract if they find that data is unavailable.',
}

const BLOBSTREAM: DaProjectTableValue = {
  value: 'Blobstream',
  sentiment: 'warning',
  description:
    'The Blobstream DA bridge is used to attest to the data availability on Celestia.',
  projectId: ProjectId('blobstream'),
}

const VECTOR: DaProjectTableValue = {
  value: 'Vector',
  sentiment: 'warning',
  description:
    'The Vector DA bridge is used to attest to the data availability on Avail.',
  projectId: ProjectId('vector'),
}

const PLASMA: DaProjectTableValue = {
  value: 'Plasma',
  sentiment: 'good',
  description:
    'Data is not posted to Ethereum but to a plasma chain. There is a guarantee that if data is unavailable you can still exit using latest available state root.',
}

const TEE_BRIDGE: DaProjectTableValue = {
  value: 'TEE Bridge',
  sentiment: 'bad',
  description:
    'The TEE Bridge is used to attest to the data availability on the DA layer by using a program running in a Trusted Execution Environment (TEE).',
  projectId: ProjectId('tee-bridge'),
}

const HOTSHOT_LIGHT_CLIENT: DaProjectTableValue = {
  value: 'HotShot Light Client',
  sentiment: 'warning',
  description:
    'The HotShot Light Client is used to attest to the data availability on Espresso.',
  projectId: ProjectId('espresso'),
}

function DAC_MEMBERS({
  requiredSignatures,
  membersCount,
}: {
  requiredSignatures: number
  membersCount: number
}): DaProjectTableValue {
  return {
    value: requiredSignatures
      ? `${requiredSignatures}/${membersCount} DAC Members`
      : 'DAC Members',
    sentiment: getDacSentiment({
      requiredSignatures: requiredSignatures,
      membersCount: membersCount,
    }),
    description: requiredSignatures
      ? `There is a threshold of ${requiredSignatures}/${membersCount} members that must sign and attest that the data is correct and available.`
      : 'There is a threshold of DAC members that must sign and attest that the data is correct and available.',
    orderHint: -probabilityOfCompromise(requiredSignatures, membersCount),
  }
}

function STAKED_OPERATORS({
  requiredSignatures,
  membersCount,
}: {
  requiredSignatures: number
  membersCount: number
}): DaProjectTableValue {
  return {
    value: `${requiredSignatures}/${membersCount} Staked Operators`,
    sentiment: 'warning',
    description: `There is a threshold of ${requiredSignatures}/${membersCount} of staked operators that must sign and attest that the data has been made available.`,
    orderHint: -probabilityOfCompromise(requiredSignatures, membersCount),
  }
}

const SELF_ATTESTED_INTMAX: DaProjectTableValue = {
  value: 'Self-attested',
  sentiment: 'good',
  description:
    'Users self attest the collection of data to the aggregator when depositing or transferring funds, and the protocol verifies the signatures before accepting the deposit. When funds are received, users will need to confirm the collection of data from the sender before accepting the payment.',
}

export const DA_BRIDGES = {
  NONE,
  NONE_WITH_DA_CHALLENGES,
  ENSHRINED,
  OPTIMISTIC,
  BLOBSTREAM,
  VECTOR,
  DAC_MEMBERS,
  STAKED_OPERATORS,
  SELF_ATTESTED_INTMAX,
  PLASMA,
  TEE_BRIDGE,
  HOTSHOT_LIGHT_CLIENT,
}
