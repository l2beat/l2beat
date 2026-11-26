export function getAbstractTokenDisplayId<
  T extends { id: string; issuer: string | null; symbol: string },
>(abstractToken: T) {
  return `${abstractToken.id}:${abstractToken.issuer}:${abstractToken.symbol}`
}

/**
 * Abstract token display ids have the shape `<id>:<issuer>:<symbol>`. Only the
 * `<id>` prefix is the unique identifier used to look tokens up.
 */
export function extractAbstractTokenId(displayId: string): string {
  return displayId.split(':')[0] ?? displayId
}
