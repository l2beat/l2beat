/**
 * `type _ = Expect<Equal<X, Y>>` fails to compile unless X and Y are the same
 * type, so two declarations that must agree (a schema and a DB row, a
 * validator enum and a config union) cannot drift silently.
 */
export type Expect<T extends true> = T
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false
