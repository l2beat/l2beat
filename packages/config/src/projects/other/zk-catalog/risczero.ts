import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ZkCatalogProject } from './types'

export const risczero: ZkCatalogProject = {
  display: {
    slug: 'risczero',
    name: 'RISC Zero',
  },
  proofVerification: {
    aggregation: true,
    verifiers: [
      {
        name: 'RiscZeroVerifier (Ethereum)',
        description: 'Verifies the computation of a RISC-V program.',
        contractAddress: EthereumAddress(
          '0xf70aBAb028Eb6F4100A24B203E113D94E87DE93C',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS+QAP',
            mainPCS: 'N/A',
            trustedSetup: 'POT23 + circuit specific',
            link: 'https://github.com/risc0/risc0/tree/main/groth16_proof/groth16',
          },
          {
            name: 'Aggregation circuit',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/recursion',
          },
          {
            name: 'Main program',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/rv32im',
          },
        ],
      },
      {
        name: 'RiscZeroVerifier (Arbitrum One)',
        description: 'Verifies the computation of a RISC-V program.',
        contractAddress: EthereumAddress(
          '0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319',
        ),
        chainId: ChainId.ARBITRUM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS+QAP',
            mainPCS: 'N/A',
            trustedSetup: 'POT23 + circuit specific',
            link: 'https://github.com/risc0/risc0/tree/main/groth16_proof/groth16',
          },
          {
            name: 'Aggregation circuit',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/recursion',
          },
          {
            name: 'Main program',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/rv32im',
          },
        ],
      },
      {
        name: 'RiscZeroVerifier (Base)',
        description: 'Verifies the computation of a RISC-V program.',
        contractAddress: EthereumAddress(
          '0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319',
        ),
        chainId: ChainId.BASE,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS+QAP',
            mainPCS: 'N/A',
            trustedSetup: 'POT23 + circuit specific',
            link: 'https://github.com/risc0/risc0/tree/main/groth16_proof/groth16',
          },
          {
            name: 'Aggregation circuit',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/recursion',
          },
          {
            name: 'Main program',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/rv32im',
          },
        ],
      },
      {
        name: 'RiscZeroVerifier (Linea)',
        description: 'Verifies the computation of a RISC-V program.',
        contractAddress: EthereumAddress(
          '0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319',
        ),
        chainId: ChainId.LINEA,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS+QAP',
            mainPCS: 'N/A',
            trustedSetup: 'POT23 + circuit specific',
            link: 'https://github.com/risc0/risc0/tree/main/groth16_proof/groth16',
          },
          {
            name: 'Aggregation circuit',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/recursion',
          },
          {
            name: 'Main program',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/rv32im',
          },
        ],
      },
      {
        name: 'RiscZeroVerifier (OP Mainnet)',
        description: 'Verifies the computation of a RISC-V program.',
        contractAddress: EthereumAddress(
          '0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319',
        ),
        chainId: ChainId.OPTIMISM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS+QAP',
            mainPCS: 'N/A',
            trustedSetup: 'POT23 + circuit specific',
            link: 'https://github.com/risc0/risc0/tree/main/groth16_proof/groth16',
          },
          {
            name: 'Aggregation circuit',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/recursion',
          },
          {
            name: 'Main program',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/rv32im',
          },
        ],
      },
      {
        name: 'RiscZeroVerifier (Polygon zkEVM)',
        description: 'Verifies the computation of a RISC-V program.',
        contractAddress: EthereumAddress(
          '0x8EaB2D97Dfce405A1692a21b3ff3A172d593D319',
        ),
        chainId: ChainId.POLYGONZKEVM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'Final wrap',
            proofSystem: 'Groth16',
            mainArithmetization: 'R1CS+QAP',
            mainPCS: 'N/A',
            trustedSetup: 'POT23 + circuit specific',
            link: 'https://github.com/risc0/risc0/tree/main/groth16_proof/groth16',
          },
          {
            name: 'Aggregation circuit',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/recursion',
          },
          {
            name: 'Main program',
            proofSystem: 'STARK',
            mainArithmetization: 'RAP',
            mainPCS: 'FRI',
            trustedSetup: 'None',
            link: 'https://github.com/risc0/risc0/tree/main/risc0/circuit/rv32im',
          },
        ],
      },
    ],
    requiredTools: [
      {
        name: 'snarkjs',
        version: '?',
        link: 'https://github.com/iden3/snarkjs',
      },
      {
        name: 'circom',
        version: '?',
        link: 'https://github.com/iden3/circom',
      },
    ],
  },
  type: 'zk-catalog',
}
