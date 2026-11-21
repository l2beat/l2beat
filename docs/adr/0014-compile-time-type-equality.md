# 14. Compile-time type equality

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/types/typeAssertions.ts`

Where two declarations must agree (a schema and a database row, a validator
enum and a config union), we pin them with `type _ = Expect<Equal<X, Y>>`. It
fails to compile unless `X` and `Y` are the same type, so they cannot drift
apart unnoticed.
