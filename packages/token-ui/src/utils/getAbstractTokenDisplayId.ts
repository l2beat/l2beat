export function getAbstractTokenDisplayId<
  T extends { id: string; issuer?: string; symbol: string },
>(abstractToken: T) {
  return `${abstractToken.id}:${abstractToken.issuer}.${abstractToken.symbol}`
}
