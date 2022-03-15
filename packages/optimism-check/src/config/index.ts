import { config as bobaConfig } from './config.boba'
import { config as metisConfig } from './config.metis'
import { config as nahmiiConfig } from './config.nahmii'
import { config as optimismConfig } from './config.optimism'

export * from './Config'

export function getConfig(network: string) {
  switch (network) {
    case 'optimism':
      return optimismConfig
    case 'metis':
      return metisConfig
    case 'boba':
      return bobaConfig
    case 'nahmii':
      return nahmiiConfig
  }
  throw new Error(`Unsupported network: ${network}`)
}
