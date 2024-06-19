export const joinNetwork = ['Network', 'Network.id', 'Token.networkId'] as const

export const joinDeployment = [
  'Deployment',
  'Deployment.tokenId',
  'Token.id',
] as const

export const joinTokenMeta = [
  'TokenMeta',
  'TokenMeta.tokenId',
  'Token.id',
] as const
