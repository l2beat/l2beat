import { ZkStackConfig } from '../plugins/zkstack/zkstack.config'
import { SUPPORTED_CHAINS } from '../plugins/zkstack/zkstack.networks'

const CONFIG_PLUGIN_ADDITIONAL_CHAINS: Record<string, string[]> = {
  [ZkStackConfig.key]: [
    'ethereum',
    ...SUPPORTED_CHAINS.map((network) => network.chain),
  ],
}

export function getAdditionalChainsForConfigs(keys: string[]): string[] {
  return keys.flatMap((key) => CONFIG_PLUGIN_ADDITIONAL_CHAINS[key] ?? [])
}
