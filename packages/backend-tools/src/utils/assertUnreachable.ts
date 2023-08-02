export function assertUnreachable(_: never): never {
  throw new Error('Code reached an unreachable point')
}
