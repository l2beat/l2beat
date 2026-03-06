import type {
  Project,
  ProjectContract,
  ProjectEscrow,
  TvsToken,
} from '@l2beat/config'
import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { getContractsSection } from './getContractsSection'
import type { ContractUtils } from './getContractUtils'

describe(getContractsSection.name, () => {
  it('adds escrow details to an existing contract instead of duplicating it', () => {
    const address = EthereumAddress.from('0x1')
    const result = getContractsSection(
      {
        id: ProjectId('test-project'),
        slug: 'test-project',
        isVerified: true,
        tvsConfig: [
          {
            symbol: 'USDC',
            displaySymbol: 'USDC.e',
            iconUrl: '/icons/usdc.png',
          } as TvsToken,
          {
            symbol: 'ETH',
            iconUrl: '/icons/eth.png',
          } as TvsToken,
        ],
        contracts: {
          addresses: {
            ethereum: [makeContract({ name: 'Bridge', address })],
          },
          risks: [],
          escrows: [
            makeEscrow({
              address,
              tokens: ['USDC.e', 'ETH'],
              contractName: 'Bridge',
            }),
          ],
        },
      },
      contractUtils,
      emptyProjectsChangeReport,
      [] as Project<'zkCatalogInfo'>[],
      [] as Project<'contracts'>[],
      emptyTvs,
    )

    expect(result).not.toEqual(undefined)
    expect(result?.escrows).toEqual([])
    expect(result?.contracts.Ethereum?.length).toEqual(1)
    expect(result?.contracts.Ethereum?.[0]?.name).toEqual('Bridge')
    expect(result?.contracts.Ethereum?.[0]?.escrow).toEqual({
      tokens: ['USDC.e', 'ETH'],
      tokenIcons: [
        { symbol: 'USDC.e', iconUrl: '/icons/usdc.png' },
        { symbol: 'ETH', iconUrl: '/icons/eth.png' },
      ],
    })
  })

  it('keeps escrow-only contracts visible in the contracts list', () => {
    const address = EthereumAddress.from('0x2')
    const result = getContractsSection(
      {
        id: ProjectId('test-project'),
        slug: 'test-project',
        isVerified: true,
        contracts: {
          addresses: {},
          risks: [],
          escrows: [
            makeEscrow({
              address,
              tokens: ['DAI'],
              contractName: 'Escrow vault',
            }),
          ],
        },
      },
      contractUtils,
      emptyProjectsChangeReport,
      [] as Project<'zkCatalogInfo'>[],
      [] as Project<'contracts'>[],
      emptyTvs,
    )

    expect(result).not.toEqual(undefined)
    expect(result?.escrows).toEqual([])
    expect(result?.contracts.Ethereum?.length).toEqual(1)
    expect(result?.contracts.Ethereum?.[0]?.name).toEqual('Escrow vault')
    expect(result?.contracts.Ethereum?.[0]?.escrow).toEqual({
      tokens: ['DAI'],
      tokenIcons: [
        {
          symbol: 'DAI',
          iconUrl: '/images/token-placeholder.png',
        },
      ],
    })
  })
})

const contractUtils: ContractUtils = {
  getChainName(chain) {
    return chain === 'ethereum' ? 'Ethereum' : chain
  },
  getUsedIn() {
    return []
  },
}

const emptyProjectsChangeReport: ProjectsChangeReport = {
  projects: {},
  getChanges: () => ({
    impactfulChange: false,
    becameVerifiedContracts: {},
  }),
  hasImplementationChanged: () => false,
  hasHighSeverityFieldChanged: () => false,
  hasUltimateUpgraderChanged: () => false,
  getBecameVerifiedContracts: () => ({}),
}

const emptyTvs: SevenDayTvsBreakdown = {
  total: 0,
  projects: {},
}

function makeContract({
  name,
  address,
  chain = 'ethereum',
}: {
  name: string
  address: EthereumAddress
  chain?: string
}): ProjectContract {
  return {
    name,
    address: ChainSpecificAddress.fromLong(chain, address),
    chain,
    isVerified: true,
    references: [],
  }
}

function makeEscrow({
  address,
  tokens,
  contractName,
  chain = 'ethereum',
}: {
  address: EthereumAddress
  tokens: string[] | '*'
  contractName: string
  chain?: string
}): ProjectEscrow {
  return {
    chain,
    address,
    contract: {
      chain,
      name: contractName,
      isVerified: true,
      references: [],
    },
    sinceTimestamp: UnixTime(0),
    tokens,
    useContractName: true,
  }
}
