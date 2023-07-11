export function assertUnreachable(_: never): never {
  throw new Error('Unreachable case reached. This is a programmer error!')
}
