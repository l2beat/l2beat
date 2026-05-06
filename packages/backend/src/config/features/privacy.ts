import type { PrivacyFlowSource, ProjectService } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type {
  PrivacyConfig,
  PrivacyFlowIndexerConfig,
} from '../../modules/privacy/types'
import type { FeatureFlags } from '../FeatureFlags'

export async function getPrivacyConfig(
  ps: ProjectService,
  flags: FeatureFlags,
): Promise<PrivacyConfig | false> {
  const projectsWithPrivacy = await ps.getProjects({
    select: ['privacyInfo'],
  })

  const projects = projectsWithPrivacy
    .filter((project) => flags.isEnabled('privacy', project.id))
    .map((project) => ({
      projectId: project.id.toString(),
      privacyInfo: project.privacyInfo,
    }))

  if (projects.length === 0) {
    return false
  }

  const flowConfigs: PrivacyFlowIndexerConfig[] = []
  for (const project of projects) {
    for (const asset of project.privacyInfo.assets) {
      const assetKey = getAssetKey(asset.asset.address, asset.asset.symbol)
      for (const bucket of asset.buckets) {
        if (!bucket.flows) continue

        if (bucket.flows.deposit) {
          flowConfigs.push(
            toFlowConfig(
              project.projectId,
              assetKey,
              bucket.id,
              'deposit',
              bucket.flows.sinceBlock,
              bucket.flows.deposit,
            ),
          )
        }

        if (bucket.flows.withdrawal) {
          flowConfigs.push(
            toFlowConfig(
              project.projectId,
              assetKey,
              bucket.id,
              'withdrawal',
              bucket.flows.sinceBlock,
              bucket.flows.withdrawal,
            ),
          )
        }
      }
    }
  }

  const chains = Array.from(new Set(flowConfigs.map((config) => config.chain)))

  const minBlockByChain = new Map<string, number>()
  for (const config of flowConfigs) {
    const current = minBlockByChain.get(config.chain)
    minBlockByChain.set(
      config.chain,
      current === undefined
        ? config.sinceBlock
        : Math.min(current, config.sinceBlock),
    )
  }

  return {
    projects,
    flowConfigs,
    chains,
    minBlockByChain,
  }
}

export function createPrivacyConfigurationId(input: string[]): string {
  return createHash('sha1').update(input.join('')).digest('hex').slice(0, 12)
}

function toFlowConfig(
  projectId: string,
  assetKey: string,
  bucketId: string,
  direction: 'deposit' | 'withdrawal',
  sinceBlock: number,
  source: PrivacyFlowSource,
): PrivacyFlowIndexerConfig {
  return {
    projectId,
    assetKey,
    bucketId,
    direction,
    address: source.address
      ? ChainSpecificAddress.address(source.address)
      : undefined,
    sinceBlock,
    chain: source.chain,
    event: source.event,
    extractor: source.extractor,
    params: source.params,
  } as PrivacyFlowIndexerConfig
}

function getAssetKey(
  address: import('@l2beat/shared-pure').EthereumAddress | undefined,
  symbol: string,
): string {
  return (address ?? symbol).toString().toLowerCase()
}
