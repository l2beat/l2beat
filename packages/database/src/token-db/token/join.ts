export const joinNetwork = [
  'public.Network',
  'public.Network.id',
  'public.Token.networkId',
] as const

export const joinDeployment = [
  'public.Deployment',
  'public.Deployment.tokenId',
  'public.Token.id',
] as const

export const joinTokenMeta = [
  'public.TokenMeta',
  'public.TokenMeta.tokenId',
  'public.Token.id',
] as const
