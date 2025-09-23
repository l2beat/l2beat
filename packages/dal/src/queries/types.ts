export type BreakdownItem = { [k: string]: string | number | bigint }

// biome-ignore lint/suspicious/noExplicitAny: need any here
export type DropFirst<T extends unknown[]> = T extends [any, ...infer U]
  ? U
  : never

export type Simplify<T> = { [K in keyof T]: T[K] } & {}
