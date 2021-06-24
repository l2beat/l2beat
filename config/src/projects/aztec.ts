import { Features, featuresByComparison, risk, Technologies } from '../features'
import { Project } from './Project'

export const aztec: Project = {
  name: 'Aztec',
  bridges: [
    {
      address: '0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba',
      sinceBlock: 11967192,
      tokens: ['ETH', 'DAI'],
    },
  ],
  details: {
    website: 'https://zk.money',
    color: '#8953f3',
    technology: {
      name: 'zk-rollup',
      details: 'zk-SNARK/PLONK',
    },
    parameters: [
      {
        name: 'Primary use case',
        value: 'Private payments',
      },
      {
        name: 'Hypothetical level of decentralization',
        sentiment: 'good',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        value: '?',
      },
      {
        name: 'Can funds be stolen by the operator?',
        value: '?',
      },
      {
        name: 'Permissionless?',
        value: '?',
      },
      {
        name: 'Force TX mechanism?',
        value: '?',
      },
      {
        name: 'Privacy',
        value: 'Yes',
      },
      {
        name: 'Smart contracts',
        tooltip: 'Possible in the future (Noir - custom language) ',
        value: 'No',
      },
    ],
    features: featuresByComparison(Technologies.ZkRollup, [
      Features.Generality.Specific({
        pointers: [
          'https://medium.com/aztec-protocol/aztec-zkrollup-layer-2-privacy-1978e90ee3b6',
        ],
      }),
      Features.Withdrawal.WithBlock({
        description:
          'In order for the user to withdraw without the operator they need to submit and prove a block themselves.',
        pointers: [
          'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L396',
        ],
      }),
      Features.State.ValidityProofs({
        pointers: [
          'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L395',
        ],
      }),
      Features.Settlement.AfterProof({
        pointers: [
          'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L396',
        ],
      }),
      Features.Cryptography.SNARKS({
        pointers: [
          'https://etherscan.io/address/0xbc87b0ccdd7e5a064051ae9aeece2ca6617d8675#code',
        ],
      }),
      Features.Data.OnChain({
        pointers: [
          'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L359',
        ],
      }),
      Features.SourceCode.Public({
        pointers: ['https://github.com/AztecProtocol/aztec-2-bug-bounty'],
      }),
      Features.Upgradeability.Upgradeable({
        description:
          'This is an unaudited mainnet beta deployment. Even though the contracts are not upgradable by proxy the owners can change the address of the verifier contract, potentially stealing funds through accepting invalid proofs.',
        pointers: [
          'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code',
          'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L101',
        ],
        risks: [
          risk(
            'Funds can be stolen',
            'The code is unaudited and can contain serious vulnerabilities.'
          ),
        ],
      }),
      Features.Ownership.Multisig({
        pointers: [
          'https://etherscan.io/address/0xe298a76986336686cc3566469e3520d23d1a8aad',
        ],
        risks: [
          risk('Funds can be frozen', 'The owners can pause the rollup.'),
        ],
      }),
      Features.Privacy.Full({
        pointers: [
          'https://medium.com/aztec-protocol/aztec-zkrollup-layer-2-privacy-1978e90ee3b6',
        ],
      }),
      Features.Sequencer.Centralized({
        pointers: [
          'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L97',
        ],
      }),
      Features.ForceTxs.Any({
        description:
          'The escape hatch is open periodically for anyone to submit a proof.',
        pointers: [
          'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L347',
        ],
      }),
    ]),
    news: [
      {
        name: 'Introducing zkDAI into the Aztec Private Rollup',
        link: 'https://medium.com/aztec-protocol/introducing-zkdai-into-the-aztec-private-rollup-203bd1b5164c',
      },
      {
        name: 'Launching Aztec 2.0 Rollup',
        link: 'https://medium.com/aztec-protocol/launching-aztec-2-0-rollup-ac7db8012f4b',
      },
    ],
  },
}
