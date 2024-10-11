import { randomUUID } from 'crypto'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { Analysis, AnalyzedContract } from '../analysis/AddressAnalyzer'
import { resolveAnalysis } from './resolveAnalysis'

const BASE_CONTRACT: AnalyzedContract = {
  type: 'Contract',
  address: EthereumAddress.random(),
  name: randomUUID(),
  derivedName: undefined,
  isVerified: false,
  implementations: [],
  values: {},
  fieldsMeta: {},
  errors: {},
  abis: {},
  sourceBundles: [],
  relatives: {},
}

describe(resolveAnalysis.name, () => {
  it('vault controlled by 2/7 multisig', () => {
    const vaultAddress = EthereumAddress.random()
    const msigAddress = EthereumAddress.random()
    const members = Array.from({ length: 7 }, () => EthereumAddress.random())

    const input: Analysis[] = [
      {
        ...BASE_CONTRACT,
        address: vaultAddress,
      },
      {
        ...BASE_CONTRACT,
        address: msigAddress,
        values: {
          $threshold: 2,
          $members: members,
        },
        combinedMeta: {
          permissions: [
            {
              type: 'configure',
              delay: 0,
              target: vaultAddress,
            },
          ],
        },
      },
      ...members.map(
        (m) =>
          ({
            type: 'EOA',
            address: m,
          }) as Analysis,
      ),
    ]

    expect(resolveAnalysis(input)).toEqual([
      {
        permission: 'configure',
        path: [
          {
            address: vaultAddress,
            delay: 0,
            description: undefined,
          },
          {
            address: msigAddress,
            delay: 0,
            description: undefined,
          },
        ],
      },
    ])
  })

  it('vault controlled by 2/2 multisig', () => {
    const vaultAddress = EthereumAddress.random()
    const msigAddress = EthereumAddress.random()
    const members = Array.from({ length: 2 }, () => EthereumAddress.random())

    const input: Analysis[] = [
      {
        ...BASE_CONTRACT,
        address: vaultAddress,
      },
      {
        ...BASE_CONTRACT,
        address: msigAddress,
        values: {
          $threshold: 2,
          $members: members,
        },
        combinedMeta: {
          permissions: [
            {
              type: 'configure',
              delay: 0,
              target: vaultAddress,
            },
          ],
        },
      },
      ...members.map(
        (m) =>
          ({
            type: 'EOA',
            address: m,
          }) as Analysis,
      ),
    ]

    expect(resolveAnalysis(input)).toEqual([
      {
        permission: 'configure',
        path: [
          {
            address: vaultAddress,
            delay: 0,
            description: undefined,
          },
          {
            address: msigAddress,
            delay: 0,
            description: undefined,
          },
        ],
      },
    ])
  })

  it('vault controlled by 1/7 multisig', () => {
    const vaultAddress = EthereumAddress.random()
    const msigAddress = EthereumAddress.random()
    const members = Array.from({ length: 7 }, () => EthereumAddress.random())

    const input: Analysis[] = [
      {
        ...BASE_CONTRACT,
        address: vaultAddress,
      },
      {
        ...BASE_CONTRACT,
        address: msigAddress,
        values: {
          $threshold: 1,
          $members: members,
        },
        combinedMeta: {
          permissions: [
            {
              type: 'configure',
              delay: 0,
              target: vaultAddress,
            },
          ],
        },
      },
      ...members.map(
        (m) =>
          ({
            type: 'EOA',
            address: m,
          }) as Analysis,
      ),
    ]

    expect(resolveAnalysis(input)).toEqual(
      members.map((m) => ({
        permission: 'configure',
        path: [
          {
            address: vaultAddress,
            delay: 0,
            description: undefined,
          },
          {
            address: msigAddress,
            delay: 0,
            description: undefined,
          },
          {
            address: m,
            delay: 0,
            description: undefined,
          },
        ],
      })),
    )
  })

  it('vault controlled by 1/2 multisig', () => {
    const vaultAddress = EthereumAddress.random()
    const msigAddress = EthereumAddress.random()
    const members = Array.from({ length: 2 }, () => EthereumAddress.random())

    const input: Analysis[] = [
      {
        ...BASE_CONTRACT,
        address: vaultAddress,
      },
      {
        ...BASE_CONTRACT,
        address: msigAddress,
        values: {
          $threshold: 1,
          $members: members,
        },
        combinedMeta: {
          permissions: [
            {
              type: 'configure',
              delay: 0,
              target: vaultAddress,
            },
          ],
        },
      },
      ...members.map(
        (m) =>
          ({
            type: 'EOA',
            address: m,
          }) as Analysis,
      ),
    ]

    expect(resolveAnalysis(input)).toEqual(
      members.map((m) => ({
        permission: 'configure',
        path: [
          {
            address: vaultAddress,
            delay: 0,
            description: undefined,
          },
          {
            address: msigAddress,
            delay: 0,
            description: undefined,
          },
          {
            address: m,
            delay: 0,
            description: undefined,
          },
        ],
      })),
    )
  })

  it('vault controlled by 1/1 multisig', () => {
    const vaultAddress = EthereumAddress.random()
    const msigAddress = EthereumAddress.random()
    const members = Array.from({ length: 1 }, () => EthereumAddress.random())

    const input: Analysis[] = [
      {
        ...BASE_CONTRACT,
        address: vaultAddress,
      },
      {
        ...BASE_CONTRACT,
        address: msigAddress,
        values: {
          $threshold: 1,
          $members: members,
        },
        combinedMeta: {
          permissions: [
            {
              type: 'configure',
              delay: 0,
              target: vaultAddress,
            },
          ],
        },
      },
      ...members.map(
        (m) =>
          ({
            type: 'EOA',
            address: m,
          }) as Analysis,
      ),
    ]

    expect(resolveAnalysis(input)).toEqual(
      members.map((m) => ({
        permission: 'configure',
        path: [
          {
            address: vaultAddress,
            delay: 0,
            description: undefined,
          },
          {
            address: msigAddress,
            delay: 0,
            description: undefined,
          },
          {
            address: m,
            delay: 0,
            description: undefined,
          },
        ],
      })),
    )
  })

  it('single analyzed contract with meta', () => {
    const contractAddress = EthereumAddress.random()
    const targetAddress = EthereumAddress.random()
    const input: Analysis[] = [
      {
        ...BASE_CONTRACT,
        address: contractAddress,
        combinedMeta: {
          permissions: [
            {
              type: 'configure',
              delay: 10,
              target: targetAddress,
            },
          ],
        },
      },
    ]

    expect(resolveAnalysis(input)).toEqual([
      {
        permission: 'configure',
        path: [
          {
            address: targetAddress,
            delay: 10,
            description: undefined,
          },
          {
            address: contractAddress,
            delay: 0,
            description: undefined,
          },
        ],
      },
    ])
  })

  it('single analyzed contract without meta', () => {
    const input: Analysis[] = [
      {
        ...BASE_CONTRACT,
        address: EthereumAddress.random(),
      },
    ]

    expect(resolveAnalysis(input)).toBeEmpty()
  })

  it('single analyzed EOA with meta', () => {
    const eoaAddress = EthereumAddress.random()
    const targetAddress = EthereumAddress.random()
    const input: Analysis[] = [
      {
        type: 'EOA',
        address: eoaAddress,
        combinedMeta: {
          permissions: [
            {
              type: 'configure',
              delay: 10,
              target: targetAddress,
            },
          ],
        },
      },
    ]

    expect(resolveAnalysis(input)).toEqual([
      {
        permission: 'configure',
        path: [
          {
            address: targetAddress,
            delay: 10,
            description: undefined,
          },
          {
            address: eoaAddress,
            delay: 0,
            description: undefined,
          },
        ],
      },
    ])
  })

  it('single analyzed EOA without meta', () => {
    const input: Analysis[] = [
      {
        type: 'EOA',
        address: EthereumAddress.random(),
      },
    ]

    expect(resolveAnalysis(input)).toBeEmpty()
  })

  it('empty returns empty', () => {
    const input: Analysis[] = []
    expect(resolveAnalysis(input)).toBeEmpty()
  })
})
