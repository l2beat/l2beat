import { createHash } from 'crypto'

export interface PrivacyAnonymitySetConfigurationIdentity {
  projectId: string
  bucketId: string
  chain: string
  address: string
  event: string
  extractor: string
  params: Record<string, unknown>
}

export function createPrivacyAnonymitySetConfigurationId(
  config: PrivacyAnonymitySetConfigurationIdentity,
): string {
  return createPrivacyConfigurationId([
    'privacy-anonymity-set',
    config.projectId,
    config.bucketId,
    config.chain,
    config.address,
    config.event,
    config.extractor,
    stringifyPrivacyConfigurationParams(config.params),
  ])
}

export function createPrivacyConfigurationId(input: string[]): string {
  return createHash('sha1').update(input.join('')).digest('hex').slice(0, 12)
}

export function stringifyPrivacyConfigurationParams(
  params: Record<string, unknown>,
): string {
  return Object.keys(params)
    .sort()
    .map((key) => `${key}=${String(params[key])}`)
    .join(',')
}
