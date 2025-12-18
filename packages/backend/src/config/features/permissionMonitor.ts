import type { Env } from '@l2beat/backend-tools'
import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import type { DiscordConfig, PermissionMonitorConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export function getPermissionMonitorConfig(
  env: Env,
  flags: FeatureFlags,
  isLocal: boolean | undefined,
): PermissionMonitorConfig | false {
  if (!flags.isEnabled('permissionMonitor')) {
    return false
  }

  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)

  return {
    configReader,
    configBasePath: paths.discovery,
    runOnStart: isLocal
      ? env.boolean('PERMISSION_MONITOR_RUN_ON_START', true)
      : undefined,
    discord: getDiscordConfig(env, isLocal),
  }
}

function getDiscordConfig(env: Env, isLocal?: boolean): DiscordConfig | false {
  const token = env.optionalString('DISCORD_TOKEN')
  const internalChannelId = env.optionalString('INTERNAL_DISCORD_CHANNEL_ID')
  const publicChannelId = env.optionalString('PUBLIC_DISCORD_CHANNEL_ID')

  const discordEnabled =
    !!token && !!internalChannelId && (isLocal || !!publicChannelId)

  return (
    discordEnabled && {
      token,
      publicChannelId,
      internalChannelId,
      callsPerMinute: 3000,
    }
  )
}
