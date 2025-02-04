export function getChain(
  projectParams: { hostChain?: string },
  permissionOrContract: { chain?: string },
) {
  return permissionOrContract.chain ?? projectParams.hostChain ?? 'ethereum'
}
