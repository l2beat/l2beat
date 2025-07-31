import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('fraxferry')

const challengePeriod = formatSeconds(
  discovery.getContractValue(
    'FRAX Ferry Bridge (Fraxtal)',
    'MIN_WAIT_PERIOD_EXECUTE',
  ),
)

export const fraxferry: Bridge = {
  type: 'bridge',
  id: ProjectId('fraxferry'),
  addedAt: UnixTime(1712267205), // 2024-04-04T21:46:45Z
  display: {
    name: 'Frax Ferry',
    slug: 'fraxferry',
    links: {
      websites: ['https://frax.com/'],
      bridges: ['https://mainnet.frax.com/tools/bridge/'],
      repositories: ['https://github.com/FraxFinance/frax-solidity'],
      socialMedia: ['https://twitter.com/fraxfinance'],
    },
    description:
      'The Frax Ferry is a permissioned bridge that can be used to transfer tokens between chains.',
    category: 'Liquidity Network',
  },
  config: {
    associatedTokens: ['FRAX', 'FPIS'],
    escrows: [
      {
        address: EthereumAddress('0x85c5f05Ae4CB68190C695a22b292C3bA90696128'),
        sinceTimestamp: UnixTime(1668365795),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x4b8792aF00eaE944484bF572bc33029B2184a50C'),
        sinceTimestamp: UnixTime(1674284051),
        tokens: ['FRAX'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x5878d03AA50d2c00A921948Ea8Fa5F2d247f6BDB'),
        sinceTimestamp: UnixTime(1677016691),
        tokens: ['FPI'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xCd4aa7DB9D8a995a651498E94f6693A4D26e6C9E'),
        sinceTimestamp: UnixTime(1677016811),
        tokens: ['FPIS'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x505603e2440b44C1602b44D0Eb8385399b3F7bab'),
        sinceTimestamp: UnixTime(1673214587),
        tokens: ['frxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x8afd5082E0C24dEcEA39A9eFb14e4ACF4373D7D6'),
        sinceTimestamp: UnixTime(1673214839),
        tokens: ['sfrxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x2453b1FbD17ceA069A31C9D16A27f4F93a85Cc0d'),
        sinceTimestamp: UnixTime(1699757711),
        tokens: ['sFRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x6ac96F65156281a9383455D704b58A74ea9C9eC4'),
        sinceTimestamp: UnixTime(1667947727),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xA381d58e96eC3818c825E1fb264099448945CF8b'),
        sinceTimestamp: UnixTime(1668366083),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x9Ab224996D25bfDCB91d838F7f1902698Ac0a742'),
        sinceTimestamp: UnixTime(1674285035),
        tokens: ['FRAX'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xbb6b54F8969a4711527fdF6AB852B6D6cdF368d1'),
        sinceTimestamp: UnixTime(1683145403),
        tokens: ['FPI'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x18A5ca670dC42D0551f00E11A730074f6787f17F'),
        sinceTimestamp: UnixTime(1683145475),
        tokens: ['FPIS'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x94ddd112C9ea0fb534e376BE09A50d310F0612b4'),
        sinceTimestamp: UnixTime(1683145547),
        tokens: ['frxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xF380200B115Caa22D49e6C115b758d6130377620'),
        sinceTimestamp: UnixTime(1683145619),
        tokens: ['sfrxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x59ae66FB395893E3FD965aDb06A52d06C49dF8A9'),
        sinceTimestamp: UnixTime(1699758155),
        tokens: ['sFRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x3eF1d856EA62A2292B8690855042095a7aC48B4b'),
        sinceTimestamp: UnixTime(1672248143),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xDAe210BfB0cF8c81EDB4b459e2e0bA14D553e2D9'),
        sinceTimestamp: UnixTime(1668366227),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x9B62402Eb9A755677dEbdaE3639CB531c0Af0E5d'),
        sinceTimestamp: UnixTime(1674287039),
        tokens: ['FRAX'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xfbD33d2f3330f063C87b523Ba80D5F7f296E5393'),
        sinceTimestamp: UnixTime(1677016991),
        tokens: ['FPI'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xf18B122c3935Ff49f62C8f1f77Dc42A6F85A0bb5'),
        sinceTimestamp: UnixTime(1677017087),
        tokens: ['FPIS'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xce4DbAF3fa72C962Ee1F371694109fc2a80B03f5'),
        sinceTimestamp: UnixTime(1673215655),
        tokens: ['frxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x621D0e62f26314387f338A2509aFA3Ae3414661A'),
        sinceTimestamp: UnixTime(1673215763),
        tokens: ['sfrxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xe3e7F354ac948ceBa925181C81618D7c9b3da8C9'),
        sinceTimestamp: UnixTime(1699758071),
        tokens: ['sFRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x2d2261f970F605C813f160E8BAEd455E9004A842'),
        sinceTimestamp: UnixTime(1672248275),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xfB788F9E20ef426a32A67986654750172A6c1788'),
        sinceTimestamp: UnixTime(1668366371),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x1313d143BE1ac25aCACEFF39Bf31877bccDb9622'),
        sinceTimestamp: UnixTime(1674288047),
        tokens: ['FRAX'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xaF4305d05e9B08b1D17894ce1ACE8235528f7EdE'),
        sinceTimestamp: UnixTime(1674492707),
        tokens: ['frxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xB6b0290A39E2F896bBd8fC19cf17FE393e993dE4'),
        sinceTimestamp: UnixTime(1674492947),
        tokens: ['sfrxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE'),
        sinceTimestamp: UnixTime(1708806587),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6'),
        sinceTimestamp: UnixTime(1708806875),
        tokens: ['FRAX'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x9A576A3d39c589A861B46864C253288bcA428a6c'),
        sinceTimestamp: UnixTime(1708806935),
        tokens: ['FPI'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x958815f476cD07354c0BC034EE5077B20fD93003'),
        sinceTimestamp: UnixTime(1708806995),
        tokens: ['FPIS'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3'),
        sinceTimestamp: UnixTime(1708807403),
        tokens: ['sfrxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47'),
        sinceTimestamp: UnixTime(1708807475),
        tokens: ['sFRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xF1E1deA8F1053FD9C5F47f72F1f03977E17aF242'),
        sinceTimestamp: UnixTime(1668366491),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x2De1354c98880889643c4cA8B06FA2Fb8Fc1Fd7A'),
        sinceTimestamp: UnixTime(1674326627),
        tokens: ['FRAX'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x228567c10b7533C88057c10dDeA6349360F122c5'),
        sinceTimestamp: UnixTime(1673218163),
        tokens: ['frxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xbc3A2bF4FA20bE2056DCE5BFB168970BA657F187'),
        sinceTimestamp: UnixTime(1673218571),
        tokens: ['sfrxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x15ADa72A3B52A88E25DdD2CC2bA1120234e34bb0'),
        sinceTimestamp: UnixTime(1668385439),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xFe7ebA20c20C8FF12A337F940Ce7A97c6e2594DE'),
        sinceTimestamp: UnixTime(1676510819),
        tokens: ['FRAX'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x06Fa869caa1160754C6a0B744Da6454c5EA325d4'),
        sinceTimestamp: UnixTime(1668366683),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x6650D5183C4Cd294a81B1F724c365b0c42f8270a'),
        sinceTimestamp: UnixTime(1674326999),
        tokens: ['FRAX'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xC05DE1CB258bAdc152d8EAd3F573CA9A2E812B2a'),
        sinceTimestamp: UnixTime(1680744863),
        tokens: ['FPI'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x8Bf7Af56bB721BC3d015111508593Fcb301546F0'),
        sinceTimestamp: UnixTime(1680745019),
        tokens: ['FPIS'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x2F08F4645d2fA1fB12D2db8531c0c2EA0268BdE2'),
        sinceTimestamp: UnixTime(1673221427),
        tokens: ['frxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x04ba20D2Cc47C63bce1166C2864F0241e4D0a0CC'),
        sinceTimestamp: UnixTime(1673221535),
        tokens: ['sfrxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x9694dcF5b6CCF6216B05FE64945f62603e2d2367'),
        sinceTimestamp: UnixTime(1699758239),
        tokens: ['sFRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x43959A388603DCb6B02Ca084A55d4c7f3b442c57'),
        sinceTimestamp: UnixTime(1668366839),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xCa026e80F1E9e44da7ce3eD6aC2E9630260B9276'),
        sinceTimestamp: UnixTime(1674325883),
        tokens: ['FRAX'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x98f5E4b7D9eDF57A6ED41b334bD40B2eAa6B6e26'),
        sinceTimestamp: UnixTime(1673220695),
        tokens: ['frxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x91Ff54EffF7564BA3884A91d0E293502D8E6fF90'),
        sinceTimestamp: UnixTime(1673220803),
        tokens: ['sfrxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x86E71075e55F0aaD27D700017E0783458310c98a'),
        sinceTimestamp: UnixTime(1680647207),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xBa32Df0b78b1A68F7FA304BbD4Ed7a56A74c525a'),
        sinceTimestamp: UnixTime(1680647363),
        tokens: ['FRAX'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x45D2d8e4aB0F5af1D29305301A1b31D5d41b3349'),
        sinceTimestamp: UnixTime(1680647483),
        tokens: ['FPI'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xF887C4cFAAfB43d1AA7De204344895591016772c'),
        sinceTimestamp: UnixTime(1680647591),
        tokens: ['FPIS'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x3aaB5C43D4e47f71DEea94a7d541E6C07e21B137'),
        sinceTimestamp: UnixTime(1680647687),
        tokens: ['frxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xb8686Ef9B7ee9e73dE5d1721E4Da580278F8F4d2'),
        sinceTimestamp: UnixTime(1680647783),
        tokens: ['sfrxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x602cCfee6B4BA8Eb5e35Cf26e05fDEDE379e578E'),
        sinceTimestamp: UnixTime(1699758395),
        tokens: ['sFRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x32dDf80508cfD8feD8ABe375582FC7cfD20372C4'),
        sinceTimestamp: UnixTime(1682187443),
        tokens: ['FRAX.legacy'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x27E97F35D80514D5DD1Caa730e22a292E912a214'),
        sinceTimestamp: UnixTime(1682187515),
        tokens: ['FRAX'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x0F6136F9aBB7A0c21FbE076771625b39C544BDf5'),
        sinceTimestamp: UnixTime(1682188319),
        tokens: ['FPI'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xFBC512849D4dcEeeFAa1bfce08B3dC9daD755482'),
        sinceTimestamp: UnixTime(1682188391),
        tokens: ['FPIS'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x9f76b097Cd95627bFbD8052A583127FF6e7b3Fa9'),
        sinceTimestamp: UnixTime(1682188475),
        tokens: ['frxETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x29396AaE6198130A15F6Ff982C44BC4a7353Ef37'),
        sinceTimestamp: UnixTime(1682188679),
        tokens: ['sfrxETH'],
        chain: 'ethereum',
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Optimistically',
      description: `Transfers out of the bridge are considered valid if no challenge is submitted within the challenge period of ${challengePeriod}.`,
      sentiment: 'warning',
    },
  },
  technology: {
    canonical: true,
    destination: [
      'Arbitrum',
      'Optimism',
      'Fraxtal',
      'Boba',
      'Polygon zkEVM',
      'ZKsync',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'The Frax Ferry is a permissioned bridge that can be used to transfer tokens between chains. Users can transfer tokens to the bridge escrow on the origin chain, and the bridge administrator (the `Captain`) periodically posts hashes of transaction batches on the destination chains. After the challenge period is expired, the batch is considered valid, and another permissioned account (`First Officer`) executes the transfer of the tokens on the destination chain.',
      references: [
        {
          title: 'Fraxferry documentation',
          url: 'https://docs.frax.finance/cross-chain/bridge',
        },
        {
          title: 'Fraxferry.sol - Etherscan source code',
          url: 'https://etherscan.io/address/0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE#code#L851',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Both inbound and outbound transfers are verified optimistically',
      description: `Hashes of transaction batches on the origin chains are posted periodically on the destination chains by the Frax Maintenance Bot EOA (the Captain). After the batch hash is posted on the destination chain, a challenge period begins. If no challenge is submitted within the challenge period of ${challengePeriod}, the batch is considered valid. The authorised bridge First Officer can then execute the transfer of the tokens on the destination chain. No slashing mechanism is implemented. During a challenge period, a batch can be challenged by a permissioned set of watchdogs, the Crew Members, by sending a transaction on the destination chain. Should a batch be disputed, the bridge is paused until it is unpaused by the bridge owner.`,
      references: [
        {
          title: 'Fraxferry - Depart transactions batch function',
          url: 'https://etherscan.io/address/0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE#code#L851',
        },
        {
          title: 'Fraxferry - Dispute Batch function',
          url: 'https://etherscan.io/address/0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE#code#L882',
        },
        {
          title: 'Fraxferry - Disembark Batch function',
          url: 'https://etherscan.io/address/0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE#code#L858',
        },
      ],
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'a crew member pauses the contract and owner does not unpause it.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'the captain does not post the hash of the transaction batch, or first officer does not disembark to distribute the funds.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'incorrect hash is submitted and nobody challenges it.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'bridge owner removes funds from the bridge escrow.',
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens are not upgradable',
      description:
        'Tokens on the destination chain are not upgradable. The owner of the token contract sets permissioned Minter addresses that can mint new tokens up to a max cap amount.',
      references: [
        {
          title: 'Frax token - Arbiscan source code, minter_mint function',
          url: 'https://arbiscan.io/address/0x17fc002b466eec40dae837fc4be5c67993ddbd6f?a=0x5a9bef8cea603aac78a523fb245c1a9264d50706#code#L1636',
        },
      ],
      risks: [], // do we need a risk for arbitrary permissioned minting / dilution risk ?
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        // ARBITRUM
        discovery.getContractDetails('FRAX Ferry Bridge (Arbitrum)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (Arbitrum)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FXS Ferry Bridge (Arbitrum)', {
          description: 'FXS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FXS Ferry Bridge (Arbitrum)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPI Ferry Bridge (Arbitrum)', {
          description: 'FPI Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPI Ferry Bridge (Arbitrum)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPIS Ferry Bridge (Arbitrum)', {
          description: 'FPIS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPIS Ferry Bridge (Arbitrum)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('frxETH Ferry Bridge (Arbitrum)', {
          description: 'frxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'frxETH Ferry Bridge (Arbitrum)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sfrxETH Ferry Bridge (Arbitrum)', {
          description: 'sfrxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sfrxETH Ferry Bridge (Arbitrum)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sFRAX Ferry Bridge (Arbitrum)', {
          description: 'sFRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sFRAX Ferry Bridge (Arbitrum)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // AURORA
        discovery.getContractDetails('FRAX Ferry Bridge (Aurora)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (Aurora)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // AVALANCHE
        discovery.getContractDetails('FRAX Ferry Bridge (Avalanche)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (Avalanche)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FXS Ferry Bridge (Avalanche)', {
          description: 'FXS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FXS Ferry Bridge (Avalanche)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPI Ferry Bridge (Avalanche)', {
          description: 'FPI Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPI Ferry Bridge (Avalanche)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPIS Ferry Bridge (Avalanche)', {
          description: 'FPIS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPIS Ferry Bridge (Avalanche)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('frxETH Ferry Bridge (Avalanche)', {
          description: 'frxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'frxETH Ferry Bridge (Avalanche)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sfrxETH Ferry Bridge (Avalanche)', {
          description: 'sfrxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sfrxETH Ferry Bridge (Avalanche)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sFRAX Ferry Bridge (Avalanche)', {
          description: 'sFRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sFRAX Ferry Bridge (Avalanche)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // BOBA
        discovery.getContractDetails('FRAX Ferry Bridge (Boba)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (Boba)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // BSC
        discovery.getContractDetails('FRAX Ferry Bridge (bsc)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (bsc)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FXS Ferry Bridge (bsc)', {
          description: 'FXS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FXS Ferry Bridge (bsc)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPI Ferry Bridge (bsc)', {
          description: 'FPI Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPI Ferry Bridge (bsc)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPIS Ferry Bridge (bsc)', {
          description: 'FPIS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPIS Ferry Bridge (bsc)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('frxETH Ferry Bridge (bsc)', {
          description: 'frxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'frxETH Ferry Bridge (bsc)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sfrxETH Ferry Bridge (bsc)', {
          description: 'sfrxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sfrxETH Ferry Bridge (bsc)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sFRAX Ferry Bridge (bsc)', {
          description: 'sFRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sFRAX Ferry Bridge (bsc)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // EVMOS
        discovery.getContractDetails('FRAX Ferry Bridge (evmos)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (evmos)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // FANTOM
        discovery.getContractDetails('FRAX Ferry Bridge (Fantom)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (Fantom)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FXS Ferry Bridge (Fantom)', {
          description: 'FXS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FXS Ferry Bridge (Fantom)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('frxETH Ferry Bridge (Fantom)', {
          description: 'frxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'frxETH Ferry Bridge (Fantom)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sfrxETH Ferry Bridge (Fantom)', {
          description: 'sfrxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sfrxETH Ferry Bridge (Fantom)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // FRAXTAL
        discovery.getContractDetails('FRAX Ferry Bridge (Fraxtal)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (Fraxtal)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FXS Ferry Bridge (Fraxtal)', {
          description: 'FXS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FXS Ferry Bridge (Fraxtal)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPI Ferry Bridge (Fraxtal)', {
          description: 'FPI Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPI Ferry Bridge (Fraxtal)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPIS Ferry Bridge (Fraxtal)', {
          description: 'FPIS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPIS Ferry Bridge (Fraxtal)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sfrxETH Ferry Bridge (Fraxtal)', {
          description: 'sfrxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sfrxETH Ferry Bridge (Fraxtal)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sFRAX Ferry Bridge (Fraxtal)', {
          description: 'sFRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sFRAX Ferry Bridge (Fraxtal)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // MOONBEAM
        discovery.getContractDetails('FRAX Ferry Bridge (Moonbeam)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (Moonbeam)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FXS Ferry Bridge (Moonbeam)', {
          description: 'FXS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FXS Ferry Bridge (Moonbeam)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('frxETH Ferry Bridge (Moonbeam)', {
          description: 'frxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'frxETH Ferry Bridge (Moonbeam)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sfrxETH Ferry Bridge (Moonbeam)', {
          description: 'sfrxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sfrxETH Ferry Bridge (Moonbeam)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // MOONRIVER
        discovery.getContractDetails('FRAX Ferry Bridge (Moonriver)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (Moonriver)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FXS Ferry Bridge (Moonriver)', {
          description: 'FXS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FXS Ferry Bridge (Moonriver)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // OPTIMISM
        discovery.getContractDetails('FRAX Ferry Bridge (Optimism)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (Optimism)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FXS Ferry Bridge (Optimism)', {
          description: 'FXS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FXS Ferry Bridge (Optimism)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPI Ferry Bridge (Optimism)', {
          description: 'FPI Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPI Ferry Bridge (Optimism)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPIS Ferry Bridge (Optimism)', {
          description: 'FPIS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPIS Ferry Bridge (Optimism)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('frxETH Ferry Bridge (Optimism)', {
          description: 'frxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'frxETH Ferry Bridge (Optimism)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sfrxETH Ferry Bridge (Optimism)', {
          description: 'sfrxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sfrxETH Ferry Bridge (Optimism)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sFRAX Ferry Bridge (Optimism)', {
          description: 'sFRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sFRAX Ferry Bridge (Optimism)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // POLYGON PoS
        discovery.getContractDetails('FRAX Ferry Bridge (Polygon PoS)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (Polygon PoS)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FXS Ferry Bridge (Polygon PoS)', {
          description: 'FXS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FXS Ferry Bridge (Polygon PoS)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('frxETH Ferry Bridge (Polygon PoS)', {
          description: 'frxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'frxETH Ferry Bridge (Polygon PoS)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sfrxETH Ferry Bridge (Polygon PoS)', {
          description: 'sfrxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sfrxETH Ferry Bridge (Polygon PoS)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // POLYGON zkEVM
        discovery.getContractDetails('FRAX Ferry Bridge (Polygon zkEVM)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (Polygon zkEVM)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FXS Ferry Bridge (polygonzkEVM)', {
          description: 'FXS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FXS Ferry Bridge (polygonzkEVM)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPI Ferry Bridge (Polygon zkEVM)', {
          description: 'FPI Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPI Ferry Bridge (Polygon zkEVM)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPIS Ferry Bridge (Polygon zkEVM)', {
          description: 'FPIS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPIS Ferry Bridge (Polygon zkEVM)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('frxETH Ferry Bridge (Polygon zkEVM)', {
          description: 'frxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'frxETH Ferry Bridge (Polygon zkEVM)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sfrxETH Ferry Bridge (Polygon zkEVM)', {
          description: 'sfrxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sfrxETH Ferry Bridge (Polygon zkEVM)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sFRAX Ferry Bridge (Polygon zkEVM)', {
          description: 'sFRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sFRAX Ferry Bridge (Polygon zkEVM)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        // ZKSYNC
        discovery.getContractDetails('FRAX Ferry Bridge (ZKsync)', {
          description: 'FRAX Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FRAX Ferry Bridge (ZKsync)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FXS Ferry Bridge (ZKsync)', {
          description: 'FXS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FXS Ferry Bridge (ZKsync)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPI Ferry Bridge (ZKsync)', {
          description: 'FPI Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPI Ferry Bridge (ZKsync)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('FPIS Ferry Bridge (ZKsync)', {
          description: 'FPIS Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'FPIS Ferry Bridge (ZKsync)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('frxETH Ferry Bridge (ZKsync)', {
          description: 'frxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'frxETH Ferry Bridge (ZKsync)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
        discovery.getContractDetails('sfrxETH Ferry Bridge (ZKsync)', {
          description: 'sfrxETH Bridge Contract (Escrow).',
          pausable: {
            paused: discovery.getContractValue<boolean>(
              'sfrxETH Ferry Bridge (ZKsync)',
              'paused',
            ),
            pausableBy: ['Captain', 'First Officer', 'Bridge Owner'],
          },
        }),
      ],
    },
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Bridge Owner',
          discovery.getPermissionedAccounts(
            'FRAX Ferry Bridge (Fraxtal)',
            'owner',
          ),
          'Address authorized to pause and unpause the bridge, remove posted batches, set the challenge period, and change the bridge `Captain`, `First Officer` and `Crew Members`. It is also allowed to set fees and transfer tokens from the bridge escrow. Note that there are over 60 frax ferry bridges smart contracts, each with its own owner. Please check the owner() method of the specific escrow smart contract you are interested in.',
        ),
        discovery.getPermissionDetails(
          'FPI Bridge Owner',
          discovery.getPermissionedAccounts(
            'FPI Ferry Bridge (Fraxtal)',
            'owner',
          ),
          'Has the same permissions as the above Bridge Owner, but only for the FPI and FPIS bridge contracts.',
        ),
        discovery.getPermissionDetails(
          'Captain',
          discovery.getPermissionedAccounts(
            'FRAX Ferry Bridge (Fraxtal)',
            'captain',
          ),
          'Address authorized to post batch transaction data from the origin chain. Note that there are over 60 frax ferry bridges smart contracts, each with its own `Captain`. Please check the captain() method of the specific escrow smart contract you are interested in.',
        ),
        discovery.getPermissionDetails(
          'First Officer',
          discovery.getPermissionedAccounts(
            'FRAX Ferry Bridge (Fraxtal)',
            'firstOfficer',
          ),
          'Address authorized to distribute funds on the destination chain once the challenge period has passed. Note that there are over 60 frax ferry bridges smart contracts, each with its own `firstOfficer`. Please check the firstOfficer() method of the specific escrow smart contract you are interested in.',
        ),
        discovery.getPermissionDetails(
          'Crew Members',
          discovery.getPermissionedAccounts(
            'FRAX Ferry Bridge (Fraxtal)',
            'crewmembers',
          ),
          'Addresses authorized to dispute batch transaction data on the destination chain. Note that there are over 60 frax ferry bridges smart contracts, each with its own `crew members`. Please check the crewmember() method of the specific escrow smart contract you are interested in.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
