import type { AbstractToken } from '~/mock/types'

export function getAbstractTokenDisplayId(abstractToken: AbstractToken) {
  return `${abstractToken.id}:${abstractToken.issuer}.${abstractToken.symbol}`
}
