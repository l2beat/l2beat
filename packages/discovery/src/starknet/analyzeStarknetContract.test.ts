import { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { readFileSync } from 'fs'
import path from 'path'
import type { TemplateService } from '../discovery/analysis/TemplateService'
import { StructureContract } from '../discovery/config/StructureConfig'
import { makeEntryStructureConfig } from '../discovery/config/structureUtils'
import { analyzeStarknetContract } from './analyzeStarknetContract'
import type {
  StarknetDiscoveryProvider,
  VoyagerContractInfo,
} from './StarknetDiscoveryProvider'
import { starknetKeccak, starknetSelector } from './starknetKeccak'

const POOL_ABI = readFileSync(
  path.join(__dirname, 'fixtures', 'strk20PoolAbi.json'),
  'utf8',
)
const POOL_ADDRESS = ChainSpecificAddress(
  'strk:0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
)
const CLASS_HASH =
  '0x67dddd89d80fedadc06b6f160798f94800a4a70164e5a24301cd0d6076b554d'
const FEE_COLLECTOR =
  '0xd79041634625e5288296fbc648088788710ba44903a3a49468a66567749e77'
const GOVERNOR =
  '0x663cc699d9c51b7d4d434e06f5982692167546ce525d9155edb476ac9a117d6'
const GOVERNANCE_ADMIN_ROLE =
  '0x3711c9d994faf6055172091cb841fd4831aa743e6f3315163b06a122c841846'

const ACCOUNT_ABI = JSON.stringify([
  {
    type: 'interface',
    name: 'wallet::IAccount',
    items: ['__execute__', '__validate__', 'is_valid_signature'].map(
      (name) => ({
        type: 'function',
        name,
        inputs: [],
        outputs: [],
        state_mutability: 'external',
      }),
    ),
  },
])

// OpenZeppelin Cairo 0 account: legacy ABI format with camelCase
// stateMutability and 'felt' types, as used by old StarkWare governor keys
const CAIRO0_ACCOUNT_ABI = JSON.stringify([
  ...['__execute__', '__validate__', 'is_valid_signature'].map((name) => ({
    type: 'function',
    name,
    inputs: [],
    outputs: [],
  })),
  {
    type: 'function',
    name: 'get_public_key',
    inputs: [],
    outputs: [{ name: 'res', type: 'felt' }],
    stateMutability: 'view',
  },
])

function emptyConfig() {
  return makeEntryStructureConfig(
    { overrides: {}, types: undefined, discoverLibraries: undefined },
    POOL_ADDRESS,
  )
}

function poolProvider(
  overrides: Partial<StarknetDiscoveryProvider> = {},
  voyagerInfo?: VoyagerContractInfo,
) {
  return mockObject<StarknetDiscoveryProvider>({
    blockNumber: 1000,
    getClassHashAt: async () => CLASS_HASH,
    getClass: async () => ({ abi: POOL_ABI }),
    call: async (_address, selector) => {
      if (selector === starknetSelector('get_fee_collector')) {
        return { success: true, result: [FEE_COLLECTOR] }
      }
      if (selector === starknetSelector('get_upgrade_delay')) {
        return { success: true, result: ['0x0'] }
      }
      return { success: false, error: '40: reverted' }
    },
    getEvents: async () => [
      {
        block_number: 10,
        transaction_hash: '0x1',
        event_index: 0,
        keys: [starknetKeccak('RoleGranted')],
        data: [GOVERNANCE_ADMIN_ROLE, GOVERNOR, GOVERNOR],
      },
    ],
    getVoyagerContractInfo: async () => voyagerInfo,
    getVoyagerSource: async () => undefined,
    ...overrides,
  })
}

function noTemplates() {
  return mockObject<TemplateService>({
    findMatchingTemplatesByHash: () => [],
  })
}

describe(analyzeStarknetContract.name, () => {
  const logger = Logger.SILENT

  it('classifies undeployed addresses as EOA', async () => {
    const provider = poolProvider({ getClassHashAt: async () => undefined })
    const { analysis } = await analyzeStarknetContract(
      provider,
      POOL_ADDRESS,
      emptyConfig(),
      noTemplates(),
      logger,
    )
    expect(analysis.type).toEqual('EOA')
    expect((analysis as { values: object }).values).toEqual({})
  })

  it('classifies SNIP-6 accounts as EOA with their class hash', async () => {
    const provider = poolProvider({
      getClass: async () => ({ abi: ACCOUNT_ABI }),
    })
    const { analysis } = await analyzeStarknetContract(
      provider,
      POOL_ADDRESS,
      emptyConfig(),
      noTemplates(),
      logger,
    )
    expect(analysis.type).toEqual('EOA')
    expect((analysis as { values: object }).values).toEqual({
      $accountClassHash: CLASS_HASH,
    })
  })

  it('reads keys of Cairo 0 single-key accounts', async () => {
    const provider = poolProvider({
      getClass: async () => ({ abi: CAIRO0_ACCOUNT_ABI }),
      call: async (_address, selector) => {
        if (selector === starknetSelector('get_public_key')) {
          return { success: true, result: [GOVERNOR] }
        }
        return { success: false, error: '40: reverted' }
      },
    })
    const { analysis } = await analyzeStarknetContract(
      provider,
      POOL_ADDRESS,
      emptyConfig(),
      noTemplates(),
      logger,
    )
    expect(analysis.type).toEqual('EOA')
    expect((analysis as { values: Record<string, unknown> }).values).toEqual({
      $accountClassHash: CLASS_HASH,
      $publicKey: GOVERNOR,
    })
  })

  it('analyzes a contract: values, roles, proxy type, relatives', async () => {
    const provider = poolProvider(
      {},
      {
        deploymentBlockNumber: 100,
        deploymentTimestamp: 1700000000,
        contractAlias: 'Starknet: Canonical Privacy Pool',
      },
    )
    const { analysis, flatSource } = await analyzeStarknetContract(
      provider,
      POOL_ADDRESS,
      emptyConfig(),
      noTemplates(),
      logger,
    )

    expect(analysis.type).toEqual('Contract')
    if (analysis.type !== 'Contract') return

    // Explorer alias sanitized into a portable identifier
    expect(analysis.name).toEqual('StarknetCanonicalPrivacyPool')
    // IReplaceable functions present in the pool ABI
    expect(analysis.proxyType).toEqual('StarkWare Replaceable')
    expect(analysis.values.$classHash).toEqual(CLASS_HASH)
    // ContractAddress outputs decode to strk: addresses
    expect(analysis.values.get_fee_collector).toEqual(
      `strk:0x00${FEE_COLLECTOR.slice(2)}`,
    )
    // Failed view calls are skipped, never recorded as errors (CI invariant)
    expect(analysis.errors).toEqual({})
    // Roles replayed from events
    expect(analysis.values.$roles).toEqual({
      GOVERNANCE_ADMIN: [`strk:0x0${GOVERNOR.slice(2)}`],
    })
    // Fee collector and role holder become relatives
    expect(Object.keys(analysis.relatives).sort()).toEqual([
      `strk:0x00${FEE_COLLECTOR.slice(2)}`,
      `strk:0x0${GOVERNOR.slice(2)}`,
    ])
    // Unverified class falls back to a generated interface
    expect(analysis.isVerified).toEqual(false)
    expect(flatSource?.includes('fn get_fee_collector()')).toEqual(true)
    // Code panel gating
    expect(analysis.implementationNames).toEqual({
      [POOL_ADDRESS.toString()]: 'StarknetCanonicalPrivacyPool',
    })
  })

  it('executes call handler fields and honors copy/edit', async () => {
    const config = makeEntryStructureConfig(
      {
        overrides: {
          [POOL_ADDRESS.toString()]: StructureContract.parse({
            fields: {
              collectorChannels: {
                handler: {
                  type: 'call',
                  method: 'get_num_of_channels',
                  args: [`strk:0x00${FEE_COLLECTOR.slice(2)}`],
                },
              },
              governanceAdmins: {
                copy: '$roles',
                edit: ['get', 'GOVERNANCE_ADMIN'],
              },
            },
          }),
        },
        types: undefined,
        discoverLibraries: undefined,
      },
      POOL_ADDRESS,
    )
    const provider = poolProvider({
      call: async (_address, selector, calldata) => {
        if (
          selector === starknetSelector('get_num_of_channels') &&
          calldata?.[0] === `0x00${FEE_COLLECTOR.slice(2)}`
        ) {
          return { success: true, result: ['0x2'] }
        }
        return { success: false, error: '40: reverted' }
      },
    })
    const { analysis } = await analyzeStarknetContract(
      provider,
      POOL_ADDRESS,
      config,
      noTemplates(),
      logger,
    )
    if (analysis.type !== 'Contract') throw new Error('expected Contract')
    expect(analysis.values.collectorChannels).toEqual(2)
    expect(analysis.values.governanceAdmins).toEqual([
      `strk:0x0${GOVERNOR.slice(2)}`,
    ])
  })

  it('applies templates matched by source hash', async () => {
    const templateService = mockObject<TemplateService>({
      findMatchingTemplatesByHash: () => ['starknet/Demo'],
      loadContractTemplate: () => StructureContract.parse({}),
      getTemplateHash: () =>
        '0x0000000000000000000000000000000000000000000000000000000000000001' as ReturnType<
          TemplateService['getTemplateHash']
        >,
    })
    const { analysis } = await analyzeStarknetContract(
      poolProvider(),
      POOL_ADDRESS,
      emptyConfig(),
      templateService,
      logger,
    )
    if (analysis.type !== 'Contract') throw new Error('expected Contract')
    expect(analysis.extendedTemplate?.template).toEqual('starknet/Demo')
    expect(analysis.extendedTemplate?.reason).toEqual('byShapeMatch')
  })
})
