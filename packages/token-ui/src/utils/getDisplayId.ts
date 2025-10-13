export function getAbstractTokenDisplayId<
  T extends { id: string; issuer: string | null; symbol: string },
>(abstractToken: T) {
  return `${abstractToken.id}:${abstractToken.issuer}:${abstractToken.symbol}`
}

export function getDeployedTokenDisplayId<
  T extends { chain: string; address: string },
>(deployedToken: T) {
  return `${deployedToken.chain}+${deployedToken.address}`
}
