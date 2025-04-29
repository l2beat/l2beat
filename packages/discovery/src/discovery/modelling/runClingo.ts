export async function runClingo(program: string) {
  // import full clingo-wasm only if this function is called
  const clingoModule = await import('clingo-wasm')
  // @ts-ignore Handle both ESM and CommonJS module formats,
  // so that it works in unit tests.
  const run = clingoModule.default.run ?? clingoModule.run

  const clingoResult = await run(program, 0)
  return clingoResult
}
