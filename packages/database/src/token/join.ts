export const joinNetwork = [
  'network',
  'network.id',
  'token.network_id',
] as const

export const joinDeployment = [
  'deployment',
  'deployment.token_id',
  'token.id',
] as const

export const joinTokenMeta = [
  'token_meta',
  'token_meta.token_id',
  'token.id',
] as const
