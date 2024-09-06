import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { zkfair } from '../../../layer2s/zkfair'
import { DAC } from '../templates/dac-template'
import { DaAttestationSecurityRisk } from '../types'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('zkfair')

const upgradeability = {
  upgradableBy: ['ZKFairAdmin'],
  upgradeDelay: 'None',
}

const membersCountDAC = discovery.getContractValue<number>(
  'ZKFairValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'ZKFairValidiumDAC',
  'requiredAmountOfSignatures',
)

const members = discovery.getContractValue<string[]>(
  'ZKFairValidiumDAC',
  'members',
)

export const zkfairDac = DAC({
  project: zkfair,
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
  },
  bridge: {
    contracts: {
      addresses: [
        discovery.getContractDetails('ZKFairValidium', {
          description: `The main contract of ZKFair. Contains sequenced transaction batch hashes and signature verification logic for the signed data hash commitment.`,
        }),
        discovery.getContractDetails('ZKFairValidiumDAC', {
          description:
            'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
          ...upgradeability,
        }),
      ],
      risks: [],
    },
    permissions: [
      {
        name: 'Committee Members',
        description: `List of addresses authorized to sign data commitments for the DA bridge.`,
        accounts: members.map((operator) => ({
          address: EthereumAddress(operator[1]),
          type: 'EOA',
        })),
      },
      ...discovery.getMultisigPermission(
        'ZKFairAdmin',
        'Admin of the ZKFairValidiumDAC contract, can set core system parameters like timeouts, sequencer, activate forced transactions, update the DA mode and upgrade the ZKFairValidiumDAC contract',
      ),
    ],
    chain: ChainId.ETHEREUM,
    requiredMembers: requiredSignaturesDAC,
    totalMembers: membersCountDAC,
    transactionDataType: DacTransactionDataType.StateDiffs,
    members: {
      type: 'unknown',
    },
  },
})
