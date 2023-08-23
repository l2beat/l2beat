export function getTokenTvlKey(token: string, assetType: string): string {
  return `${token}:${assetType}`
}
