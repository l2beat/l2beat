import type { EthereumAddress, Log } from '@l2beat/shared-pure'
import { unique } from '@l2beat/shared-pure'
import type { Configuration } from '../../../tools/uif/multi/types'

interface PrivacyLogConfigurationProperties {
  address: EthereumAddress
  event: string
}

export function buildPrivacyLogFilter<
  T extends PrivacyLogConfigurationProperties,
>(
  configurations: Configuration<T>[],
): {
  addresses: string[]
  events: string[]
} {
  return {
    addresses: unique(
      configurations.map((configuration) =>
        configuration.properties.address.toString(),
      ),
    ),
    events: unique(
      configurations.map((configuration) => configuration.properties.event),
    ),
  }
}

export function buildPrivacyLogConfigurationMap<
  T extends PrivacyLogConfigurationProperties,
>(configurations: Configuration<T>[]): Map<string, Configuration<T>[]> {
  const result = new Map<string, Configuration<T>[]>()

  for (const configuration of configurations) {
    const key = getPrivacyLogConfigurationKey(
      configuration.properties.address.toString(),
      configuration.properties.event,
    )
    result.set(key, [...(result.get(key) ?? []), configuration])
  }

  return result
}

export function getPrivacyLogConfigurationKey(
  address: string,
  event: string,
): string {
  return `${address.toLowerCase()}:${event.toLowerCase()}`
}

export function getPrivacyLogKey(log: Log): string {
  return getPrivacyLogConfigurationKey(log.address, log.topics[0] ?? '')
}
